
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Save, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface EnhancedSummaryResultProps {
  summary: string;
  onSave: () => void;
  isSaving: boolean;
}

export const EnhancedSummaryResult = ({ summary, onSave, isSaving }: EnhancedSummaryResultProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast({
        title: "Copied!",
        description: "Summary copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy summary",
        variant: "destructive",
      });
    }
  };

  const handleConvertToFlashcards = () => {
    // Store summary in localStorage to pass to flashcards page
    localStorage.setItem('flashcard-input', summary);
    navigate('/flashcards');
  };

  if (!summary) return null;
  
  return (
    <Card className="p-6 space-y-4">
      <div className="prose max-w-none">
        <h3 className="text-lg font-semibold">Summary</h3>
        <div className="whitespace-pre-wrap">{summary}</div>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button 
            onClick={handleCopy} 
            variant="outline" 
            className="flex-1"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          
          <Button 
            onClick={onSave} 
            variant="outline" 
            className="flex-1"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save to Library
              </>
            )}
          </Button>
        </div>
        
        <Button 
          onClick={handleConvertToFlashcards} 
          className="w-full"
        >
          <Zap className="mr-2 h-4 w-4" />
          Convert to Flashcards
        </Button>
      </div>
    </Card>
  );
};
