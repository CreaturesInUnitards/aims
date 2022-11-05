import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./lib/aims.ts",
      name: "aims",
      fileName: "aims",
    },
  },
});
