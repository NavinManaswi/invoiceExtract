import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import * as pdfLib from "pdf-parse";

// @ts-ignore
const pdf = pdfLib.default || pdfLib;

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // API Route for processing PDF
  app.post(api.invoices.process.path, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Extract text from PDF buffer
      const buffer = req.file.buffer;
      let rawText = "";
      
      try {
        const pdfData = await pdf(buffer);
        rawText = pdfData.text;
      } catch (err) {
        console.error("PDF Parsing Error:", err);
        return res.status(500).json({ message: "Failed to parse PDF file" });
      }

      // Extract fields using Regex
      const extractedData = extractInvoiceData(rawText);

      // Store in DB (optional, but requested for "extracted data")
      // We store it for history if needed, or just return it
      await storage.createInvoice({
        fileName: req.file.originalname,
        fileSize: req.file.size,
        extractedData: extractedData,
        rawText: rawText,
      });

      res.json({
        success: true,
        data: extractedData,
        fileName: req.file.originalname,
        rawText: rawText.substring(0, 500) + "..." // truncated preview
      });

    } catch (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err instanceof Error) {
        return res.status(500).json({ message: err.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}

// Helper function for regex extraction
function extractInvoiceData(text: string) {
  // Normalize text slightly
  const cleanText = text.replace(/\r\n/g, "\n");
  
  const data: any = {
    invoice_number: null,
    date: null,
    due_date: null,
    vendor: null,
    total: null,
    currency: null,
  };

  // 1. Invoice Number
  // Patterns: "Invoice #", "Invoice No", "Inv #", "Invoice Number:"
  const invNumMatch = cleanText.match(/(?:invoice\s*(?:no\.?|number|#)|inv\s*(?:no\.?|#))\s*[:.]?\s*([a-zA-Z0-9-]{3,})/i);
  if (invNumMatch) {
    data.invoice_number = invNumMatch[1];
  }

  // 2. Date
  // Patterns: "Date:", "Invoice Date:" followed by standard date formats
  // Simple regex for dates like YYYY-MM-DD, MM/DD/YYYY, DD.MM.YYYY
  const dateMatch = cleanText.match(/(?:date|dated)\s*[:.]?\s*(\d{1,4}[-/.]\d{1,2}[-/.]\d{2,4})/i);
  if (dateMatch) {
    data.date = dateMatch[1];
  }

  // 3. Due Date
  const dueDateMatch = cleanText.match(/due\s*date\s*[:.]?\s*(\d{1,4}[-/.]\d{1,2}[-/.]\d{2,4})/i);
  if (dueDateMatch) {
    data.due_date = dueDateMatch[1];
  }

  // 4. Total Amount
  // Patterns: "Total", "Grand Total", "Amount Due", "Balance Due"
  // Look for currency symbols or numbers at end of line or after colon
  const totalMatch = cleanText.match(/(?:total|grand\s*total|amount\s*due|balance\s*due)\s*[:.]?\s*(?:[$€£¥])?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i);
  if (totalMatch) {
    data.total = totalMatch[1];
  }

  // 5. Currency
  // Heuristic: Look for symbols or codes
  if (cleanText.includes("$") || cleanText.includes("USD")) data.currency = "USD";
  else if (cleanText.includes("€") || cleanText.includes("EUR")) data.currency = "EUR";
  else if (cleanText.includes("£") || cleanText.includes("GBP")) data.currency = "GBP";
  
  // 6. Vendor
  // Very naive: usually the first non-empty line or near "From:"
  // Or check against known keywords. For this simple version, let's try to grab the first significant line
  const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length > 0) {
    // Skip likely header words
    const potentialVendor = lines.find(l => 
      !l.match(/invoice/i) && 
      !l.match(/date/i) && 
      !l.match(/bill\s*to/i) &&
      l.length < 50
    );
    if (potentialVendor) {
      data.vendor = potentialVendor;
    }
  }

  return data;
}
