import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    {
      name: 'middleware-debug',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          try {
            // console.log('Request URL:', decodeURI(req.url));
          } catch (e) {
            console.error('Malformed URI:', req.url);
          }
          next();
        });
      }
    }
  ],
  server: {
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, './certs/server.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, './certs/STAR_ctuniversity_in.crt')),
    //   ca: fs.readFileSync(path.resolve(__dirname, './certs/My_CA_Bundle.ca-bundle')),
    // },
    port: 80, // Set the port to 80 for http 443 for https
    host: '0.0.0.0', // Allow connections from any IP address
    proxy: {
      '/api': {
        target: 'http://192.168.124.197:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
  }
}
});
