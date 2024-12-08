// @ts-check
import solid from "@astrojs/solid-js";
import { defineConfig, envField } from "astro/config";
import Icons from 'unplugin-icons/vite'

// https://astro.build/config
export default defineConfig({
  server: { port: 3000, host: true },
  integrations: [solid()],
  output: "server",
  vite: {
    plugins: [
      Icons({
        compiler: 'solid',
      }),
    ],
    server: {
      fs: {
        allow: [
          "..",
          "../..", // allow reading from the root of the monorepo
        ],
      },
    },
  },

  env: {
    schema: {
      PAYLOAD_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
});