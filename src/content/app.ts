import { browser } from 'wxt/browser';

import { DEFAULT_MAP_TEXT, DEFAULT_STATE, type StoredState } from '../shared/state';
import { isTogglePanelMessage } from '../shared/messages';
import { parseMap, transliterate, type TranslitMap } from '../shared/translit';
import { createInputRewriter } from './input-rewriter';
import { createPanel } from './panel/panel';
import type { PanelPosition } from './panel/position';
import { createStatePersistence, readStoredState } from './storage';

export function createContentApp() {
  let state: StoredState = { ...DEFAULT_STATE };
  let translitMap: TranslitMap = parseMap(DEFAULT_MAP_TEXT);
  let loaded = false;
  let queuedToggleCount = 0;

  const persistence = createStatePersistence();
  const panel = createPanel({
    getPosition: () => ({ x: state.panelX, y: state.panelY }),
    onActiveChange: handleActiveChange,
    onHide: hidePanel,
    onMapInput: handleMapInput,
    onPositionChange: handlePositionChange,
    onPositionCommit: handlePositionCommit,
    onReset: handleReset,
    onResize: handleResize,
  });
  const inputRewriter = createInputRewriter({
    isActive: () => state.active,
    isIgnoredElement: panel.isInsideElement,
    isIgnoredEvent: panel.isInsideEvent,
    transliterate: (text) => transliterate(text, translitMap),
  });

  function start() {
    installRuntimeListener();
    inputRewriter.install();
    void loadState();
  }

  async function loadState() {
    state = await readStoredState();
    translitMap = parseMap(state.mapText);
    loaded = true;

    if (queuedToggleCount % 2 === 1) {
      queuedToggleCount = 0;
      togglePanel();
      return;
    }

    queuedToggleCount = 0;
    if (state.panelVisible) showPanel(false);
  }

  function installRuntimeListener() {
    browser.runtime.onMessage.addListener((message: unknown) => {
      if (!isTogglePanelMessage(message)) return;

      if (!loaded) {
        queuedToggleCount += 1;
        return;
      }

      togglePanel();
    });
  }

  function togglePanel() {
    if (state.panelVisible) {
      hidePanel();
      return;
    }

    showPanel();
  }

  function showPanel(shouldPersist = true) {
    state.panelVisible = true;
    panel.show({ x: state.panelX, y: state.panelY });
    panel.sync(state, translitMap.size);

    if (shouldPersist) persistence.persist(state);
  }

  function hidePanel() {
    state.panelVisible = false;
    panel.hide();
    persistence.persist(state);
  }

  function handleActiveChange(active: boolean) {
    state.active = active;
    panel.updateStatus(state, translitMap.size);
    persistence.persist(state);
  }

  function handleMapInput(mapText: string) {
    state.mapText = mapText;
    translitMap = parseMap(state.mapText);
    panel.updateStatus(state, translitMap.size);
    persistence.schedule(state);
  }

  function handleReset() {
    state.mapText = DEFAULT_MAP_TEXT;
    translitMap = parseMap(state.mapText);
    panel.sync(state, translitMap.size);
    persistence.persist(state);
  }

  function handlePositionChange(position: PanelPosition) {
    state.panelX = position.x;
    state.panelY = position.y;
  }

  function handlePositionCommit() {
    persistence.persist(state);
  }

  function handleResize() {
    if (!state.panelVisible) return;

    panel.setPosition(state.panelX, state.panelY);
    persistence.persist(state);
  }

  return { start };
}
