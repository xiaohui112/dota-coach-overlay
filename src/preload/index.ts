import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronCoachApi, GsiInstallResult, LiveSnapshot, OverlayState } from '../shared/types.js';
import type { DemoStage } from '../data/demoPayloads.js';

const api: ElectronCoachApi = {
  getLiveSnapshot: () => ipcRenderer.invoke('coach:get-live-snapshot') as Promise<LiveSnapshot>,
  installGsi: (dotaPath?: string) => ipcRenderer.invoke('coach:install-gsi', dotaPath) as Promise<GsiInstallResult>,
  toggleExpanded: () => ipcRenderer.invoke('coach:toggle-expanded') as Promise<OverlayState>,
  setExpanded: (expanded: boolean) => ipcRenderer.invoke('coach:set-expanded', expanded) as Promise<OverlayState>,
  toggleClickThrough: () => ipcRenderer.invoke('coach:toggle-click-through') as Promise<OverlayState>,
  hideOverlay: () => ipcRenderer.invoke('coach:hide-overlay') as Promise<OverlayState>,
  showOverlay: () => ipcRenderer.invoke('coach:show-overlay') as Promise<OverlayState>,
  sendDemoPayload: (stage?: DemoStage) => ipcRenderer.invoke('coach:send-demo-payload', stage) as Promise<LiveSnapshot>
};

contextBridge.exposeInMainWorld('coach', api);
