# Testing the Invoice Extractor App

## Prerequisites

- Node.js 18+
- **Optional:** PostgreSQL and `DATABASE_URL` — if not set, the app uses in-memory storage (fine for local testing).

## 1. Install and run

```bash
npm install
npm run dev
```

The app serves at **http://localhost:5001** (or the port in `PORT`).

## 2. Manual testing in the browser

1. Open http://localhost:5001 in your browser.
2. Drag and drop a **text-based PDF invoice** onto the upload area (or click to choose a file).
3. Confirm that extracted fields (invoice number, date, vendor, total, etc.) appear.
4. Use “Download JSON” to export the result.

**Note:** The extractor works best with PDFs that contain selectable text, not scanned images.

## 3. API test with curl

With the dev server running:

```bash
# Process a PDF (replace with your file path)
curl -X POST http://localhost:5001/api/invoices/process \
  -F "file=@/path/to/your/invoice.pdf"
```

You should get JSON with `success: true` and a `data` object containing the extracted fields.

## 4. Type check

```bash
npm run check
```

Runs the TypeScript compiler to catch type errors.

## 5. Production build test

```bash
npm run build
npm run start
```

Then open http://localhost:5001 and test the same flow as in step 2.
