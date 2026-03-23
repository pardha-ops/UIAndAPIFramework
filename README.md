# UI and API Test Framework

Production-grade Playwright + TypeScript test framework covering REST API testing, schema validation, and API+UI hybrid testing.

## Stack
- Playwright — API and UI automation
- TypeScript — type-safe test code
- ajv — JSON schema validation
- dotenv — environment config management

## Structure
- `src/api/` — API client with all endpoints
- `src/schemas/` — ajv schema contracts
- `src/fixtures/` — authenticated Playwright fixtures
- `tests/api/` — REST API tests
- `tests/hybrid/` — API + UI hybrid tests
- `test-data/` — test payloads

## Setup
1. Clone the repo
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in values
4. Run `npx playwright install`
5. Run tests: `npx playwright test`

## Target app
[Restful Booker](https://restful-booker.herokuapp.com) — hotel booking REST API
UI: [Shady Meadows B&B](https://automationintesting.online)
```

**2 — Add repo description on GitHub**

Go to `https://github.com/pardha-ops/UIAndAPIFramework`, click the gear icon next to "About", add:
```
Playwright + TypeScript API and UI hybrid test framework — Phase 1 of GatekeeperOps learning plan
