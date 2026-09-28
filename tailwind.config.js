/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--color-paper)',
        'paper-deep': 'var(--color-paper-deep)',
        ink: 'var(--color-ink)',
        'ink-soft': 'var(--color-ink-soft)',
        form: 'var(--color-form)',
        line: 'var(--color-line)',
        seal: 'var(--color-seal)',
      },
    },
  },
  plugins: [],
}
