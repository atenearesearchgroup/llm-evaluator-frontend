import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import react from "@astrojs/react";

import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    })
    , react(), db()],
  output: "server",
  adapter: vercel()
});