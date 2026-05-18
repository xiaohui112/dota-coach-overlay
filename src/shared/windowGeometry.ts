import type { DisplayWorkArea, WindowBounds } from './types.js';

export const SNAP_THRESHOLD_PX = 24;

export function constrainBoundsToWorkArea(bounds: WindowBounds, workArea: DisplayWorkArea): WindowBounds {
  const maxX = workArea.x + workArea.width - bounds.width;
  const maxY = workArea.y + workArea.height - bounds.height;
  return {
    ...bounds,
    x: Math.min(Math.max(bounds.x, workArea.x), Math.max(workArea.x, maxX)),
    y: Math.min(Math.max(bounds.y, workArea.y), Math.max(workArea.y, maxY))
  };
}

export function snapBoundsToWorkArea(
  bounds: WindowBounds,
  workArea: DisplayWorkArea,
  threshold = SNAP_THRESHOLD_PX
): WindowBounds {
  const constrained = constrainBoundsToWorkArea(bounds, workArea);
  const right = workArea.x + workArea.width - constrained.width;
  const bottom = workArea.y + workArea.height - constrained.height;
  let x = constrained.x;
  let y = constrained.y;

  if (Math.abs(constrained.x - workArea.x) <= threshold) x = workArea.x;
  if (Math.abs(constrained.x - right) <= threshold) x = right;
  if (Math.abs(constrained.y - workArea.y) <= threshold) y = workArea.y;
  if (Math.abs(constrained.y - bottom) <= threshold) y = bottom;

  return { ...constrained, x, y };
}
