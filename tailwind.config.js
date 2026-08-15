/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--color-paper)',
        'paper-deep': 'var(--color-paper-deep)',
        ink: 'var(--color-ink)',
        'ink-soft': 'var(--color-ink-soft)',
        teal: 'var(--color-teal)',
        'teal-soft': 'var(--color-teal-soft)',
        line: 'var(--color-line)',
      },
    },
  },
  plugins: [],
}
