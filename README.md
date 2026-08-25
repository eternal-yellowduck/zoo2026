# 🐾 可爱动物园 · Cute Zoo

一个纯静态的动物小站：认识 12 只毛茸茸的小动物，点开卡片解锁它们的冷知识。零依赖、零构建，原生 HTML/CSS/JavaScript 即可运行。

## 在线访问

站点计划通过 GitHub Pages 发布（见下文「启用 GitHub Pages」）。部署完成后访问地址为：

`https://eternal-yellowduck.github.io/zoo2026/`

## 本地预览

推荐通过本地 HTTP 服务预览（任选其一）：

```bash
# Python 3
python -m http.server 8000
# 然后浏览器打开 http://localhost:8000

# Node.js
npx serve .
```

也可以在 VS Code 中安装 Live Server 插件后右键 `index.html` → Open with Live Server。

## 功能特性

- 动物卡片墙：点击/回车打开详情弹窗
- 详情弹窗：多条冷知识、分类与栖息地标签、IUCN 保护级别（如有）
- 搜索：按中文名/英文名实时过滤；分类按钮筛选
- 分享链接：每只动物拥有独立 URL（hash 路由 `#/animal/:id`），支持浏览器前进/后退与直接外链打开
- 无障碍：原生 `<dialog>` 弹窗自带焦点圈闭与 Esc 关闭，关闭后焦点归还触发卡片；全部文字对比度 ≥ WCAG AA 4.5:1

## 目录结构

```text
.
├── index.html              # 页面结构（含 SEO/Open Graph meta）
├── styles.css              # 样式
├── animals.js              # 动物数据（纯数据，无逻辑）
├── script.js               # 渲染 / 搜索筛选 / hash 路由 / 弹窗逻辑
├── favicon.svg             # 占位 favicon（emoji 绘制）
├── og-image.png            # Open Graph 分享占位图
├── .github/workflows/deploy.yml  # GitHub Pages 部署流水线
└── LICENSE                 # MIT（占位，正式版权归属待确认）
```

## 数据模型

`animals.js` 中每只动物的结构如下，后续阶段只需填充 `image` 与 `soundUrl` 字段即可接入真实图片与叫声（详情视图已做好条件渲染）：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | 稳定唯一 ID，用于路由与分享链接 |
| `name` | string | 中文名 |
| `nameEn` | string? | 英文名 |
| `emoji` | string | 轻量标识 |
| `category` | string | `mammal` / `bird` / `reptile` / `amphibian` / `fish` / `other` |
| `habitat` | string[] | 栖息地标签 |
| `facts` | string[] | 多条冷知识 |
| `image` | string | 图片路径/URL，空字符串表示暂未接入 |
| `soundUrl` | string | 叫声音频路径/URL，空字符串表示暂未接入 |
| `conservation` | string? | IUCN 保护级别，如 `易危 VU` |

## 启用 GitHub Pages

1. 进入仓库 **Settings → Pages**
2. **Build and deployment → Source** 选择 **GitHub Actions**
3. 推送到 `main` 分支（或在 Actions 页手动触发 "Deploy to GitHub Pages" workflow），流水线会自动完成校验与部署
4. 首次部署成功后，建议核对 `index.html` 中 `og:url` / `og:image` 的绝对地址与实际 Pages 域名一致

## License

MIT（占位）。正式版权归属与许可条款待项目负责人确认。
