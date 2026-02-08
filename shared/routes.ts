import { z } from "zod";
import { insertInvoiceSchema, invoices } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  invoices: {
    process: {
      method: "POST" as const,
      path: "/api/invoices/process" as const,
      // Input is multipart/form-data, so we don't strictly validate body here 
      // but we return the structured response
      responses: {
        200: z.object({
          success: z.boolean(),
          data: z.custom<typeof invoices.$inferSelect.extractedData>(),
          fileName: z.string(),
          rawText: z.string().optional(),
        }),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/invoices" as const,
      responses: {
        200: z.array(z.custom<typeof invoices.$inferSelect>()),
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
