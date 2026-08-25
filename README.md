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
├── assets/
│   ├── images/             # 12 张动物真实照片（<id>.jpg，来源与许可见下文）
│   └── sounds/             # 12 段动物叫声（<id>.mp3，来源与许可见下文）
├── favicon.svg             # 占位 favicon（emoji 绘制）
├── og-image.png            # Open Graph 分享占位图
├── .github/workflows/deploy.yml  # GitHub Pages 部署流水线
└── LICENSE                 # MIT（占位，正式版权归属待确认）
```

## 数据模型

`animals.js` 中每只动物的结构如下，`image` 与 `soundUrl` 已接入本地真实素材（见下文「素材来源与许可」）：

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

## 素材来源与许可

全部 24 项素材（12 图 + 12 音频）均为 **CC0 / 公有领域 / CC BY（可商用，需署名）**，不含 NC/ND/BY-SA 或版权未知素材。图片取自 Wikimedia Commons，音频取自 Freesound 与 Wikimedia Commons，均已本地化到 `assets/`，无外链依赖。

音频仅做了截取（取叫声最清晰的片段）、响度归一化与淡入淡出处理，未改变素材内容。

### 图片（assets/images/，均来自 Wikimedia Commons）

| 文件 | 来源页面 | 作者 | 许可 |
| --- | --- | --- | --- |
| `rabbit.jpg` | [Rabbit paying attention around a burrow 1](https://commons.wikimedia.org/wiki/File:Rabbit_paying_attention_around_a_burrow_1.jpg) | Themium | CC0 |
| `cat.jpg` | [A curious kitten (Pixabay)](https://commons.wikimedia.org/wiki/File:A_curious_kitten_(Pixabay).jpg) | Dimitri Houtteman | CC0 |
| `dog.jpg` | [Portrait of a labrador retriever](https://commons.wikimedia.org/wiki/File:Portrait_of_a_labrador_retriever.jpg) | Dktue | CC0 |
| `panda.jpg` | [Giant Panda 2004-03-2](https://commons.wikimedia.org/wiki/File:Giant_Panda_2004-03-2.jpg) | Jeff Kubina | 公有领域 |
| `fox.jpg` | [Vulpes vulpes (44561825982)](https://commons.wikimedia.org/wiki/File:Vulpes_vulpes_(44561825982).jpg) | Tomek Niedzwiedz | CC0 |
| `koala.jpg` | [Koala in a tree at a caravan park in Somers](https://commons.wikimedia.org/wiki/File:Koala_in_a_tree_at_a_caravan_park_in_Somers.jpg) | Nick carson（英文维基百科） | 公有领域 |
| `penguin.jpg` | [Emperor penguin chicks at Sea World · DF-ST-90-04598](https://commons.wikimedia.org/wiki/File:Emperor_penguin_chicks_at_Sea_World_%C2%B7_DF-ST-90-04598.JPG) | Jose Lopez, Jr.（美国国防部） | 公有领域 |
| `tiger.jpg` | [A Bengal tiger observed at Pilibhit tiger reserve](https://commons.wikimedia.org/wiki/File:A_Bengal_tiger_(Panthera_tigris_tigris)_observed_at_Pilibhit_tiger_reserve.jpg) | Pixel009 | CC0 |
| `lion.jpg` | [Young African Lion (33560925282)](https://commons.wikimedia.org/wiki/File:Young_African_Lion_(33560925282).jpg) | Mathias Appel | CC0 |
| `frog.jpg` | [Red-eyed tree frog Belize 01](https://commons.wikimedia.org/wiki/File:Red-eyed_tree_frog_Belize_01.jpg) | Nosferattus | CC0 |
| `turtle.jpg` | [Green sea turtle. (14167623264)](https://commons.wikimedia.org/wiki/File:Green_sea_turtle._(14167623264).jpg) | Bernard Spragg. NZ | CC0 |
| `hamster.jpg` | [Pet Hamster eating cucumber](https://commons.wikimedia.org/wiki/File:Pet_Hamster_eating_cucumber.JPG) | Bernard Ladenthin | CC0 |

### 叫声（assets/sounds/，mp3 为本地重编码版本）

| 文件 | 来源 | 作者 | 许可 |
| --- | --- | --- | --- |
| `rabbit.mp3` | [Rabbit oinks and squeaks.wav（Commons，截取约 6 秒）](https://commons.wikimedia.org/wiki/File:Rabbit_oinks_and_squeaks.wav) | kessir | CC0 |
| `cat.mp3` | [Freesound #110011 "cat meow"](https://freesound.org/s/110011/) | tuberatanka | CC0 |
| `dog.mp3` | [Freesound #495658 "Dog Bark"](https://freesound.org/s/495658/) | aunrea | CC0 |
| `panda.mp3` | [Giant panda twittering.ogg（Commons）](https://commons.wikimedia.org/wiki/File:Giant_panda_twittering.ogg) | 未署名上传者 | 公有领域 |
| `fox.mp3` | [Freesound #676376 "Fox Scream Mating Call"（截取约 7 秒）](https://freesound.org/s/676376/) | drewtait | CC0 |
| `koala.mp3` | [雄性考拉叫声研究音频（Commons，截取约 8 秒）](https://commons.wikimedia.org/wiki/File:Perception-of-Male-Caller-Identity-in-Koalas-(Phascolarctos-cinereus)-Acoustic-Analysis-and-pone.0020329.s001.ogv) | Charlton B, Ellis W, McKinnon A, Brumm J, Nilsson K, Fitch W（PLoS ONE 论文补充材料） | CC BY 2.5 |
| `penguin.mp3` | [Freesound #150873 "Penguin Colony at Gourdin Island"（截取约 8 秒）](https://freesound.org/s/150873/) | al.barbosa | CC0 |
| `tiger.mp3` | [Freesound #263115 "Tiger Roar"（截取约 8 秒）](https://freesound.org/s/263115/) | lauramellis | CC0 |
| `lion.mp3` | [Freesound #110120 "Lions at Melbourne Zoo"（截取约 8 秒）](https://freesound.org/s/110120/) | polymorpheva | CC0 |
| `frog.mp3` | [Freesound #391520 "Frogs croaking"](https://freesound.org/s/391520/) | Kamix0 | CC0 |
| `turtle.mp3` | [Dermochelys coriacea 001.ogg（Commons，截取约 8 秒）](https://commons.wikimedia.org/wiki/File:Dermochelys_coriacea_001.ogg) | Philippe Kurlapski | CC BY 2.5 |
| `hamster.mp3` | [Freesound #815243 "hamster Squeak"（截取约 6 秒）](https://freesound.org/s/815243/) | lusania | CC0 |

> 两段 CC BY 2.5 素材（考拉、海龟）按许可要求在上表完成署名；CC0 与公有领域素材无需署名，列出仅为溯源。

## 启用 GitHub Pages

1. 进入仓库 **Settings → Pages**
2. **Build and deployment → Source** 选择 **GitHub Actions**
3. 推送到 `main` 分支（或在 Actions 页手动触发 "Deploy to GitHub Pages" workflow），流水线会自动完成校验与部署
4. 首次部署成功后，建议核对 `index.html` 中 `og:url` / `og:image` 的绝对地址与实际 Pages 域名一致

## License

MIT（占位）。正式版权归属与许可条款待项目负责人确认。
