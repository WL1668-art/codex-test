# 项目开发规范

1. 遵守全局 GitHub 安全开发工作流，不直接修改受保护的 `main` 分支。
2. 仓库修改默认采用：新分支 → 修改 → 本地或实际验证 → commit → Pull Request。
3. Pull Request 创建后等待人工审核，不自行合并。
4. GitHub 远程操作优先使用 GitHub MCP。
5. 修改前先识别项目技术栈和现有工具，不擅自引入新的包管理器、测试框架或构建系统。
6. 优先使用仓库已有的 lint、test、typecheck 和 build 命令。
7. 如果仓库尚未定义真实测试，必须明确说明，不得伪造“测试通过”。
8. `.github/workflows/ci.yml` 中长期保持 required job 名称为 `ci`。
9. 当项目技术栈发生变化时，可以调整 `ci` job 的内部步骤，但不要随意更改 job 名称。
10. 不得把 PAT、API Key、密码、私钥或其他秘密信息写入仓库。
11. Pull Request 描述必须说明修改内容、实际验证、未验证项和已知风险。
12. 只读任务不得产生 commit、分支或 Pull Request。
