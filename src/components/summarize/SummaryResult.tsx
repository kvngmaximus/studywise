
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SummaryResultProps {
  summary: string;
  onSave: () => void;
  isSaving: boolean;
}

export const SummaryResult = ({ summary, onSave, isSaving }: SummaryResultProps) => {
  if (!summary) return null;
  
  return (
    <Card className="p-6 space-y-4">
      <div className="prose max-w-none">
        <h3 className="text-lg font-semibold">Summary</h3>
        <div className="whitespace-pre-wrap">{summary}</div>
      </div>
      <Button 
        onClick={onSave} 
        variant="outline" 
        className="w-full"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Summary'
        )}
      </Button>
    </Card>
  );
};
