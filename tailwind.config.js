/** Colours come from CSS variables in src/styles/tokens.css (derived from the logo). */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--c-primary)',
        secondary: 'var(--c-secondary)',
        accent: 'var(--c-accent)',
        clay: 'var(--c-clay)',
        bg: 'var(--c-bg)',
        surface: 'var(--c-surface)',
        ink: 'var(--c-text-dark)',
        cream: 'var(--c-text-light)',
        line: 'var(--c-border)',
      },
      fontFamily: {
        display: ['Fraunces', 'Fraunces-fallback', 'Georgia', 'serif'],
        body: ['Manrope', 'Manrope-fallback', 'system-ui', 'sans-serif'],
        telugu: ['"Tiro Telugu"', '"Noto Serif Telugu"', 'serif'],
      },
    },
  },
  plugins: [],
};
