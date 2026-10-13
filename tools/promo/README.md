# 29 秒代码宣传片

1080×1920 竖屏，30 fps。Playwright 在 Chromium 中重放真实 WebView 前端，逐帧截图交给 FFmpeg 编码；HTML 控制字幕、连续镜头运动、触摸提示和转场。界面操作包含课程查看、Excel 汇总确认、调休保存、活动提醒。输入都是仓库合成样例，没有用户真实课程。锁屏一段明确标注“示意”，并非 Android 实录或跨厂商布局保证。

旁白由 macOS 已安装的 Tingting 语音生成；背景音乐由 make_audio.py 用正弦波和包络原创合成，没有采用外部歌曲。视频 0.3.0 与锁屏功能均为待真机验收测试版。

## 复现（macOS）

先按项目构建文档生成 android-app/assets。需要 Node.js、Python 3、FFmpeg，以及 macOS 内置 say/Tingting。

```sh
cd tools/promo
npm install --prefix .deps playwright-core
node .deps/node_modules/playwright-core/cli.js install chromium
node render.mjs --preview
node render.mjs
python3 make_audio.py
ffmpeg -y -i output/silent.mp4 -i output/soundtrack.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -t 29 -movflags +faststart output/kejian-0.3.0-promo.mp4
```

已有 Chromium 可设置 KEJIAN_CHROMIUM 指向执行文件，无需再次下载。依赖仅位于 .deps，可在完成后删除；不进入 APK。qa 为本地质检截图，output 为生成文件，均不提交。

本轮视频校验：870 帧，870 个不同的帧哈希；全片解码无错误，视频与声音均为 29 秒。已检查 15 张时间线预览及成片抽帧；这不代表 Android 真机 UI 验证。

方法参考：[Playwright 视频与浏览器上下文](https://playwright.dev/docs/videos)、[Remotion 代码渲染思路](https://www.remotion.dev/docs/render)。本实现没有依赖 Remotion。
