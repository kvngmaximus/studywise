
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";

interface SummarizeButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const SummarizeButton = ({ onClick, isLoading, disabled }: SummarizeButtonProps) => {
  return (
    <Button
      className="flex-1"
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Summarizing...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          Summarize
        </>
      )}
    </Button>
  );
};
