import fs from 'fs';
import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";

const hexLoader: Plugin = {
  name: 'hex-loader',
  transform(code, id) {
    const [path, query] = id.split('?');
    if (query != 'raw-hex')
      return null;

    const data = fs.readFileSync(path);
    const hex = data.toString('hex');
    return {
      code: `export default '${hex}';`,
      map: null
    };
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __DEV__: process.env.NODE_ENV !== 'production'
  },
  plugins: [react(), hexLoader],
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
