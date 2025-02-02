import tsPlugin from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "esm",
    },
    plugins: [
      tsPlugin({
        declaration: true,
        declarationDir: "dist/types",
      }),
      resolve({
        extensions: [".ts", ".js"],
      }),
    ],
  },
];
