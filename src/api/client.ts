import { APIRequestContext, APIResponse } from "@playwright/test";
import { config } from "../config/env";

export class APIClient {
  private token: string = "";

  constructor(private request: APIRequestContext) {}

  async authenticate(): Promise<void> {
    const response = await this.request.post(`${config.baseURL}/auth`, {
      data: {
        username: config.username,
        password: config.password,
      },
    });
    const body = await response.json();
    if (!body.token)
      throw new Error("Authentication failed — no token returned");
    this.token = body.token;
  }

  private get authHeaders() {
    return { Cookie: `token=${this.token}` };
  }

  // ── Booking endpoints ──────────────────────────────────────────────────────

  async getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`${config.baseURL}/booking/${id}`);
  }

  async getBookingIds(): Promise<APIResponse> {
    return this.request.get(`${config.baseURL}/booking`);
  }

  async createBooking(data: object): Promise<APIResponse> {
    return this.request.post(`${config.baseURL}/booking`, {
      data,
      headers: { "Content-Type": "application/json" },
    });
  }

  async updateBooking(id: number, data: object): Promise<APIResponse> {
    return this.request.put(`${config.baseURL}/booking/${id}`, {
      data,
      headers: {
        "Content-Type": "application/json",
        ...this.authHeaders,
      },
    });
  }

  async partialUpdateBooking(id: number, data: object): Promise<APIResponse> {
    return this.request.patch(`${config.baseURL}/booking/${id}`, {
      data,
      headers: {
        "Content-Type": "application/json",
        ...this.authHeaders,
      },
    });
  }

  async deleteBooking(id: number): Promise<APIResponse> {
    return this.request.delete(`${config.baseURL}/booking/${id}`, {
      headers: this.authHeaders,
    });
  }
}
