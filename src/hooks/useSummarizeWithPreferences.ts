
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SummaryPreferences } from "@/components/summarize/SummaryOptions";

export const useSummarizeWithPreferences = (text: string, preferences: SummaryPreferences) => {
  const { toast } = useToast();
  const [summary, setSummary] = useState<string>("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text or upload a PDF first",
        variant: "destructive",
      });
      return;
    }

    setIsSummarizing(true);
    setApiError(null);
    
    try {
      const response = await supabase.functions.invoke('summarize', {
        body: { 
          text,
          preferences: {
            style: preferences.style,
            tone: preferences.tone,
            length: preferences.length
          }
        }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to generate summary");
      }

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setSummary(response.data.summary);
    } catch (error) {
      console.error("Summarize error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate summary";
      setApiError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSave = async () => {
    if (!summary) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to save summaries",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('summaries')
        .insert({
          user_id: user.id,
          title: "Summary " + new Date().toLocaleDateString(),
          original_text: text,
          summary_text: summary,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Summary saved to your library!",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    summary,
    isSummarizing,
    isSaving,
    apiError,
    handleSummarize,
    handleSave,
  };
};
