import { describe, expect, it } from 'vitest';
import { constrainBoundsToWorkArea, snapBoundsToWorkArea } from '../src/shared/windowGeometry.js';

const workArea = { x: 0, y: 0, width: 1920, height: 1080 };

describe('window geometry', () => {
  it('snaps near the right and top screen edge', () => {
    const snapped = snapBoundsToWorkArea({ x: 1538, y: 15, width: 360, height: 180 }, workArea);

    expect(snapped.x).toBe(1560);
    expect(snapped.y).toBe(0);
  });

  it('does not snap when outside the threshold', () => {
    const snapped = snapBoundsToWorkArea({ x: 120, y: 80, width: 360, height: 180 }, workArea);

    expect(snapped.x).toBe(120);
    expect(snapped.y).toBe(80);
  });

  it('constrains oversized movement back into the active work area', () => {
    const constrained = constrainBoundsToWorkArea({ x: -300, y: 1200, width: 420, height: 560 }, workArea);

    expect(constrained.x).toBe(0);
    expect(constrained.y).toBe(520);
  });
});
