---
name: life-kline-production
description: 将真实或虚构人物的人生、职业历程制作成 K 线式可视化、互动人生轨迹，或基于既有人生 K 线模板生产新作品。普通人物资料总结、普通时间线和普通股票分析不要触发。默认必须先研究人物并锁定结构化数据，不能一开始就修改页面。
---

# Life K-line Production

把人物经历转译为可解释的叙事 K 线，并在数据锁定后制作可交互的单页作品。保留“叙事指数”边界：图形表达叙事判断，不冒充客观历史定量。

## 入口与产物

典型调用：`$life-kline-production 人物：朱棣`

开始时先确认人物、时间范围、节点数量或密度、章节数量及史实/设定边界。用户未指定页面技术栈时，默认输出单文件 `index.html`，只用内联 HTML、CSS、Canvas 和原生 JavaScript。

## 必须顺序执行

1. **定义口径。** 明确：开盘=阶段起点处境；收盘=阶段结束处境；最高=阶段触及的机会、权力或影响力上限；最低=阶段风险或代价下限；冲击量=事件改变人生走势的强度。明确所有数值均为 0–100 叙事指数。
2. **研究人物。** 先收集和核对能支撑节点选择的资料；区分事实、争议、推断与虚构设定。当前或陌生事实应使用可靠来源。
3. **只做数据。** 页面代码在数据阶段完成前禁止开始。按 `year, age, title, open, high, low, close, volume, chapter, phase, note` 生成结构化 `candles`。
4. **校验并锁定。** 阅读 [references/data-schema.md](references/data-schema.md)，运行 `scripts/validate-candles.py`。修复所有 FAIL；让用户确认数据锁定。锁定后不得在页面制作阶段静默改数值、节点或章节。
5. **套用实现。** 仅在数据锁定后，以 [assets/golden-template.html](assets/golden-template.html) 为实现参考。必须替换人物数据、标题和叙事；不得把模板中的朱元璋内容当作通用默认数据。
6. **完成交互与跨端。** 默认五状态为 `opening / travel / focus / chapterReview / globalReview`。保留开场门、章节闸门、连续时间轴、重点节点停留、章节回望和全局回望。
7. **完整验收。** 阅读 [references/acceptance-checklist.md](references/acceptance-checklist.md)，完成真实桌面、手机、主题、reduced-motion、状态机和 Canvas 验证。通过后才可在用户授权范围内执行 Git 提交。

详细阶段、顺序依赖和冻结参数见 [references/production-workflow.md](references/production-workflow.md)。

## 默认体验参数

- 轨迹累计实际运动时间约 `4000ms`，章节闸门等待不计入。
- 轨迹经过节点后约 `220ms` 揭示 K 线；再延迟 `140ms` 揭示 volume。
- 镜头倍率：travel `1.00`、focus `1.12`、chapterReview `0.82`、globalReview `0.50`。
- 主题：暮山紫、宫墙朱、山水墨、暗夜盘。主题只改变视觉变量，不重置播放状态。
- 手机端不依赖键盘；提供轻点开始/继续、局部横向时间轴、自适应年份 tick 和章节导航跟随。
- `prefers-reduced-motion` 只减少或缩短动画，不得跳过 opening 或任何 chapterReview。

这些是经过验证的默认值。只有用户明确要求改变节奏或产品方向时才调整，并重新完成对应验收。

## Validator

对 HTML 或 JavaScript 数据源：

```text
python scripts/validate-candles.py path/to/index.html
```

对 JSON 数组或含 `candles` 键的 JSON：

```text
python scripts/validate-candles.py path/to/candles.json
```

如需限定章节白名单：

```text
python scripts/validate-candles.py path/to/index.html --chapters "第一章,第二章,第三章,第四章,第五章"
```

脚本返回明确的 `PASS` 或 `FAIL`，并用节点序号与年份定位问题。重复年份合法，不应去重。

## 边界

- 不把 K 线叙事指数描述成历史、传记或职业表现的客观评分。
- 不因模板存在而跳过研究、数据审阅和锁定。
- 不用一个巨型定时器承载状态、揭示、镜头、时间轴和叙事卡；分别维护这些状态。
- 不在验收前承诺完成；不因“减少动画”删除交互门。
- Git、发布、外部上传或 PR 仍需遵循用户授权和仓库规则；本 Skill 不自动扩大权限。
