# SaaS Project Portal

A multi-tenant SaaS portal for managing company projects/objects with documents, schedules, tasks, finances, approvals, real-time chat, and document generation.

## Architecture

- **Monorepo**: Turborepo + PNPM workspaces
- **Backend**: NestJS + Drizzle + PostgreSQL + Redis + Socket.IO
- **Frontend**: Next.js 14 + Tailwind + shadcn/ui + TanStack Query
- **Multi-tenancy**: RLS in PostgreSQL with JWT-based tenant isolation

## Getting Started

### Prerequisites

- Node.js 18+
- PNPM 8+
- PostgreSQL 14+
- Redis 6+

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Run database migrations
pnpm db:migrate

# Seed the database
pnpm db:seed

# Generate OpenAPI SDK
pnpm generate:sdk
```

### Development

```bash
# Start all services in development mode
pnpm dev

# Or start individual services
pnpm --filter @saas-portal/api dev
pnpm --filter @saas-portal/web dev
```

### Build

```bash
# Build all packages and apps
pnpm build

# Build individual packages
pnpm --filter @saas-portal/api build
pnpm --filter @saas-portal/web build
```

### Testing

```bash
# Run all tests
pnpm test

# Run E2E tests
pnpm test:e2e
```

## Project Structure

```
/apps
  /api     # NestJS backend
  /web     # Next.js frontend
  /mobile  # React Native (future)
/packages
  /shared  # Shared DTOs and types
  /sdk     # Generated API client
  /ui      # Shared UI components
  /config  # Shared configuration
```

## Features

- ✅ Multi-tenant SaaS architecture
- ✅ Project/Object management
- ✅ Document management with S3 uploads
- ✅ Task management with Kanban view
- ✅ Financial tracking with margin calculation
- ✅ Approval workflows with mandatory reject reasons
- ✅ Real-time chat with Socket.IO
- ✅ Document generation (contracts, proposals, closing docs)
- ✅ Configurable numbering system
- ✅ Role-based access control

## Development Progress

See [TODO.md](./TODO.md) for current development status.

## License

Private - All rights reserved.