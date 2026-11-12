import path from "path";

import { defineConfig } from "@caido-community/dev";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

import packageJson from "./package.json";

export default defineConfig({
  id: "caido-themes",
  name: "Caido Themes",
  description: "A plugin for managing and customizing themes in Caido",
  version: packageJson.version,
  author: {
    name: "bebiks",
    email: "lukasz@caido.io",
    url: "https://github.com/caido-community/CaidoThemes",
  },
  plugins: [
    {
      kind: "frontend",
      id: "caido-themes-frontend",
      name: "Caido Themes: Frontend",
      root: "packages/frontend",
      backend: { id: "caido-themes-backend" },
      vite: {
        plugins: [vue(), tailwindcss()],
        resolve: {
          alias: [
            {
              find: "@",
              replacement: path.resolve(__dirname, "packages/frontend/src"),
            },
          ],
        },
        build: {
          rollupOptions: {
            external: ["vue"],
          },
        },
      },
    },
    {
      kind: "backend",
      id: "caido-themes-backend",
      name: "Caido Themes: Backend",
      root: "packages/backend",
    },
  ],
});
