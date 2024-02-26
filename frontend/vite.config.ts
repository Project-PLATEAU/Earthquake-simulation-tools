import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'


export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd())
  console.log(env);

  return {
    plugins: [vue()],
    define: {
      global: 'globalThis',
    },
    server: {
      proxy: {
        '^/(region_preset*|earthquake_preset*|simulation_reserve*|registered_citygmls*)': {
          target: env.VITE_APP_API_ENDPOINT,
          changeOrigin: true,
          rewrite: (path) => path.replace('/api', '/')
        },
      },
    }
  }
})
