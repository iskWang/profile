/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        ink: 'var(--color-ink)',
        'ink-muted': 'var(--color-ink-muted)',
        accent: 'var(--color-accent)',
        line: 'var(--color-line)',
        hero: 'var(--color-hero)',
        'hero-ink': 'var(--color-hero-ink)',
        'hero-muted': 'var(--color-hero-muted)',
        'hero-signal': 'var(--color-hero-signal)',
        'hero-gold': 'var(--color-hero-gold)',
        'hero-line': 'var(--color-hero-line)',
        'hero-button-ink': 'var(--color-hero-button-ink)',
        contact: 'var(--color-contact)',
        'contact-ink': 'var(--color-contact-ink)',
        'contact-muted': 'var(--color-contact-muted)',
        'contact-gold': 'var(--color-contact-gold)',
        'contact-line': 'var(--color-contact-line)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        zh: 'var(--font-zh)',
        mono: 'var(--font-mono)',
      },
      maxWidth: {
        container: 'var(--container-max)',
      },
      spacing: {
        gutter: 'var(--page-gutter)',
        header: 'var(--header-height)',
      },
      zIndex: {
        base: 'var(--z-base)',
        decor: 'var(--z-decor)',
        content: 'var(--z-content)',
        sticky: 'var(--z-sticky)',
        popover: 'var(--z-popover)',
        overlay: 'var(--z-overlay)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
        tooltip: 'var(--z-tooltip)',
      },
    },
  },
  plugins: [],
}
