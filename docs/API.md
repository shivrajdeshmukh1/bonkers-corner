# API Reference

All responses: `{ success: boolean, data?: any, message?: string }`.

## Auth
- `POST /api/auth/register` { name, email, password } → { accessToken, user }
- `POST /api/auth/login` { email, password }
- `POST /api/auth/refresh` — reads httpOnly `rt` cookie
- `POST /api/auth/logout`
- `GET  /api/auth/me` (Bearer)

## Products (public)
- `GET /api/products?q&category&subCategory&size&color&minPrice&maxPrice&sort&page&limit&featured&newArrival&bestSeller`
- `GET /api/products/suggest?q=`
- `GET /api/products/:slug`

## Cart (auth)
- `GET /api/cart` · `PUT /api/cart` { items } · `DELETE /api/cart`

## Orders
- `POST /api/orders` (guest or auth) { items, shippingAddress, couponCode?, guestEmail? } → { order, clientSecret }
- `GET  /api/orders/mine` (auth)
- `GET  /api/orders/:id` (auth / owner or admin)

## Reviews
- `GET  /api/reviews/:productId`
- `POST /api/reviews` (auth) { productId, rating, comment } — buyers only

## Wishlist (auth)
- `GET /api/wishlist` · `POST /api/wishlist/toggle` { productId }

## Payments
- `POST /api/payments/webhook` (Stripe → raw body)

## Admin (auth + isAdmin)
- `GET  /api/admin/dashboard`
- `POST /api/admin/products` (multipart, images[])
- `PUT  /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `GET  /api/admin/orders?status&page&limit`
- `PATCH /api/admin/orders/:id/status` { status }
- `GET  /api/admin/users`
- `PATCH /api/admin/users/:id/block`
