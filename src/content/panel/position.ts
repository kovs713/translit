import { DEFAULT_STATE } from '../../shared/state';

export type PanelPosition = {
  x: number;
  y: number;
};

export function setPanelTransform(host: HTMLElement, x: number, y: number): PanelPosition {
  const next = clampPanelPosition(host, x, y);
  host.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
  return next;
}

function clampPanelPosition(host: HTMLElement, x: number, y: number): PanelPosition {
  const rect = host.getBoundingClientRect();
  const width = rect.width || 342;
  const height = rect.height || 420;
  const maxX = Math.max(8, window.innerWidth - width - 8);
  const maxY = Math.max(8, window.innerHeight - height - 8);

  return {
    x: clamp(Math.round(Number(x) || DEFAULT_STATE.panelX), 8, maxX),
    y: clamp(Math.round(Number(y) || DEFAULT_STATE.panelY), 8, maxY),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
