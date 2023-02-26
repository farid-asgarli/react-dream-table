import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
import scss from "rollup-plugin-scss";

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
    scss({ failOnError: true, fileName: "index.css", runtime: require("sass") }),
  ],
  external: ["react", "react-dom"],
};

export default config;
