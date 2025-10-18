// postcss.config.js  (ESM con Vite)
import tailwind from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [tailwind, autoprefixer],
};