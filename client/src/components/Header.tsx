import { FileText } from "lucide-react";

export function Header() {
  return (
    <header className="w-full py-8 md:py-12 flex flex-col items-center justify-center text-center space-y-4 px-4">
      <div className="p-3 bg-white rounded-2xl shadow-lg shadow-indigo-500/10 rotate-3 transition-transform hover:rotate-0 duration-500">
        <div className="p-3 bg-gradient-to-br from-primary to-indigo-600 rounded-xl">
          <FileText className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <div className="space-y-2 max-w-lg">
        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
          Invoice Intelligence
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl font-medium">
          Extract data from PDF invoices instantly. <br className="hidden sm:block"/>
          <span className="text-sm opacity-80">No manual entry required.</span>
        </p>
      </div>
    </header>
  );
}
