import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileType, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  error?: string | null;
}

export function FileUpload({ onFileSelect, isProcessing, error }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    multiple: false,
    disabled: isProcessing,
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative group cursor-pointer
          rounded-3xl border-3 border-dashed
          transition-all duration-300 ease-out
          p-10 md:p-16 flex flex-col items-center justify-center text-center
          bg-white/50 backdrop-blur-sm
          ${
            isDragActive
              ? "border-primary bg-primary/5 scale-[1.02] shadow-2xl shadow-primary/10"
              : "border-slate-200 hover:border-primary/50 hover:bg-white"
          }
          ${isDragReject ? "border-destructive bg-destructive/5" : ""}
          ${isProcessing ? "opacity-50 pointer-events-none cursor-wait" : ""}
        `}
      >
        <input {...getInputProps()} />

        {/* Animated Icon */}
        <div className="relative mb-6">
          <div className={`
            absolute inset-0 bg-primary/20 blur-xl rounded-full transition-all duration-500
            ${isDragActive ? "scale-150 opacity-100" : "scale-100 opacity-0 group-hover:opacity-100"}
          `} />
          <div className={`
            relative w-20 h-20 rounded-2xl flex items-center justify-center
            bg-gradient-to-br from-white to-slate-50 shadow-xl border border-white
            transition-transform duration-300
            ${isDragActive ? "scale-110 -translate-y-2" : "group-hover:-translate-y-1"}
          `}>
            {isDragActive ? (
              <Upload className="w-10 h-10 text-primary animate-bounce" />
            ) : (
              <FileType className="w-10 h-10 text-slate-400 group-hover:text-primary transition-colors duration-300" />
            )}
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2 z-10">
          <h3 className="text-xl font-bold text-slate-800">
            {isDragActive ? "Drop invoice here" : "Upload Invoice"}
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Drag & drop your PDF invoice, or click to browse files
          </p>
        </div>

        {/* Validation/Processing State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-16 left-0 right-0"
            >
              <div className="flex items-center justify-center gap-2 text-destructive bg-destructive/10 py-2 px-4 rounded-full mx-auto w-fit text-sm font-medium">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isProcessing && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <div className="h-2 w-48 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-progress-indeterminate rounded-full" />
          </div>
          <span className="text-sm font-medium text-muted-foreground animate-pulse">
            Analyzing document structure...
          </span>
        </motion.div>
      )}
    </div>
  );
}
