import { db, hasDatabase } from "./db";
import { invoices, type Invoice, type InsertInvoice } from "@shared/schema";

/** Drizzle insert type for invoices (omitting id, createdAt) */
type InvoiceInsert = typeof invoices.$inferInsert;

export interface IStorage {
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getInvoices(): Promise<Invoice[]>;
}

export class DatabaseStorage implements IStorage {
  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db!
      .insert(invoices)
      .values(insertInvoice as InvoiceInsert)
      .returning();
    return invoice;
  }

  async getInvoices(): Promise<Invoice[]> {
    return await db!.select().from(invoices);
  }
}

/** In-memory storage for testing when DATABASE_URL is not set */
export class InMemoryStorage implements IStorage {
  private invoices: Invoice[] = [];
  private nextId = 1;

  async createInvoice(insert: InsertInvoice): Promise<Invoice> {
    const row = {
      id: this.nextId++,
      fileName: insert.fileName,
      fileSize: insert.fileSize,
      extractedData: insert.extractedData,
      rawText: insert.rawText ?? null,
      createdAt: new Date(),
    };
    this.invoices.push(row as Invoice);
    return row as Invoice;
  }

  async getInvoices(): Promise<Invoice[]> {
    return [...this.invoices];
  }
}

export const storage: IStorage = hasDatabase ? new DatabaseStorage() : new InMemoryStorage();
