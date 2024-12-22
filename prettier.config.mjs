/** @type {import("prettier").Config} */
const config = {
  endOfLine: "lf",
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "es5",
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
