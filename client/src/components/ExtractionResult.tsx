import { motion } from "framer-motion";
import { Download, RefreshCw, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type ExtractedData } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ExtractionResultProps {
  data: ExtractedData;
  fileName: string;
  onReset: () => void;
}

export function ExtractionResult({ data, fileName, onReset }: ExtractionResultProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `extracted-${fileName.replace(".pdf", "")}.json`;
    link.click();
    
    toast({
      title: "Downloaded",
      description: "JSON file saved to your device",
    });
  };

  const handleCopy = (text: string | null | undefined, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      description: `${label} copied to clipboard`,
      duration: 1500,
    });
  };

  const fields = [
    { label: "Invoice Number", value: data.invoice_number, key: "inv" },
    { label: "Date", value: data.date, key: "date" },
    { label: "Due Date", value: data.due_date, key: "due" },
    { label: "Total Amount", value: data.total, key: "total", highlight: true },
    { label: "Currency", value: data.currency, key: "curr" },
    { label: "Vendor", value: data.vendor, key: "vend" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-50/80 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Extraction Complete</h3>
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              JSON
            </Button>
          </div>
        </div>

        {/* Grid Data */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div 
              key={field.key} 
              className={`
                group relative p-4 rounded-xl border transition-all duration-200
                ${field.highlight 
                  ? "bg-primary/5 border-primary/20 hover:border-primary/40" 
                  : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm"
                }
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {field.label}
                </span>
                <button 
                  onClick={() => handleCopy(field.value, field.label)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded"
                >
                  <Copy className="w-3 h-3 text-slate-400" />
                </button>
              </div>
              
              <div className={`font-mono text-lg truncate ${field.highlight ? "text-primary font-bold text-2xl" : "text-slate-700"}`}>
                {field.value || (
                  <span className="text-slate-300 italic text-base">Not found</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-center">
          <Button 
            onClick={onReset}
            variant="ghost" 
            className="text-muted-foreground hover:text-primary hover:bg-primary/5"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Process Another Invoice
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
