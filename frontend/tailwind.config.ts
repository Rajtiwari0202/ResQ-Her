// frontend/tailwind.config.ts

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // New Custom Palette
        primary: '#703091',       // Deep Violet / Support
        secondary: '#f4f4ff',      // Light Base/Content Background
        background: '#1c1c24',    // Darker Background / Stability
        'alert-red': '#cc0000',   // Critical Red for SOS
        'chat-user': '#4c7cff',   // Clear Blue for user messages
        'chat-bot': '#343440',    // Dark grey for bot messages
        'text-light': '#f4f4f5',  // Light text color
      },
    },
  },
  plugins: [],
};