import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import path from "path";

export default defineConfig(({ mode }) => {
  const tenantName = mode || "demo";

  return {
    plugins: [
      react(),
      checker({
        typescript: {
          tsconfigPath: "./tsconfig.app.json",
        },
      }),
    ],
    resolve: {
      alias: {
        "@tenant-config": path.resolve(
          __dirname,
          `./public/${tenantName}/example.json`
        ),
      },
    },
  };
});
