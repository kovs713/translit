import { browser } from 'wxt/browser';

import { TOGGLE_PANEL_MESSAGE } from '../src/shared/messages';

export default defineBackground(() => {
  const browserWithActions = browser as typeof browser & {
    action?: typeof browser.action;
    browserAction?: typeof browser.browserAction;
  };
  const toolbarAction = browserWithActions.action ?? browserWithActions.browserAction;

  toolbarAction?.onClicked.addListener((tab) => {
    if (tab.id == null) return;

    void browser.tabs.sendMessage(tab.id, TOGGLE_PANEL_MESSAGE).catch(() => {
      // Pages like about:addons cannot receive content-script messages.
    });
  });
});
