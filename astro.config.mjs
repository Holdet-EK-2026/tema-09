import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
export default defineConfig({
  output: "static",
  publicDir: process.env.KINDDESIGN_PUBLIC_DIR || "./public",
  adapter: netlify({ devFeatures: false }),
});
