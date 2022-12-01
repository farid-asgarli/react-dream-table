import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import pkg from "./package.json";

const config = {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      strict: false,
    },
  ],

  plugins: [
    typescript({ objectHashIgnoreUnknownHack: true }),
    postcss({
      extract: false,
    }),
  ],
  external: ["react", "react-dom"],
};

export default config;
