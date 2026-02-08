import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileSize: serial("file_size").notNull(),
  extractedData: jsonb("extracted_data").$type<{
    invoice_number?: string | null;
    date?: string | null;
    due_date?: string | null;
    vendor?: string | null;
    total?: string | null;
    currency?: string | null;
  }>().notNull(),
  rawText: text("raw_text"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type ExtractedData = Invoice['extractedData'];

export interface ProcessPdfResponse {
  success: boolean;
  data?: ExtractedData;
  error?: string;
  rawText?: string;
  fileName: string;
}
