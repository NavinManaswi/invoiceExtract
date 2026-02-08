import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type errorSchemas } from "@shared/routes";
import { z } from "zod";

// Response type from the API
type ProcessResponse = z.infer<typeof api.invoices.process.responses[200]>;

export function useProcessInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(api.invoices.process.path, {
        method: api.invoices.process.method,
        body: formData,
        // Don't set Content-Type header manually for FormData, 
        // browser sets it with boundary automatically
        credentials: "include",
      });

      if (!res.ok) {
        // Try to parse structured error
        try {
          const errorData = await res.json();
          // Assuming 400 validation error
          if (res.status === 400) {
            throw new Error(errorData.message || "Invalid file format");
          }
          throw new Error(errorData.message || "Failed to process invoice");
        } catch (e) {
          // Fallback if JSON parsing fails or it's a generic error
          throw new Error(e instanceof Error ? e.message : "Server error");
        }
      }

      const data = await res.json();
      return api.invoices.process.responses[200].parse(data);
    },
    onSuccess: () => {
      // Optional: invalidate list query if we were saving history
      queryClient.invalidateQueries({ queryKey: [api.invoices.list.path] });
    },
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: [api.invoices.list.path],
    queryFn: async () => {
      const res = await fetch(api.invoices.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch invoice history");
      return api.invoices.list.responses[200].parse(await res.json());
    },
  });
}
