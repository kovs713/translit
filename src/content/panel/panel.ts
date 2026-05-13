import type { StoredState } from '../../shared/state';
import { bindPanelDrag } from './drag';
import { PANEL_TEMPLATE } from './panel-template';
import { setPanelTransform, type PanelPosition } from './position';

type PanelControls = {
  active: HTMLInputElement;
  handle: HTMLElement;
  hide: HTMLButtonElement;
  map: HTMLTextAreaElement;
  reset: HTMLButtonElement;
  status: HTMLElement;
};

type CreatePanelOptions = {
  getPosition: () => PanelPosition;
  onActiveChange: (active: boolean) => void;
  onHide: () => void;
  onMapInput: (mapText: string) => void;
  onPositionChange: (position: PanelPosition) => void;
  onPositionCommit: () => void;
  onReset: () => void;
  onResize: () => void;
};

export function createPanel(options: CreatePanelOptions) {
  let host: HTMLDivElement | null = null;
  let shadow: ShadowRoot | null = null;
  let controls: PanelControls | null = null;

  function show(position: PanelPosition) {
    ensurePanel();

    if (!host) return null;

    host.style.display = 'block';
    return setPosition(position.x, position.y);
  }

  function hide() {
    if (host) host.style.display = 'none';
  }

  function sync(state: StoredState, ruleCount: number) {
    if (!controls) return;

    controls.active.checked = state.active;
    controls.map.value = state.mapText;
    updateStatus(state, ruleCount);
  }

  function updateStatus(state: StoredState, ruleCount: number) {
    if (!controls) return;

    controls.status.textContent = `${state.active ? 'ON' : 'OFF'} / ${ruleCount} rules`;
  }

  function setPosition(x: number, y: number) {
    if (!host) return null;

    const next = setPanelTransform(host, x, y);
    options.onPositionChange(next);
    return next;
  }

  function isInsideEvent(event: Event) {
    return host != null && event.composedPath().includes(host);
  }

  function isInsideElement(element: Element) {
    return Boolean(host && (element === host || element.getRootNode() === shadow || host.contains(element)));
  }

  function ensurePanel() {
    if (host) return;

    host = document.createElement('div');
    host.id = 'cyrillic-input-translit-root';
    host.style.position = 'fixed';
    host.style.left = '0';
    host.style.top = '0';
    host.style.width = 'min(342px, calc(100vw - 16px))';
    host.style.zIndex = '2147483647';
    host.style.display = 'none';

    shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = PANEL_TEMPLATE;

    appendHost();
    bindPanelControls();
  }

  function appendHost() {
    if (!host) return;

    const parent = document.documentElement || document.body;
    if (parent) {
      parent.appendChild(host);
      return;
    }

    document.addEventListener(
      'DOMContentLoaded',
      () => {
        const nextParent = document.documentElement || document.body;
        if (host && nextParent && !host.isConnected) nextParent.appendChild(host);
      },
      { once: true },
    );
  }

  function bindPanelControls() {
    if (!shadow) return;

    const active = shadow.querySelector<HTMLInputElement>('[data-active]');
    const handle = shadow.querySelector<HTMLElement>('[data-drag-handle]');
    const hideButton = shadow.querySelector<HTMLButtonElement>('[data-hide]');
    const map = shadow.querySelector<HTMLTextAreaElement>('[data-map]');
    const reset = shadow.querySelector<HTMLButtonElement>('[data-reset]');
    const status = shadow.querySelector<HTMLElement>('[data-status]');

    if (!active || !handle || !hideButton || !map || !reset || !status) return;

    controls = { active, handle, hide: hideButton, map, reset, status };

    controls.hide.addEventListener('click', options.onHide);
    controls.active.addEventListener('change', () => {
      if (!controls) return;

      options.onActiveChange(controls.active.checked);
    });
    controls.map.addEventListener('input', () => {
      if (!controls) return;

      options.onMapInput(controls.map.value);
    });
    controls.reset.addEventListener('click', options.onReset);

    bindPanelDrag(controls.handle, {
      getPosition: options.getPosition,
      onEnd: options.onPositionCommit,
      setPosition,
    });

    window.addEventListener('resize', options.onResize);
  }

  return {
    hide,
    isInsideElement,
    isInsideEvent,
    setPosition,
    show,
    sync,
    updateStatus,
  };
}
