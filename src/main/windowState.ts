import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';
import type { OverlayState, WindowBounds } from '../shared/types.js';

const DEFAULT_STATE: OverlayState = {
  expanded: false,
  clickThrough: false,
  hidden: false,
  alwaysOnTop: true
};

export class WindowStateStore {
  private readonly filePath: string;
  private state: OverlayState;

  constructor(userDataPath: string) {
    this.filePath = join(userDataPath, 'overlay-state.json');
    this.state = this.load();
  }

  get(): OverlayState {
    return { ...this.state };
  }

  set(partial: Partial<OverlayState>): OverlayState {
    this.state = { ...this.state, ...partial };
    this.save();
    return this.get();
  }

  setBounds(bounds: WindowBounds): OverlayState {
    return this.set({ bounds });
  }

  private load(): OverlayState {
    if (!existsSync(this.filePath)) return DEFAULT_STATE;
    try {
      const parsed = JSON.parse(readFileSync(this.filePath, 'utf8')) as Partial<OverlayState>;
      return { ...DEFAULT_STATE, ...parsed };
    } catch {
      return DEFAULT_STATE;
    }
  }

  private save(): void {
    mkdirSync(dirname(this.filePath), { recursive: true });
    writeFileSync(this.filePath, JSON.stringify(this.state, null, 2), 'utf8');
  }
}
