import { app, BrowserWindow, globalShortcut, ipcMain, screen } from 'electron';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { demoPayload, type DemoStage } from '../data/demoPayloads.js';
import { GsiServer } from './gsiServer.js';
import { getInstallStatus, installGsiConfig } from './gsiInstaller.js';
import { WindowStateStore } from './windowState.js';
import { constrainBoundsToWorkArea, snapBoundsToWorkArea } from '../shared/windowGeometry.js';
import type { LiveSnapshot, OverlayState, WindowBounds } from '../shared/types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MINI_SIZE = { width: 360, height: 180 };
const EXPANDED_SIZE = { width: 420, height: 560 };

let mainWindow: BrowserWindow | null = null;
let stateStore: WindowStateStore;
const gsiServer = new GsiServer();
/** 穿透模式下，鼠标是否在可点击区域（由渲染进程上报） */
let pointerInteractive = false;

function toWindowBounds(bounds: Electron.Rectangle): WindowBounds {
  return {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height
  };
}

function currentSize(state: OverlayState): { width: number; height: number } {
  return state.expanded ? EXPANDED_SIZE : MINI_SIZE;
}

function initialBounds(state: OverlayState): WindowBounds {
  const primary = screen.getPrimaryDisplay().workArea;
  const size = currentSize(state);
  if (state.bounds) {
    return constrainBoundsToWorkArea({ ...state.bounds, ...size }, primary);
  }
  return {
    width: size.width,
    height: size.height,
    x: primary.x + primary.width - size.width - 16,
    y: primary.y + 90
  };
}

function applyAlwaysOnTop(win: BrowserWindow): void {
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
}

function syncMouseIgnore(win: BrowserWindow): void {
  const { clickThrough } = stateStore.get();
  if (!clickThrough) {
    win.setIgnoreMouseEvents(false);
    return;
  }
  win.setIgnoreMouseEvents(!pointerInteractive, { forward: true });
}

function applyClickThrough(win: BrowserWindow): void {
  if (!stateStore.get().clickThrough) {
    pointerInteractive = false;
  }
  syncMouseIgnore(win);
}

function getSnapshot(): LiveSnapshot {
  const overlay = stateStore.get();
  return {
    liveState: gsiServer.getLiveState(),
    advice: gsiServer.getAdvice(),
    overlay,
    installStatus: getInstallStatus()
  };
}

function sendOverlayState(): void {
  if (!mainWindow) return;
  mainWindow.webContents.send('overlay-state', stateStore.get());
}

function updateOverlayState(partial: Partial<OverlayState>): OverlayState {
  const state = stateStore.set(partial);
  const win = mainWindow;
  if (!win) return state;

  applyAlwaysOnTop(win);
  applyClickThrough(win);
  if (state.hidden) {
    win.hide();
  } else {
    win.showInactive();
  }
  sendOverlayState();
  return state;
}

function setExpanded(expanded: boolean): OverlayState {
  if (!mainWindow) return stateStore.set({ expanded });
  const state = stateStore.set({ expanded });
  const size = currentSize(state);
  const display = screen.getDisplayMatching(mainWindow.getBounds()).workArea;
  const current = toWindowBounds(mainWindow.getBounds());
  const next = constrainBoundsToWorkArea({ ...current, ...size }, display);
  mainWindow.setBounds(next, false);
  stateStore.setBounds(next);
  sendOverlayState();
  return stateStore.get();
}

function createWindow(): BrowserWindow {
  const state = stateStore.get();
  const bounds = initialBounds(state);
  const win = new BrowserWindow({
    ...bounds,
    frame: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    show: !state.hidden,
    skipTaskbar: false,
    hasShadow: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  applyAlwaysOnTop(win);
  applyClickThrough(win);

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    void win.loadURL(devServerUrl);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    void win.loadFile(join(__dirname, '../../dist-renderer/index.html'));
  }

  let snapTimer: NodeJS.Timeout | null = null;
  let snapping = false;
  win.on('move', () => {
    if (snapping) return;
    if (snapTimer) clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      if (!mainWindow) return;
      const display = screen.getDisplayMatching(mainWindow.getBounds()).workArea;
      const snapped = snapBoundsToWorkArea(toWindowBounds(mainWindow.getBounds()), display);
      snapping = true;
      mainWindow.setBounds(snapped, false);
      snapping = false;
      stateStore.setBounds(snapped);
      sendOverlayState();
    }, 120);
  });

  win.on('closed', () => {
    mainWindow = null;
  });

  return win;
}

function registerIpc(): void {
  ipcMain.handle('coach:get-live-snapshot', () => getSnapshot());
  ipcMain.handle('coach:install-gsi', async (_event, dotaPath?: string) => installGsiConfig(dotaPath));
  ipcMain.handle('coach:toggle-expanded', () => setExpanded(!stateStore.get().expanded));
  ipcMain.handle('coach:set-expanded', (_event, expanded: boolean) => setExpanded(expanded));
  ipcMain.handle('coach:toggle-click-through', () => updateOverlayState({ clickThrough: !stateStore.get().clickThrough }));
  ipcMain.handle('coach:set-pointer-interactive', (_event, interactive: boolean) => {
    if (!mainWindow) return;
    const next = Boolean(interactive);
    if (next === pointerInteractive) return;
    pointerInteractive = next;
    syncMouseIgnore(mainWindow);
  });
  ipcMain.handle('coach:hide-overlay', () => updateOverlayState({ hidden: true }));
  ipcMain.handle('coach:show-overlay', () => updateOverlayState({ hidden: false }));
  ipcMain.handle('coach:send-demo-payload', (_event, stage?: DemoStage) => {
    gsiServer.injectPayload(demoPayload(stage));
    return getSnapshot();
  });
  ipcMain.handle('coach:quit-app', () => {
    app.quit();
  });
}

function registerShortcut(accelerator: string, handler: () => void): void {
  if (globalShortcut.register(accelerator, handler)) return;
  console.warn(`[coach] 快捷键注册失败: ${accelerator}`);
}

function registerShortcuts(): void {
  registerShortcut('CommandOrControl+Shift+F8', () => {
    updateOverlayState({ clickThrough: !stateStore.get().clickThrough });
  });
  registerShortcut('CommandOrControl+Shift+F9', () => {
    setExpanded(!stateStore.get().expanded);
  });
  registerShortcut('CommandOrControl+Shift+F10', () => {
    updateOverlayState({ hidden: !stateStore.get().hidden });
  });
}

app.setName('Dota Coach Overlay');
app.setAppUserModelId('local.dota-coach-overlay');

void app.whenReady().then(async () => {
  stateStore = new WindowStateStore(app.getPath('userData'));
  registerIpc();
  mainWindow = createWindow();
  registerShortcuts();
  await gsiServer.start();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('before-quit', () => {
  void gsiServer.stop();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
