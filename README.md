# 侣途相册

侣途相册是一款桌面旅行照片地图应用。它可以把照片按地点整理到中国地图上，适合记录旅行、约会、家庭出游和重要回忆。

## 主要功能

- 导入多张照片，自动读取照片里的 GPS 位置信息。
- 没有定位的照片，可以通过“国家、省/直辖市、市、区县”四级地址选择器手动定位。
- 中国地图默认显示完整中国范围，并优先显示省份名称。
- 地图上只显示中国地名；台湾显示为“台湾省”。
- 地图爱心标记会常驻显示地点名称，鼠标悬停时会跳动，并弹出相册封面缩略图。
- 支持按地点查看相册合集。
- 支持给每个地点相册设置封面照片。
- 支持在照片详情页编辑地点、日期和故事。
- 支持删除照片；相册清空后会自动回到主界面。

## 安装使用

### Windows

从 Releases 页面下载：

- `侣途相册 Setup 0.1.0.exe`：安装版，适合日常使用。
- `侣途相册 0.1.0.exe`：便携版，双击即可运行。

### macOS

从 Releases 页面下载：

- `侣途相册-mac.zip`

解压后打开 `侣途相册.app` 即可使用。

## 使用说明

1. 打开应用后，点击地图右上角的“+”导入照片。
2. 有 GPS 的照片会自动显示在地图上。
3. 没有 GPS 的照片，可以在照片信息里选择国家、省/直辖市、市、区县。
4. 只选到“市”也可以粗略定位；继续选择“区县”会更精确。
5. 点击地图上的爱心标记，可以进入对应地点相册。
6. 在地点相册中可以管理照片，并设置相册封面。
7. 在单张照片详情页中，也可以直接点击“设为封面”。

## 本地开发

本项目使用 Electron 打包桌面应用，核心界面由 HTML、CSS 和 JavaScript 实现。

安装依赖：

```bash
npm install
```

启动开发版：

```bash
npm start
```

打包 Windows 安装版和便携版：

```bash
npm run build:win -- --publish=never
```

## 项目结构

```text
.
├── index.html
├── styles.css
├── app.js
├── assets/
│   └── china-locations.js
├── electron/
│   └── main.cjs
├── macos/
│   ├── Info.plist
│   └── TravelAlbumApp.swift
├── scripts/
│   └── generate-china-locations.cjs
├── package.json
└── package-lock.json
```

## 地址数据

中国省、市、区县选择数据位于：

```text
assets/china-locations.js
```

如需重新生成地址数据，可以参考：

```text
scripts/generate-china-locations.cjs
```

## 注意事项

- 照片数据保存在本地浏览器存储中，不会自动上传到网络。
- 地图底图资源依赖在线地图服务，首次打开或网络较慢时可能需要等待加载。
- Windows 安装包和 macOS 压缩包建议放在 GitHub Releases 中，不建议直接提交进源码仓库。

