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

// ── GET ────────────────────────────────────────────────────────────────────

test("GET /booking/:id — returns 200 and matches schema", async ({
  apiClient,
}) => {
  // Get list of existing IDs first
  const listResponse = await apiClient.getBookingIds();
  const ids = await listResponse.json();
  const firstId = ids[0].bookingid;

  // Fetch the first existing booking
  const response = await apiClient.getBooking(firstId);

  expect(response.status()).toBe(200);

  const booking = await response.json();
  validateBooking(booking);
});
test("GET /booking — returns list of booking ids", async ({ apiClient }) => {
  const response = await apiClient.getBookingIds();

  expect(response.status()).toBe(200);

  const ids = await response.json();
  expect(Array.isArray(ids)).toBe(true);
  expect(ids.length).toBeGreaterThan(0);
  ids.forEach((item: unknown) => {
    expect(item).toHaveProperty("bookingid");
  });
});

// ── POST ───────────────────────────────────────────────────────────────────

test("POST /booking — creates booking, returns 200 with bookingid", async ({
  apiClient,
}) => {
  const response = await apiClient.createBooking(validBooking);

  expect(response.status()).toBe(200);

  const created = await response.json();
  validateCreatedBooking(created);
  expect(created.booking.firstname).toBe(validBooking.firstname);
  expect(created.booking.totalprice).toBe(validBooking.totalprice);
});

// ── PUT ────────────────────────────────────────────────────────────────────

test("PUT /booking/:id — full update, returns 200", async ({ apiClient }) => {
  // Create first
  const createResponse = await apiClient.createBooking(validBooking);
  const { bookingid } = await createResponse.json();

  // Full update
  const updateResponse = await apiClient.updateBooking(
    bookingid,
    updatedBooking,
  );

  expect(updateResponse.status()).toBe(200);

  const updated = await updateResponse.json();
  validateBooking(updated);
  expect(updated.firstname).toBe(updatedBooking.firstname);
  expect(updated.totalprice).toBe(updatedBooking.totalprice);
});

// ── PATCH ──────────────────────────────────────────────────────────────────

test("PATCH /booking/:id — partial update, returns 200", async ({
  apiClient,
}) => {
  const createResponse = await apiClient.createBooking(validBooking);
  const { bookingid } = await createResponse.json();

  const patchResponse = await apiClient.partialUpdateBooking(
    bookingid,
    partialUpdate,
  );

  expect(patchResponse.status()).toBe(200);

  const patched = await patchResponse.json();
  expect(patched.firstname).toBe(partialUpdate.firstname);
  expect(patched.totalprice).toBe(partialUpdate.totalprice);
  // Original fields preserved
  expect(patched.lastname).toBe(validBooking.lastname);
});

// ── DELETE ─────────────────────────────────────────────────────────────────

test("DELETE /booking/:id — returns 201", async ({ apiClient }) => {
  const createResponse = await apiClient.createBooking(validBooking);
  const { bookingid } = await createResponse.json();

  const deleteResponse = await apiClient.deleteBooking(bookingid);

  expect(deleteResponse.status()).toBe(201);

  // Verify deleted — 404 on subsequent GET
  const getResponse = await apiClient.getBooking(bookingid);
  expect(getResponse.status()).toBe(404);
});
