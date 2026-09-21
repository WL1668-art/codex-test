#!/usr/bin/env python3
"""Validate life K-line candles from JSON, JavaScript, or HTML."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any


REQUIRED_FIELDS = (
    "year", "age", "title", "open", "high", "low", "close",
    "volume", "chapter", "phase", "note",
)
NUMERIC_FIELDS = ("open", "high", "low", "close", "volume")


def find_array_after_marker(text: str, marker: str = "const candles") -> str:
    marker_at = text.find(marker)
    if marker_at < 0:
        raise ValueError(f"未找到 `{marker}`")
    start = text.find("[", marker_at)
    if start < 0:
        raise ValueError("未找到 candles 数组起始 `[`")

    depth = 0
    quote: str | None = None
    escaped = False
    for index in range(start, len(text)):
        char = text[index]
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            continue
        if char in ('"', "'"):
            quote = char
        elif char == "[":
            depth += 1
        elif char == "]":
            depth -= 1
            if depth == 0:
                return text[start:index + 1]
    raise ValueError("candles 数组缺少配对的 `]`")


def js_literal_to_json(array_text: str) -> str:
    quoted_keys = re.sub(
        r'([\{,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)(\s*:)',
        r'\1"\2"\3',
        array_text,
    )
    return re.sub(r",\s*([}\]])", r"\1", quoted_keys)


def load_candles(path: Path) -> list[Any]:
    text = path.read_text(encoding="utf-8-sig")
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        array_text = find_array_after_marker(text)
        try:
            parsed = json.loads(js_literal_to_json(array_text))
        except json.JSONDecodeError as error:
            raise ValueError(
                "candles 不是受支持的纯数据字面量；请避免表达式、函数、模板字符串或注释"
                f"（{error.msg}，行 {error.lineno} 列 {error.colno}）"
            ) from error

    if isinstance(parsed, dict):
        parsed = parsed.get("candles")
    if not isinstance(parsed, list):
        raise ValueError("输入必须是 candles 数组，或包含 `candles` 数组的 JSON 对象")
    return parsed


def is_number(value: Any) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def label(index: int, item: Any) -> str:
    year = item.get("year", "?") if isinstance(item, dict) else "?"
    return f"节点 {index + 1}（year={year}）"


def validate(candles: list[Any], allowed_chapters: set[str] | None) -> list[str]:
    issues: list[str] = []
    if not candles:
        return ["节点数必须大于 0"]

    previous: dict[str, Any] | None = None
    for index, item in enumerate(candles):
        where = label(index, item)
        if not isinstance(item, dict):
            issues.append(f"{where}: 节点必须是对象")
            previous = None
            continue

        missing = [field for field in REQUIRED_FIELDS if field not in item]
        if missing:
            issues.append(f"{where}: 缺少字段 {', '.join(missing)}")

        year = item.get("year")
        if not isinstance(year, int) or isinstance(year, bool) or not 1 <= year <= 9999:
            issues.append(f"{where}: year 必须是 1–9999 的整数")
        age = item.get("age")
        if not is_number(age) or not 0 <= age <= 200:
            issues.append(f"{where}: age 必须是 0–200 的数字")

        for field in NUMERIC_FIELDS:
            value = item.get(field)
            if not is_number(value) or not 0 <= value <= 100:
                issues.append(f"{where}: {field} 必须是 0–100 的数字")

        low, open_, close, high = (item.get(name) for name in ("low", "open", "close", "high"))
        if all(is_number(value) for value in (low, open_, close, high)):
            if not (low <= open_ <= high and low <= close <= high):
                issues.append(f"{where}: 必须满足 low <= open/close <= high")

        for field in ("title", "chapter", "phase", "note"):
            value = item.get(field)
            if not isinstance(value, str) or not value.strip():
                issues.append(f"{where}: {field} 必须是非空字符串")

        chapter = item.get("chapter")
        if allowed_chapters and isinstance(chapter, str) and chapter not in allowed_chapters:
            issues.append(f"{where}: chapter `{chapter}` 不在允许列表中")

        if previous is not None:
            previous_year = previous.get("year")
            if isinstance(previous_year, int) and isinstance(year, int) and year < previous_year:
                issues.append(f"{where}: year 小于上一节点 {previous_year}，年份必须非递减")
            previous_close = previous.get("close")
            if is_number(previous_close) and is_number(open_) and open_ != previous_close:
                issues.append(f"{where}: open={open_} 与上一节点 close={previous_close} 不连续")
        previous = item

    return issues


def main() -> int:
    parser = argparse.ArgumentParser(description="验证人生 K 线 candles 数据（JSON、JS 或 HTML）")
    parser.add_argument("input", type=Path, help="数据文件或包含 const candles 的 HTML/JS")
    parser.add_argument("--chapters", help="可选章节白名单，使用英文逗号分隔")
    args = parser.parse_args()

    allowed = None
    if args.chapters:
        allowed = {item.strip() for item in args.chapters.split(",") if item.strip()}

    try:
        candles = load_candles(args.input)
    except (OSError, ValueError) as error:
        print(f"FAIL: 无法读取 candles：{error}")
        return 2

    issues = validate(candles, allowed)
    if issues:
        print(f"FAIL: {len(issues)} 个问题")
        for issue in issues:
            print(f"- {issue}")
        return 1

    chapters = list(dict.fromkeys(item["chapter"] for item in candles))
    print(f"PASS: {len(candles)} 个节点；{len(chapters)} 个章节")
    print("chapters: " + " / ".join(chapters))
    return 0


if __name__ == "__main__":
    sys.exit(main())
