# Dota Coach Overlay

Windows 本地 Dota 2 实时悬浮教练 MVP。应用通过 Dota 2 Game State Integration 接收本机可见状态，只做本地分析，不读内存、不抓包、不注入。

## 开发

```bash
npm install
npm run dev
```

开发模式会启动 Vite 和 Electron。悬浮窗默认 `360x180`，可通过按钮或快捷键展开到 `420x560`。

## Windows 使用

1. 在 Windows 机器上安装并启动 exe。
2. 点击扳手按钮写入 GSI 配置。默认 Dota 2 路径：
   `C:\Program Files (x86)\Steam\steamapps\common\dota 2 beta`
3. 在 Steam 的 Dota 2 启动项加入：
   `-gamestateintegration`
4. 将 Dota 2 显示模式设为无边框窗口。
5. 进入人机或正式对局，悬浮窗会自动收到 GSI 数据。

## 快捷键

- `Ctrl+Shift+F8`：切换点击穿透。
- `Ctrl+Shift+F9`：切换迷你/展开。
- `Ctrl+Shift+F10`：显示/隐藏悬浮窗。

## 打包

```bash
npm run dist:win
```

建议在 Windows 上执行 Windows exe 打包。当前项目内置 MetaDota2 当前版本整理数据，运行时不依赖网络。
