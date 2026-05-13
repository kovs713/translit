import { browser } from 'wxt/browser';

const TOGGLE_PANEL_MESSAGE = { type: 'translit:toggle-panel' } as const;

export default defineBackground(() => {
  browser.action.onClicked.addListener((tab) => {
    if (tab.id == null) return;

    void browser.tabs.sendMessage(tab.id, TOGGLE_PANEL_MESSAGE).catch(() => {
      // Pages like about:addons cannot receive content-script messages.
    });
  });
});
