# Changelog — Finalized Changes

## Summary

All changes from this session are complete. The app builds, type-checks, and is ready to run and test.

---

## 1. Replit removal

- **Deleted:** `replit.md`, `.replit`
- **Removed** from `package.json`: `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`, `@replit/vite-plugin-runtime-error-modal`
- **Updated** `vite.config.ts`: dropped all Replit plugins; only `@vitejs/plugin-react` remains
- **Updated** `.gitignore`: added `.local` (Replit agent state)

---

## 2. Testing and run without database

- **Optional database:** If `DATABASE_URL` is not set, the app uses in-memory storage so you can run and test without PostgreSQL.
- **Updated** `server/db.ts`: `hasDatabase` flag; `pool` and `db` only created when `DATABASE_URL` is set
- **Updated** `server/storage.ts`: `InMemoryStorage` when no DB; `DatabaseStorage` when `DATABASE_URL` is set; `DatabaseStorage` uses `InvoiceInsert` cast for type safety
- **Added** `TESTING.md`: how to run, test in browser, curl API, type-check, and production build
- **Added** `package.json` script: `"test": "npm run check"`

---

## 3. Port and server behavior

- **Default port:** `5000` → `5001` in `server/index.ts` and all `TESTING.md` URLs
- **Listen options:** Removed `reusePort: true` to avoid bind issues on some systems
- **Catch-all for SPA:** Replaced literal `"/{*path}"` with a pathless `app.use(...)` in:
  - `server/vite.ts` (dev)
  - `server/static.ts` (production)  
  So `GET /` and other client routes now serve the app correctly and “Failed to load the page” is resolved.

---

## 4. TypeScript and PDF parsing

- **PDF parsing:** Removed call to private `parser.load()`; using `parser.getText()` only (load happens inside it). `parser.destroy()` is now awaited.
- **Types:** `extractInvoiceData` in `server/routes.ts` now returns `ExtractedData`; regex results coerced to `string | null` where needed.
- **Storage:** `DatabaseStorage.createInvoice` uses `insertInvoice as InvoiceInsert` so the insert satisfies Drizzle.

---

## Commands

- **Type-check:** `npm run check` or `npm test`
- **Build:** `npm run build`
- **Dev:** `npm run dev` → http://localhost:5001
- **Prod:** `npm run start` (after build)

See `TESTING.md` for full testing steps.
