
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { FlashcardDisplay } from "@/components/flashcard/FlashcardDisplay";
import { FlashcardOptions, FlashcardPreferences } from "@/components/flashcard/FlashcardOptions";
import { DeckNaming } from "@/components/flashcard/DeckNaming";
import { useFlashcardsWithPreferences } from "@/hooks/useFlashcardsWithPreferences";
import { Card } from "@/components/ui/card";

const Flashcards = () => {
  const [preferences, setPreferences] = useState<FlashcardPreferences>({
    count: 10,
    format: 'qa',
    difficulty: 'medium'
  });

  const {
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
  } = useFlashcardsWithPreferences(preferences);

  // Check if we have input from summary page
  useEffect(() => {
    const savedInput = localStorage.getItem('flashcard-input');
    if (savedInput) {
      setText(savedInput);
      localStorage.removeItem('flashcard-input');
    }
  }, [setText]);

  const canGenerate = text.trim() && preferences.count && preferences.format && preferences.difficulty;

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Flashcards</h1>
          <p className="text-muted-foreground">
            Paste notes or generate from summary/voice
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="Enter your study material here..."
            className="min-h-[200px] bg-white"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {text.trim() && (
            <FlashcardOptions 
              preferences={preferences}
              onPreferencesChange={setPreferences}
            />
          )}

          <Button
            className="w-full"
            onClick={() => generateFlashcards()}
            disabled={isGenerating || !canGenerate}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating {preferences.count} Flashcards...
              </>
            ) : (
              `Generate ${preferences.count} Flashcards`
            )}
          </Button>
        </div>

        {apiError && (
          <Card className="p-4 border-destructive bg-destructive/10">
            <p className="text-sm text-destructive">{apiError}</p>
          </Card>
        )}

        {flashcards.length > 0 && (
          <div className="space-y-4">
            <FlashcardDisplay
              flashcards={flashcards}
              currentIndex={currentIndex}
              isFlipped={isFlipped}
              isSaving={false}
              onFlip={() => setIsFlipped(!isFlipped)}
              onSwipe={handleSwipe}
              onSave={() => {}}
            />

            <DeckNaming
              onSave={saveFlashcards}
              isSaving={isSaving}
              cardCount={flashcards.length}
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Flashcards;
