import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  baseURL: process.env.BASE_URL ?? "https://restful-booker.herokuapp.com",
  username: process.env.API_USERNAME ?? "admin",
  password: process.env.API_PASSWORD ?? "password123",
};
