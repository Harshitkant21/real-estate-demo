import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const nvidiaKey = env.NVIDIA_API_KEY || env.VITE_NVIDIA_API_KEY || '';
  const rapidApiKey = env.VITE_RAPIDAPI_KEY || 'ff9f154ff7mshb33b5ec7b83ff57p19fcf7jsn03939c2dff8c';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/rapidapi': {
          target: 'https://property-finder6.p.rapidapi.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/rapidapi/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('x-rapidapi-key', rapidApiKey);
              proxyReq.setHeader('x-rapidapi-host', 'property-finder6.p.rapidapi.com');
            });
          },
        },
        '/api/nvidia': {
          target: 'https://integrate.api.nvidia.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/nvidia/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (nvidiaKey) {
                proxyReq.setHeader('Authorization', `Bearer ${nvidiaKey}`);
              }
            });
          },
        },
      },
    },
  };
});
