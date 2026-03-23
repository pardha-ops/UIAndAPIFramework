import { test as base, expect } from "@playwright/test";
import { APIClient } from "../api/client";

type ApiFixtures = {
  apiClient: APIClient;
};

export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    const client = new APIClient(request);
    await client.authenticate();
    await use(client);
  },
});

export { expect };
