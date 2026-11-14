// Two pages: the 3D Atlas (index.html) and the time slice prototype (slice.html).
import { defineConfig } from 'vite';

export default defineConfig({
  build: { rollupOptions: { input: { main: 'index.html', slice: 'slice.html' } } }
});
