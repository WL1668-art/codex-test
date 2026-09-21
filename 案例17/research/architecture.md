# 案例17：未来 `ppt-production` 架构

## 定位与边界

未来只向用户暴露一个主 Skill：`ppt-production`。它编排内容、设计、组装、视觉检查和交付；不会把三个上游仓库分别暴露为并列的用户入口。

| 冻结上游 | 在未来架构中的角色 | 使用方式 |
|---|---|---|
| `frontend-slides` | HTML、布局与版式生产底层能力 | 按页选用其非执行型模板、样式与布局参考 |
| `beautiful-html-templates` | reference/template library | 通过 `AGENTS.md`、`index.json`、完整 `templates/`、截图与 `runtime/deck-stage.js` 检索视觉方向；不注册 Skill |
| `codex-ppt-skill` | 方法论研究源 | 吸收 outline、style、image prompt、QA、speaker notes 的质量门槛；不采用其 Python bootstrap/API 工作流 |

## 两种互补的生产模式

### Editable/Object mode（默认组装路线）

适用于信息密度、后续修改和数据准确性优先的页面：

- 使用原生文本、shape、image、chart 和 table；
- 尽可能保留可编辑性，尤其是标题、正文、数据标签、图表、表格、时间线和流程图；
- 默认由 Node + PptxGenJS 组装；
- 适合内容页、KPI 页、路线图、比较页、图表页和表格页。

### Visual/Hero mode（按需使用）

适用于视觉叙事优先、需要显著记忆点的页面：

- 用于高视觉封面、创意插页或核心叙事画面；
- 必要时调用 Codex image tool 生成视觉素材；
- 可以采用整页视觉，但优先把可变标题、页码、来源或关键说明保留为原生对象；
- 适合封面、章节分隔页、概念隐喻页与少量高潮页面。

一套 deck 可以逐页混合两种模式。不能默认把整套 PPT 制成不可编辑图片，也不能为了“可编辑”而放弃封面和关键叙事页应有的视觉表现。

## 按页面任务决策

1. 先完成 outline，并为每页标注目标、受众动作、信息密度和更新频率。
2. 将需要反复修改、精确对齐或承载数据的页面标为 Object；将承担品牌情绪或故事转折的页面标为 Hero。
3. Hero 页若使用整页图像，仍须检查文字可读性、授权/来源、裁切和导出后的清晰度。
4. Object 页以组件化设计系统保持高质量：网格、留白、层级、颜色、字体、图表规范和一致的页脚/页码。
5. 在交付前按页进行内容、溢出、对比度、图像裁切、可编辑性和 speaker notes QA，并以实际 PPTX 打开或渲染结果验收。

## 未来流水线（尚未实现）

`brief → outline → page-mode map → visual/style direction → object/hero asset assembly → PPTX generation → render/open QA → delivery`

本轮仅冻结来源与记录架构；未创建 `ppt-production` Skill，未生成 PPT，也未安装运行时或依赖。
