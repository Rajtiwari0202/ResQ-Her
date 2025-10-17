// frontend/postcss.config.js

module.exports = {
  plugins: [
    // FIX: Replaced "tailwindcss" with the required separate package
    "@tailwindcss/postcss", 
    "autoprefixer",
  ],
};