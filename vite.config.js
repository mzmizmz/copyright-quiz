import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

// ビルドのたびに sw.js のキャッシュ名を変え、端末に古いファイルが残らないようにする
const swVersion = () => ({
  name: "sw-version",
  apply: "build",
  closeBundle() {
    const file = "dist/sw.js";
    if (!existsSync(file)) return;
    writeFileSync(file, readFileSync(file, "utf8").replace("__BUILD__", String(Date.now())));
  },
});

export default defineConfig({
  // 相対パスで出力し、GitHub Pages（サブフォルダ）でも Cloudflare（ドメイン直下）でも動くようにする
  base: "./",
  plugins: [react(), swVersion()],
});
