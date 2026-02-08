import { db } from "./db";
import { invoices, type Invoice, type InsertInvoice, type ExtractedData } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getInvoices(): Promise<Invoice[]>;
}

export class DatabaseStorage implements IStorage {
  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(insertInvoice).returning();
    return invoice;
  }

  async getInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices);
  }
}

export const storage = new DatabaseStorage();
