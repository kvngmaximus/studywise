
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PdfUploaderProps {
  handleFileUpload: (file: File) => void;
}

export const PdfUploader = ({ handleFileUpload }: PdfUploaderProps) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <Card
      className="border-2 border-dashed p-8 text-center hover:bg-accent/50 transition-colors cursor-pointer"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        className="hidden"
        id="pdf-upload"
      />
      <label
        htmlFor="pdf-upload"
        className="flex flex-col items-center gap-2 cursor-pointer"
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <span className="text-muted-foreground">
          Drag & drop a PDF or click to upload
        </span>
      </label>
    </Card>
  );
};
