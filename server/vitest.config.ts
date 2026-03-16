import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    env: {
      FILE_EXPLORER_ROOT: path.resolve(__dirname, "src/tests/fixtures"),
    },
  },
});
