# Architecture

## Request lifecycle
Browser (React SPA) → Axios (attaches Bearer access token) → Express → route → validator → controller → service → Mongoose → MongoDB Atlas.
Refresh flow: 401 → axios interceptor calls `/api/auth/refresh` (httpOnly cookie) → gets new access token → retries original request.

## Auth model
- Access token (15m) — kept in memory (Redux). Never in localStorage.
- Refresh token (7d) — httpOnly + Secure + SameSite=strict cookie, path `/api/auth`. Rotated on every refresh; old token removed from `user.refreshTokens[]`.
- Passwords: bcrypt cost 12.
- Admin: role field on User; created ONLY via seed script; every `/api/admin/*` route double-guarded by `requireAuth` + `requireAdmin`. Hiding admin UI is not enough — the middleware is the enforcement point.

## Payments (Stripe test mode)
1. `POST /api/orders` → server computes totals authoritatively, creates Order, creates Stripe PaymentIntent, returns `clientSecret`.
2. Frontend confirms with Stripe Elements.
3. Stripe fires `payment_intent.succeeded` → `/api/payments/webhook` verifies signature → marks order paid → decrements stock → sends confirmation email.
Never trust client-sent prices.

## MVC layout
- `models/` — Mongoose schemas
- `controllers/` — request/response, orchestrates services
- `services/` — business logic (order calc, upload, email)
- `middleware/` — auth, admin, validate, error, rate-limit, upload
- `validators/` — express-validator chains
- `routes/` — thin, one file per resource
- `utils/` — ApiError, asyncHandler, apiResponse, token
