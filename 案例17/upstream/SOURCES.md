# 上游来源冻结清单（获取受阻）

获取尝试日期：2026-09-21（Asia/Shanghai）  
计划获取方法：对每个官方仓库初始化独立本地仓库，仅 fetch 下列精确对象 SHA，并以 detached HEAD 检出；不跟随默认分支，也不执行仓库内脚本。

**实际状态：受阻。** 已授权命令环境无法连接 `github.com:443`，官方 GitHub 固定-commit 归档 URL 也被浏览器策略以 `ERR_BLOCKED_BY_CLIENT` 拦截。因此下表是已核验的版本冻结清单，不是“已成功下载”的声明。

| 本地目录 | 官方 repository URL | pinned commit SHA | 许可证 | 获取状态 |
|---|---|---|---|---|
| `frontend-slides/` | `https://github.com/zarazhangrui/frontend-slides.git` | `9906a34d640d2111f724544cbc50f7f130569ae1` | MIT | 目录已建，未检出 |
| `beautiful-html-templates/` | `https://github.com/zarazhangrui/beautiful-html-templates.git` | `e5e204fb1f3b06290846e7dcd7aceddabeceec8c` | MIT | 目录已建，未检出 |
| `codex-ppt-skill/` | `https://github.com/ningzimu/codex-ppt-skill.git` | `a9a6e3951d2fad458ecd59558c13af09b08793f7` (`v0.6.0`) | MIT | 目录已建，未检出 |

## 使用边界

- `frontend-slides`：保留为 HTML/版式生产底层能力；不使用 Claude marketplace 包装，也不运行部署、全局 npm、浏览器下载或 Python PPTX 导入路径。
- `beautiful-html-templates`：仅作 reference/template library，不注册为 Codex Skill。
- `codex-ppt-skill`：仅研究其 outline、style、image prompt、QA 与 speaker notes 方法；不执行 bootstrap、venv、pip、`.env`、API Key 或第三方图像 API 流程。

后续仅可在连通官方 GitHub 后，以表内 SHA 成功 `fetch` 并 detached checkout；应先用 `git rev-parse HEAD` 验证，再把本文件中的获取状态更新为成功。任何未来更新必须显式更改本文件中的 SHA 后重新获取。
