# biliLive-tools

这是一个用于 B 站录播的一站式工具。

1. 支持 Danmufactory GUI
2. 支持 ffmpeg 转封装
3. 支持视频与弹幕压制
4. 支持调用 biliup 进行上传

# 下载

目前有两个 Win 版本的包。两个包处理有没有打包 `ffmpeg` 和 `ffprobe` 之外没有任何代码上的区别，如果你不需要转封装功能，可以尝试下载体积较小的包，我不是特别推荐。
如果你是普通用户，那就选择体积大的那个包，如果你是资深用户，那么请自行选择，因自编译 `ffmpeg` 出问题的 issue 是不会被处理的。

1. 自带 `ffmpeg` 版本的包
2. 调用环境变量中 `ffmpeg` 以及 `ffprobe` 的包，减小安装包体积。

# TODO

- [x] 支持使用ffmpeg压制弹幕至视频文件
- [ ] 工具页面
  - [x] 支持ffmpeg不同cpu，gpu以及相关配置
  - [x] 支持使用danmufactory自动处理xml文件并进行压制
  - [x] 工具页面，danmufactory的GUI
  - [x] 工具页面，flv的转封装
  - [ ] 支持视频合并
- [x] log记录及其展示
- [ ] 配置持久化，ffmpeg自定义预设，选择保存文件夹，平均码率、支持使用ass-convert来进行弹幕处理以及压制高能进度条
- [x] 支持上传B站
  - [ ] 移除biliup二进制文件依赖
- [ ] 支持录播姬webhook自动处理
  - [x] 支持自动上传
  - [ ] 支持合并后上传
  - [ ] 支持弹幕压制
  - [x] 支持分p续传
- [x] 打包不带ffmpeg的版本，支持自定义ffmpeg以及ffprobe
- [ ] 构建一个不依赖于electron的cli程序

# 开发

下载项目后需要新建一个`resources\bin`文件夹，里面需要三个文件。
同时需要在应用的设置中设置 ffmpeg 以及 ffprobe 可执行文件地址。

1. `DanmukuFactory.exe` [1.7.0版本](https://github.com/hihkm/DanmakuFactory/releases/tag/v1.70)
2. `ffmpeg.exe` [n6.0](https://github.com/BtbN/FFmpeg-Builds/releases)
3. `ffprobe.exe` [n6.0](https://github.com/BtbN/FFmpeg-Builds/releases)
4. `biliup.exe` [0.1.19](https://github.com/biliup/biliup-rs/releases/tag/v0.1.19)

## Install

```bash
$ npm install
```

## Development

```bash
$ npm run dev
```

## Build

```bash
# For windows
$ npm run build:win

# For windows but no ffmpeg
$ npm run build:win-no-ffmpeg
```

# License

GPLv3
