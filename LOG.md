# 项目日志 · 可爱动物园 Cute Zoo

本文件记录项目各阶段进展与现状快照。

## 2026-09-16 — 项目情况快照（HALL-21）

**仓库**：`https://github.com/eternal-yellowduck/zoo2026.git`
**分支**：`main`
**状态**：功能与素材齐备，线上站点尚未发布。

### 项目概况
纯静态「可爱动物园」动物小站：认识 12 只动物，点开卡片解锁冷知识。
零依赖、零构建，原生 HTML/CSS/JavaScript，可直接运行。

- 技术栈：纯静态前端（HTML/CSS/JS，无框架、无打包）
- 数据：12 只动物（`animals.js`，纯数据）
- 素材：12 张真实图片（`assets/images/*.jpg`）+ 12 段叫声（`assets/sounds/*.mp3`），均本地化，无外链

### 已实现功能
- 动物卡片墙 + 详情弹窗（多条冷知识 / 分类 / 栖息地 / IUCN 保护级别）
- 搜索（中文名/英文名实时过滤）+ 分类按钮筛选
- 分享链接：每只需独立 URL（`#/animal/:id` hash 路由，支持前进/后退/外链）
- 收藏（localStorage 跨会话保留）、深色模式（跟随系统 + 手动切换并记忆）
- 每日一动物（按日期确定性推荐，同日所有人一致）
- 无障碍：原生 `<dialog>` 焦点圈闭、Esc 关闭、对比度 ≥ WCAG AA、aria 标注

### 工程与部署
- 已配置 GitHub Pages 部署流水线：`.github/workflows/deploy.yml`
  - 触发：push 到 `main` 或手动 `workflow_dispatch`
  - 步骤含静态资源校验（index.html / styles.css / animals.js / script.js）
- **当前线上站点状态：未发布**（访问 `https://eternal-yellowduck.github.io/zoo2026/` 返回 GitHub Pages 404）。
  原因：仓库 Settings → Pages → Source 尚未选择「GitHub Actions」，流水线虽在但未被启用。
- LICENSE 为 MIT 占位，正式版权归属待项目负责人确认。

### 提交历史（近况）
- `a21eda1` Merge PR #3 — 阶段3 体验增强（收藏/深色模式/每日一动物 + 详情媒体无障碍，HALL-12）
- `c7d9ad3` feat: 阶段3 体验增强
- `e3ae455` feat: 阶段3 真实动物图片与叫声素材（HALL-13）
- `c597c8c` feat: 阶段0-2 工程基线/可访问性/功能升级 + Pages 部署流水线（HALL-11）
- `638dc09` feat: 添加可爱的动物网站

共 3 个 PR 已合并（#1 #2 #3）。

### 结论与建议
项目功能与素材均已齐备，代码处于健康状态。唯一缺口是线上发布未启用——
按 README「启用 GitHub Pages」三步走，在仓库 Settings 选择 GitHub Actions 源并推一次 main 即可上线。
建议由项目负责人完成 Pages 启用，并核对 `index.html` 中 `og:url` / `og:image` 的绝对地址。
