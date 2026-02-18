import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["__TESTS__/**/*.test.ts", "__TESTS__/**/*.test.tsx"],
    setupFiles: ["./__TESTS__/setup.ts"],
  },
});
