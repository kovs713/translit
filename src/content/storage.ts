import { browser } from 'wxt/browser';

import { DEFAULT_STATE, normalizeState, type StoredState } from '../shared/state';

export async function readStoredState(): Promise<StoredState> {
  try {
    const storedState = (await browser.storage.local.get(DEFAULT_STATE)) as Partial<StoredState>;
    return normalizeState(storedState);
  } catch {
    return normalizeState(undefined);
  }
}

export function createStatePersistence() {
  let saveTimer = 0;

  function persist(state: StoredState) {
    window.clearTimeout(saveTimer);

    void browser.storage.local.set(state).catch(() => {
      // Some browser pages block extension storage; in-memory state still works.
    });
  }

  function schedule(state: StoredState) {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => persist(state), 250);
  }

  return { persist, schedule };
}
