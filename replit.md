# replit.md

## Overview

Invoice Intelligence is a full-stack web application that extracts structured data from PDF invoices. Users upload a PDF file through a drag-and-drop interface, the server parses the PDF text, extracts key invoice fields (invoice number, date, due date, vendor, total, currency), and returns the structured data for display and download as JSON. The app follows a monorepo structure with a React frontend, Express backend, and PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure
- **`client/`** — React single-page application (Vite-bundled)
- **`server/`** — Express API server
- **`shared/`** — Shared types, schemas, and route definitions used by both client and server

### Frontend (`client/src/`)
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router)
- **State/Data Fetching**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (Radix UI primitives + Tailwind CSS, "new-york" style)
- **Styling**: Tailwind CSS with CSS variables for theming, custom fintech-inspired color palette
- **Animations**: Framer Motion for layout transitions and entry animations
- **File Upload**: react-dropzone for drag-and-drop PDF upload
- **Fonts**: Inter (body) and Space Grotesk (display)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend (`server/`)
- **Framework**: Express.js running on Node.js with TypeScript (via tsx)
- **File Handling**: Multer with memory storage for PDF uploads (5MB limit, PDF-only filter)
- **PDF Parsing**: pdf-parse library for text extraction from PDF buffers
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for response validation
- **Static Serving**: In production, serves the Vite-built frontend from `dist/public`
- **Dev Mode**: Vite dev server middleware with HMR for development

### Key API Endpoints
- `POST /api/invoices/process` — Accepts multipart/form-data with a PDF file, extracts text, returns structured invoice data
- `GET /api/invoices` — Lists all saved invoices from the database

### Database
- **Database**: PostgreSQL (required, connection via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Drizzle Kit with `drizzle-kit push` command (migrations output to `./migrations`)
- **Tables**:
  - `invoices` — Stores processed invoice records with fields: `id`, `file_name`, `file_size`, `extracted_data` (JSONB with invoice_number, date, due_date, vendor, total, currency), `raw_text`, `created_at`

### Build System
- **Dev**: `npm run dev` — runs Express server with tsx, Vite middleware for HMR
- **Build**: `npm run build` — Vite builds frontend to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Start**: `npm run start` — runs production build with Node.js
- **DB Push**: `npm run db:push` — pushes schema changes to database using Drizzle Kit

### Shared Layer (`shared/`)
- `schema.ts` — Drizzle table definitions, Zod insert schemas, TypeScript types (`Invoice`, `InsertInvoice`, `ExtractedData`, `ProcessPdfResponse`)
- `routes.ts` — API route definitions with paths, methods, and Zod response schemas. Acts as a contract between client and server.

## External Dependencies

### Required Services
- **PostgreSQL Database** — Required. Connection string must be provided via `DATABASE_URL` environment variable. Used for storing processed invoice records.

### Key NPM Packages
- **drizzle-orm** + **drizzle-kit** — Database ORM and migration tooling for PostgreSQL
- **pdf-parse** — Server-side PDF text extraction
- **multer** — Multipart form-data handling for file uploads
- **express** — HTTP server framework
- **@tanstack/react-query** — Client-side async state management
- **react-dropzone** — Drag-and-drop file upload UI
- **framer-motion** — Animation library
- **zod** — Runtime schema validation (shared between client and server)
- **wouter** — Lightweight client-side routing
- **shadcn/ui** components (Radix UI + Tailwind CSS)

### Replit-Specific Plugins
- `@replit/vite-plugin-runtime-error-modal` — Runtime error overlay in development
- `@replit/vite-plugin-cartographer` — Dev tooling (dev only)
- `@replit/vite-plugin-dev-banner` — Dev banner (dev only)