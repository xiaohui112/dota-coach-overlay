import type { ElectronCoachApi } from '../shared/types.js';

declare global {
  interface Window {
    coach?: ElectronCoachApi;
  }
}

export {};
