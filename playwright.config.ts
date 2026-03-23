import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter: "line",
  use: {
    baseURL: "https://automationintesting.online",
    extraHTTPHeaders: {
      Accept: "application/json",
    },
  },
});
