
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Flashcard } from "@/types/flashcard";
import { useQueryClient } from "@tanstack/react-query";

export const useFlashcards = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const generateFlashcards = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setApiError(null);
    
    try {
      const response = await supabase.functions.invoke('generate-flashcards', {
        body: { text }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to generate flashcards");
      }

      if (response.data && response.data.error) {
        throw new Error(response.data.error);
      }

      if (!Array.isArray(response.data)) {
        console.error("Unexpected response format:", response.data);
        throw new Error("Received invalid data format from AI service");
      }

      setFlashcards(response.data);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error("Flashcard generation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate flashcards";
      setApiError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveFlashcards = async () => {
    if (!flashcards.length) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to save flashcards",
          variant: "destructive",
        });
        return;
      }

      const promises = flashcards.map(card =>
        supabase.from('flashcards').insert({
          user_id: user.id,
          original_text: text,
          question: card.question,
          answer: card.answer,
        })
      );

      await Promise.all(promises);
      
      // Invalidate the flashcards query to refresh the profile page
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });

      toast({
        title: "Success",
        description: "Flashcards saved successfully!",
      });
    } catch (error) {
      console.error("Error saving flashcards:", error);
      toast({
        title: "Error",
        description: "Failed to save flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setIsFlipped(false);
    if (direction === 'right' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (direction === 'left' && currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return {
    text,
    setText,
    isGenerating,
    isSaving,
    flashcards,
    currentIndex,
    isFlipped,
    setIsFlipped,
    generateFlashcards,
    saveFlashcards,
    handleSwipe,
    apiError,
  };
};
