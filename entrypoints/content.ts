import { createContentApp } from '../src/content/app';

const INSTANCE_KEY = '__cyrillicInputTranslitExtension' as const;

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  main() {
    const instanceWindow = window as Window & { [INSTANCE_KEY]?: boolean };
    if (instanceWindow[INSTANCE_KEY]) return;

    instanceWindow[INSTANCE_KEY] = true;
    createContentApp().start();
  },
});
