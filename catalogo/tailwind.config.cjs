/** Mesmo arranjo que um sistema consumidor faria, apontando para o fonte. */
module.exports = {
  presets: [require('../tailwind-preset.cjs')],
  content: {
    relative: true,
    files: ['./index.html', './src/**/*.{ts,tsx}', '../src/**/*.{ts,tsx}'],
  },
};
