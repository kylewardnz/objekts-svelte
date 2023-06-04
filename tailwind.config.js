/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      aspectRatio: {
        photocard: '5.5 / 8.5',
      },
    },
  },
  plugins: [],
}

