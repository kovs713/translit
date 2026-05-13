import type { PanelPosition } from './position';

type DragState = {
  id: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
};

type BindPanelDragOptions = {
  getPosition: () => PanelPosition;
  onEnd: () => void;
  setPosition: (x: number, y: number) => PanelPosition | null;
};

export function bindPanelDrag(handle: HTMLElement, options: BindPanelDragOptions) {
  let drag: DragState | null = null;

  handle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest('button')) return;

    const position = options.getPosition();
    drag = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: position.x,
      y: position.y,
    };
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  handle.addEventListener('pointermove', (event) => {
    if (!drag || drag.id !== event.pointerId) return;

    options.setPosition(drag.x + event.clientX - drag.startX, drag.y + event.clientY - drag.startY);
  });

  const stopDrag = (event: PointerEvent) => {
    if (!drag || drag.id !== event.pointerId) return;

    drag = null;
    options.onEnd();
  };

  handle.addEventListener('pointerup', stopDrag);
  handle.addEventListener('pointercancel', stopDrag);
}
