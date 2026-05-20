import { demoPayload, type DemoStage } from '../data/demoPayloads.js';
import { generateAdvice } from '../shared/adviceEngine.js';
import { normalizeGsiPayload } from '../shared/gsi.js';
import type { ElectronCoachApi, GsiInstallResult, LiveSnapshot, OverlayState } from '../shared/types.js';

let overlay: OverlayState = {
  expanded: false,
  clickThrough: false,
  hidden: false,
  alwaysOnTop: true
};

let liveState = normalizeGsiPayload(demoPayload('mid'));

function snapshot(): LiveSnapshot {
  return {
    liveState,
    advice: generateAdvice(liveState),
    overlay,
    installStatus: {
      platform: 'browser-preview',
      defaultDotaPath: String.raw`D:\SteamLibrary\steamapps\common\dota 2 beta`,
      detected: false,
      launchOption: '-gamestateintegration',
      message: '浏览器预览模式'
    }
  };
}

export const mockApi: ElectronCoachApi = {
  async getLiveSnapshot() {
    return snapshot();
  },
  async installGsi(): Promise<GsiInstallResult> {
    return {
      ...snapshot().installStatus,
      installed: false
    };
  },
  async toggleExpanded() {
    overlay = { ...overlay, expanded: !overlay.expanded };
    return overlay;
  },
  async setExpanded(expanded: boolean) {
    overlay = { ...overlay, expanded };
    return overlay;
  },
  async toggleClickThrough() {
    overlay = { ...overlay, clickThrough: !overlay.clickThrough };
    return overlay;
  },
  async setPointerInteractive() {
    // 浏览器预览无穿透
  },
  async hideOverlay() {
    overlay = { ...overlay, hidden: true };
    return overlay;
  },
  async showOverlay() {
    overlay = { ...overlay, hidden: false };
    return overlay;
  },
  async quitApp() {
    // 浏览器预览无退出
  },
  async sendDemoPayload(stage?: DemoStage) {
    liveState = normalizeGsiPayload(demoPayload(stage));
    return snapshot();
  }
};
