# Bonkers Corner — MERN E-commerce Platform

Production-grade full-stack clothing e-commerce app.

## Stack
- **Frontend**: React + Vite + TypeScript, React Router v6, Tailwind CSS, Redux Toolkit, react-hook-form + zod, react-hot-toast, Axios
- **Backend**: Node.js + Express (MVC), Mongoose, JWT (access + httpOnly refresh), bcrypt, express-validator, helmet, express-rate-limit
- **DB**: MongoDB Atlas
- **Payments**: Stripe (test mode) — swap-in ready for Razorpay
- **Images**: Cloudinary
- **Email**: Nodemailer
- **Deploy**: Vercel (frontend) · Render (backend) · MongoDB Atlas (db) · Cloudinary

## Repository layout
```
bonkers-corner-mern/
├── backend/            # Express API (MVC)
│   ├── src/
│   │   ├── config/            # db, cloudinary, stripe, mailer, env
│   │   ├── models/            # Mongoose schemas
│   │   ├── controllers/       # route logic
│   │   ├── routes/            # Express routers
│   │   ├── middleware/        # auth, admin, error, validate, rateLimit
│   │   ├── services/          # order, payment, email, upload
│   │   ├── validators/        # express-validator chains
│   │   ├── utils/             # ApiResponse, ApiError, asyncHandler, token
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/                 # Jest + supertest
│   ├── seed/                  # admin + demo product seeder
│   ├── .env.example
│   └── package.json
├── frontend/           # React + Vite + TS
│   ├── src/
│   │   ├── pages/             # Home, PLP, PDP, Cart, Checkout, Account, Admin/*
│   │   ├── components/        # Navbar, Footer, CartDrawer, ProductCard, ...
│   │   ├── features/          # slices: auth, cart, wishlist, products, orders
│   │   ├── store/             # Redux store
│   │   ├── lib/               # axios, api, zod schemas
│   │   ├── hooks/             # useAuth, useDebounce
│   │   └── styles/
│   ├── .env.example
│   └── package.json
└── docs/
    ├── ARCHITECTURE.md
    ├── API.md
    └── postman_collection.json
```

## Quick start

### 1. Prereqs
- Node 18+ · MongoDB Atlas cluster · Cloudinary account · Stripe test keys · SMTP (Mailtrap/Resend/Gmail)

### 2. Backend
```bash
cd backend
cp .env.example .env      # fill in secrets
npm install
npm run seed              # creates admin: admin@bonkerscorner.com / Admin@12345
npm run dev               # http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev               # http://localhost:5173
```

### 4. Deploy
- **Backend → Render**: connect repo, root `backend/`, build `npm install`, start `npm start`, add env vars from `.env.example`.
- **Frontend → Vercel**: root `frontend/`, framework Vite, add `VITE_API_URL` pointing to your Render URL.
- **MongoDB Atlas**: whitelist `0.0.0.0/0` for Render, put URI in backend env.

## Architecture at a glance
```
[Browser] ──► [Vercel: React SPA] ──► [Render: Express API] ──► [MongoDB Atlas]
                                            │
                                            ├──► Cloudinary  (product images)
                                            ├──► Stripe       (payments)
                                            └──► SMTP         (order emails)
```

## Security highlights
- Passwords bcrypt-hashed (cost 12)
- Access token in memory, refresh token in httpOnly + Secure + SameSite=strict cookie
- Rotating refresh tokens, blacklist on logout
- `isAdmin` middleware on every `/api/admin/*` route (server-side, not UI-only)
- Helmet, CORS whitelist, express-rate-limit on `/api/auth/*`
- Zod + express-validator on every input
- Central error middleware + consistent `{ success, data, message }` shape

## Docs
- `docs/ARCHITECTURE.md` — diagrams, request lifecycle, folder rationale
- `docs/API.md` — every endpoint documented
- `docs/postman_collection.json` — import into Postman

## License
MIT
