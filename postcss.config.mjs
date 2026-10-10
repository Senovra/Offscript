/**
 * Tailwind CSS 4 runs through PostCSS using the official @tailwindcss/postcss plugin.
 * Autoprefixer is not needed: Tailwind 4 handles vendor prefixes itself.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;