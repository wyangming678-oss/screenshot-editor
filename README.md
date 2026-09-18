# 截图界面修改工具

一个完全在浏览器本地运行的手机截图编辑器，只重绘顶部状态栏与底部导航栏，保持截图中间内容和原始导出分辨率不变。

## 功能

- 上传 PNG、JPG 或 WebP 截图
- 修改时间、时间位置、4G/5G/LTE、信号、Wi-Fi、电量与通知图标
- 使用消除笔手动覆盖顶部原有内容，支持自定义颜色、从原图取色、撤销与清空
- 调节 Wi-Fi 信号强度，并添加 Telegram、Amazon、TikTok、短信、Uber、Facebook、Instagram 或自定义通知图标
- 调整顶部和底部覆盖范围、背景处理、透明度与颜色
- 切换手势横条、安卓三键、vivo OriginOS、小米 HyperOS、华为 HarmonyOS、图标 Dock 和简洁图标导航栏
- 按住对比原图，以原始像素导出 PNG 或 JPG

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开终端里提示的本地地址即可。

## 构建

项目使用 [vinext](https://github.com/cloudflare/vinext) 做纯静态导出，构建产物在 `dist/`：

```bash
npm ci
npm run build
```

## 部署到 GitHub Pages

仓库内置工作流 `.github/workflows/deploy.yml`，推到 `main` 分支后会自动构建并发布到 GitHub Pages。

首次使用需在仓库 **Settings → Pages → Build and deployment** 里把 **Source** 设为 **GitHub Actions**（这一步必须手动做一次，工作流不会自动开启 Pages）。

访问地址：

- 用户/组织主页仓库（仓库名为 `<用户名>.github.io`）：`https://<用户名>.github.io/`
- 普通项目仓库：`https://<用户名>.github.io/<仓库名>/`

`next.config.mjs` 会根据 `GITHUB_REPOSITORY` 自动设置 `basePath`，因此项目仓库也能正确加载静态资源；本地构建时不加前缀。工作流不使用 `configure-pages`，避免它自动改写配置时出错。
