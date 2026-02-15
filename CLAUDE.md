# Ham Media App - Claude Code Guide

## Project Overview

Ham Media is an application run by Japan's first hamster-dedicated support organization. It provides:

1. **Hospital Search** - Find hospitals that accept hamsters
2. **LINE Bot** - Hospital search and foster care info via LINE
3. **Admin Panel** - Hospital management, inventory, and staff management

## Tech Stack

### Backend

- **Framework**: Fastify
- **Database**: PostgreSQL
- **ORM**: Prisma
- **GraphQL**: Mercurius (Fastify GraphQL plugin)
- **Auth**: JWT
- **Testing**: Vitest + Mercurius Integration Testing
- **Deploy**: Heroku

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Styling**: Panda CSS
- **GraphQL**: Apollo Client
- **UI Components**: Ark UI
- **Auth**: Cookie-based
- **Deploy**: Vercel

### Shared Tooling

- **Monorepo**: pnpm workspace
- **Linting**: ESLint
- **Formatting**: Prettier
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry

## Project Structure

```
ham-media-app/
├── backend/           # Backend API server
│   ├── server/        # Fastify application
│   │   ├── graphql/   # GraphQL schemas and resolvers
│   │   ├── services/  # Business logic
│   │   └── routes/    # REST endpoints
│   ├── prisma/        # Database schema and seeds
│   └── tests/         # Backend tests
├── frontend/          # Next.js frontend
│   ├── app/           # App Router pages
│   ├── components/    # UI components
│   └── services/      # API clients
└── graphql/           # Shared GraphQL schema
```

## Local Development Setup

### Prerequisites

- Node.js >= 22.16.0
- pnpm >= 10.18.3
- Docker (for PostgreSQL container)

### Initial Setup

1. **Install dependencies**

```bash
pnpm install
```

2. **Start PostgreSQL** (Docker)

```bash
docker compose up -d
```

This starts the `ham-media-db` container on port 5434.

3. **Configure backend environment**

```bash
cp backend/.env.template backend/.env
```

Edit `backend/.env`:

```
DATABASE_URL=postgresql://ham_media:ham_media@localhost:5434/ham_media_development
DIRECT_URL=postgresql://ham_media:ham_media@localhost:5434/ham_media_development
JWT_TOKEN=dev-secret-token
PORT=3000
LINE_CHANNEL_ACCESS_TOKEN=dummy-dev-token
LINE_CHANNEL_SECRET=dummy-dev-secret
```

4. **Set up the database**

```bash
pnpm backend db:push        # Push schema to DB (also generates Prisma client)
pnpm backend db:seed:dev    # Seed development data
```

5. **Configure frontend environment**

```bash
cp frontend/.env.template frontend/.env
```

Set `NEXT_PUBLIC_API_URL` to `http://localhost:3000`.

6. **Start dev servers** (in separate terminals)

```bash
pnpm backend dev     # Port 3000
pnpm frontend dev    # Port 8080
```

### Dev Login Credentials

Seed data creates these accounts:

- **Admin**: `admin@example.com` / `password`
- **User**: `user@example.com` / `password`

### Docker Management

```bash
docker compose up -d       # Start
docker compose down        # Stop (data preserved)
docker compose down -v     # Stop + delete data (clean restart)
```

## Development Commands

### Backend

```bash
pnpm backend dev              # Start dev server
pnpm backend build            # Build
pnpm backend test             # Run tests
pnpm backend test:ci          # Run tests with coverage
pnpm backend db:push          # Push schema to DB
pnpm backend db:reflect       # Generate Prisma client
pnpm backend db:seed:dev      # Run dev seed
pnpm backend lint             # ESLint
pnpm backend format:check     # Prettier check
pnpm backend tscheck          # TypeScript type check
```

### Frontend

```bash
pnpm frontend dev             # Start dev server
pnpm frontend build           # Build
pnpm frontend generate        # GraphQL codegen
pnpm frontend prepare         # Generate styles
pnpm frontend lint            # Next.js lint
pnpm frontend format:check    # Prettier check
pnpm frontend tscheck         # TypeScript type check
```

## Database

### Key Models

- **Hospital** - Hospital info
- **HospitalAddress** - Address and geo data
- **Product** - Product info (for inventory)
- **Stock** - Inventory
- **StockRequest** - Inventory requests
- **InternalUser** - Internal users (staff)

### Key Relationships

- Hospitals have addresses with geo coordinates for location search
- Products have multiple stock entries managed via stock requests
- Internal users use role-based authorization

## API

### GraphQL

- **Public API**: `/public_api/graphql` - Public-facing (hospital search, etc.)
- **Internal API**: `/internal_api/graphql` - Admin panel (auth required)

### REST

- **Webhook**: LINE Bot endpoint
- **Health Check**: Health check endpoint

## Deployment

- **Backend**: Heroku
- **Frontend**: Vercel (www.ham-media-app.net, ham-media-app.net)
- **DNS**: AWS Route53
- **CI/CD**: GitHub Actions

## Development Guidelines

- ESLint + Prettier for auto-formatting
- TypeScript strict mode
- Write tests for all API endpoints
- Develop on main branch, code review via Pull Requests
- Manage secrets via environment variables in production
- Create migration files for database changes
- Check impact scope when changing GraphQL schemas
