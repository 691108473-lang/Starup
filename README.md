# Startup Marketplace

Production-oriented e-commerce / marketplace foundation based on the supplied Master Prompt.

## Scope in this phase
- Frontend: HTML5/CSS3/Vanilla JavaScript responsive storefront
- Backend: Node.js + Express REST API
- Database: PostgreSQL schema + seed data
- Authentication: email/password foundation + Google OAuth configuration points
- Roles: User / Staff / Admin / Super Admin
- Product catalog, cart, orders, reviews
- Admin dashboard API foundation
- Security middleware, validation, audit logging
- Docker Compose for PostgreSQL + API

## Run
1. Copy `backend/.env.example` to `backend/.env`.
2. Set PostgreSQL and JWT values.
3. Install backend dependencies:
   `cd backend && npm install`
4. Start PostgreSQL:
   `docker compose up -d postgres`
5. Initialize database:
   `npm run db:init`
6. Start API:
   `npm run dev`
7. Open `frontend/index.html` in a browser, or serve `frontend/` with a static server.

Google Sign-In:
- Create OAuth credentials in Google Cloud Console.
- Put the Client ID/Secret and callback URL in `.env`.
- The backend contains the OAuth route structure; secrets are never stored in source code.

## API base
`http://localhost:4000/api`

## Important
This is the first implementation phase, not a claim that every production control has been fully audited. Before public deployment, complete the automated test suite, OAuth verification, payment-provider integration, HTTPS, secret management, monitoring, backups and security review.
