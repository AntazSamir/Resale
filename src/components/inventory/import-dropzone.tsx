import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, Download, AlertCircle } from "lucide-react";
import { SAMPLE_CSV_TEMPLATE } from "@/lib/bulk-importer";

interface ImportDropzoneProps {
  onFileLoaded: (content: string, fileName: string) => void;
  isLoading?: boolean | undefined;
}

export function ImportDropzone({ onFileLoaded, isLoading = false }: ImportDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setError("Only .CSV files are supported. Please upload a standard CSV file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit. Please split your inventory into smaller batches.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        onFileLoaded(text, file.name);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "resale_inventory_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone container */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-primary bg-primary/5 scale-[0.99]"
            : "border-border hover:border-primary/50 hover:bg-muted/20 bg-card"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        <div className="size-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3">
          <UploadCloud className="size-6" />
        </div>

        <h3 className="text-base font-bold text-foreground">
          {isDragging ? "Drop your CSV file here" : "Upload Inventory Spreadsheet (.CSV)"}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          Drag and drop your spreadsheet, or browse from your computer. Validates grades, prices,
          and catalog models instantly.
        </p>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground font-mono">
          <span>Max 5MB</span>
          <span>&middot;</span>
          <span>Standard UTF-8 CSV</span>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Template Download Prompt */}
      <div className="p-4 rounded-lg border border-border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <FileText className="size-4 text-primary shrink-0" />
          <div>
            <span className="font-semibold text-foreground">
              Need the correct column structure?
            </span>
            <p className="text-muted-foreground text-[11px]">
              Download our sample spreadsheet with pre-formatted columns for grades, prices &amp;
              models.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDownloadTemplate}
          className="gap-1.5 text-xs shrink-0 self-end sm:self-center"
        >
          <Download className="size-3.5" />
          <span>Download Sample CSV</span>
        </Button>
      </div>
    </div>
  );
}
