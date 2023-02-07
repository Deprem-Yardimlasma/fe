module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ['garden']
  },
  jit: true,
  viewer: true,
}
