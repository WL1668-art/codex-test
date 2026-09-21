# 案例17：Codex + PPT

本目录用于“上游能力冻结与案例17工作区准备”。它不是最终 `ppt-production` Skill，也不包含自动安装、环境引导或外部发布流程。

## 目录

```text
案例17/
├── upstream/     # 三个官方上游仓库的精确版本清单与获取位置
├── research/     # 架构与方法研究
├── outputs/      # 未来用户交付物；本轮为空
└── README.md
```

上游版本、许可证和获取状态见 [upstream/SOURCES.md](upstream/SOURCES.md)。未来生产架构见 [research/architecture.md](research/architecture.md)。本机网络策略阻断了 GitHub 的 Git 与归档下载，因此源码冻结副本尚未完成；不会将未检出的目录视为可用源码。

安全边界：本轮不执行上游脚本，不安装 Python/Node 包，不创建 venv、`.env` 或 API Key 配置，不修改 Git 全局配置、PATH、注册表、ACL，也不部署或上传内容。
