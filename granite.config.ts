import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'my-miniapp-rutini',
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
  brand: {
    displayName: '루티니',
    icon: 'https://static.toss.im/appsintoss/placeholder.png', // 나중에 실제 아이콘 URL로 교체
    primaryColor: '#5B5CF9',
    bridgeColorMode: 'basic',
  },
  webViewProps: {
    type: 'partner',
  },
});
