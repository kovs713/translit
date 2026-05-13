import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Cyrillic Input Translit',
    description: 'Rewrite typed Cyrillic in editable fields with a custom transliteration map.',
    permissions: ['storage', 'activeTab', 'tabs'],
    host_permissions: ['<all_urls>'],
    action: {
      default_title: 'Cyrillic Input Translit',
    },
  },
});
