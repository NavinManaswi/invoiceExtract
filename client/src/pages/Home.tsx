import { useState } from "react";
import { Header } from "@/components/Header";
import { FileUpload } from "@/components/FileUpload";
import { ExtractionResult } from "@/components/ExtractionResult";
import { useProcessInvoice } from "@/hooks/use-invoices";
import { type ExtractedData } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [data, setData] = useState<ExtractedData | null>(null);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processMutation = useProcessInvoice();

  const handleFileSelect = (file: File) => {
    setError(null);
    setCurrentFile(file.name);
    
    processMutation.mutate(file, {
      onSuccess: (response) => {
        setData(response.data);
      },
      onError: (err) => {
        setError(err.message);
        setCurrentFile(null); // Reset file on error so they can try again
      },
    });
  };

  const handleReset = () => {
    setData(null);
    setCurrentFile(null);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full pb-20">
      <Header />

      <main className="container mx-auto px-4 max-w-4xl">
        <AnimatePresence mode="wait">
          {!data ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FileUpload
                onFileSelect={handleFileSelect}
                isProcessing={processMutation.isPending}
                error={error}
              />
              
              {/* Features List / Trust Signals */}
              {!processMutation.isPending && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
                >
                  <div className="p-4 rounded-2xl bg-white/40 border border-white/50 shadow-sm backdrop-blur-sm">
                    <h4 className="font-bold text-slate-800 mb-1">Local Processing</h4>
                    <p className="text-xs text-muted-foreground">Using secure PDF parsing</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/40 border border-white/50 shadow-sm backdrop-blur-sm">
                    <h4 className="font-bold text-slate-800 mb-1">Instant Results</h4>
                    <p className="text-xs text-muted-foreground">Extracts keys in seconds</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/40 border border-white/50 shadow-sm backdrop-blur-sm">
                    <h4 className="font-bold text-slate-800 mb-1">Export Ready</h4>
                    <p className="text-xs text-muted-foreground">Download as JSON data</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ExtractionResult
                data={data}
                fileName={currentFile || "document.pdf"}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
