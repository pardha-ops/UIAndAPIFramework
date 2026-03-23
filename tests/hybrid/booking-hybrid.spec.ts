import { test, expect } from "../../src/fixtures/api.fixture";
import { createValidator } from "../../src/utils/validator";
import {
  bookingSchema,
  createdBookingSchema,
} from "../../src/schemas/booking.schema";
import {
  validBooking,
  updatedBooking,
  partialUpdate,
} from "../../test-data/booking.data";

const validateBooking = createValidator(bookingSchema);
const validateCreatedBooking = createValidator(createdBookingSchema);

test.describe("Hybrid — API + UI booking flows", () => {
  test("create booking via API, verify UI home page, assert via API", async ({
    apiClient,
    page,
  }) => {
    // Step 1 — Seed data via API
    const createResponse = await apiClient.createBooking(validBooking);
    expect(createResponse.status()).toBe(200);
    const created = await createResponse.json();
    validateCreatedBooking(created);
    const bookingId = created.bookingid;

    // Step 2 — Navigate to UI and verify key sections
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "Book Now", exact: true }),
    ).toBeVisible();

    // Step 3 — Verify navigation links
    await expect(
      page.getByRole("link", { name: "Rooms" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Booking" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Contact" }).first(),
    ).toBeVisible();

    // Step 4 — Verify rooms section headings
    await expect(
      page.getByRole("heading", { name: "Our Rooms" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Single" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Double" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Suite" })).toBeVisible();

    // Step 5 — Assert seeded booking is still retrievable via API
    const getResponse = await apiClient.getBooking(bookingId);
    expect(getResponse.status()).toBe(200);
    const booking = await getResponse.json();
    validateBooking(booking);
    expect(booking.firstname).toBe(validBooking.firstname);
    expect(booking.lastname).toBe(validBooking.lastname);
    expect(booking.totalprice).toBe(validBooking.totalprice);
  });

  test("verify room pricing and Book now links are displayed on UI", async ({
    page,
  }) => {
    await page.goto("/");

    // Prices from page snapshot
    await expect(page.getByText("£100 per night")).toBeVisible();
    await expect(page.getByText("£150 per night")).toBeVisible();
    await expect(page.getByText("£225 per night")).toBeVisible();

    // At least one Book now link per room
    const bookNowLinks = page.getByRole("link", {
      name: "Book now",
      exact: true,
    });
    await expect(bookNowLinks.first()).toBeVisible();
    const count = await bookNowLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("check availability section is present and interactive on UI", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: "Check Availability & Book Your Stay",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Check Availability" }),
    ).toBeVisible();
  });

  test("API create → full update → verify updated data via API", async ({
    apiClient,
    page,
  }) => {
    // Step 1 — Create booking via API
    const createResponse = await apiClient.createBooking(validBooking);
    expect(createResponse.status()).toBe(200);
    const created = await createResponse.json();
    validateCreatedBooking(created);
    const bookingId = created.bookingid;

    // Step 2 — Navigate to UI (cross-verify site is up)
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "Book Now", exact: true }),
    ).toBeVisible();

    // Step 3 — Full update via API
    const updateResponse = await apiClient.updateBooking(
      bookingId,
      updatedBooking,
    );
    expect(updateResponse.status()).toBe(200);
    const updated = await updateResponse.json();
    validateBooking(updated);
    expect(updated.lastname).toBe(updatedBooking.lastname);
    expect(updated.totalprice).toBe(updatedBooking.totalprice);
  });

  test("API create → partial update → verify patched fields via API", async ({
    apiClient,
    page,
  }) => {
    // Step 1 — Create booking via API
    const createResponse = await apiClient.createBooking(validBooking);
    expect(createResponse.status()).toBe(200);
    const created = await createResponse.json();
    const bookingId = created.bookingid;

    // Step 2 — Navigate to UI home page
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Welcome to Shady Meadows B&B" }),
    ).toBeVisible();

    // Step 3 — Partial update via API
    const patchResponse = await apiClient.partialUpdateBooking(
      bookingId,
      partialUpdate,
    );
    expect(patchResponse.status()).toBe(200);
    const patched = await patchResponse.json();
    validateBooking(patched);
    expect(patched.firstname).toBe(partialUpdate.firstname);
    expect(patched.totalprice).toBe(partialUpdate.totalprice);
    // Unchanged field should remain from the original
    expect(patched.lastname).toBe(validBooking.lastname);
  });

  test("API create → delete → verify 404 response via API", async ({
    apiClient,
    page,
  }) => {
    // Step 1 — Create booking via API
    const createResponse = await apiClient.createBooking(validBooking);
    expect(createResponse.status()).toBe(200);
    const created = await createResponse.json();
    const bookingId = created.bookingid;

    // Step 2 — Visit UI while booking exists
    await page.goto("/");
    await expect(page.getByText("Shady Meadows B&B").first()).toBeVisible();

    // Step 3 — Delete via API
    const deleteResponse = await apiClient.deleteBooking(bookingId);
    expect(deleteResponse.status()).toBe(201);

    // Step 4 — Verify booking no longer accessible
    const getResponse = await apiClient.getBooking(bookingId);
    expect(getResponse.status()).toBe(404);
  });
});
