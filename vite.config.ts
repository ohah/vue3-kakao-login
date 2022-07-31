import { resolve } from "path";
import { defineConfig } from "vite";
import typescript2 from "rollup-plugin-typescript2";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
  server: {
    port: 5000,
    watch: {
      usePolling: true,
    },
  },
  plugins: [
    vue(),
    typescript2({
      check: false,
      include: ["./src/KaKaoLogin/*.ts"],
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          declarationMap: true,
        },
        exclude: ["vite.config.ts"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@/": resolve(__dirname, "src"),
      find: "@vue/runtime-core",
      replacement: "@vue/runtime-core/dist/runtime-core.esm-bundler.js",
    },
  },
  build: {
    cssCodeSplit: false,
    lib: {
      entry: "./src/KaKaoLoginPlugin.ts",
      formats: ["es", "cjs"],
      name: "Vue3KaKaoLogin",
      fileName: (format) => (format === "es" ? "index.js" : "index.common.js"),
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
