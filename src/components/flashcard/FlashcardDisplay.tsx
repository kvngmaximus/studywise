
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Flashcard } from "@/types/flashcard";

interface FlashcardDisplayProps {
  flashcards: Flashcard[];
  currentIndex: number;
  isFlipped: boolean;
  isSaving: boolean;
  onFlip: () => void;
  onSwipe: (direction: 'left' | 'right') => void;
  onSave: () => void;
}

export const FlashcardDisplay = ({
  flashcards,
  currentIndex,
  isFlipped,
  isSaving,
  onFlip,
  onSwipe,
  onSave,
}: FlashcardDisplayProps) => {
  return (
    <div className="space-y-4">
      <div className="relative h-[300px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + (isFlipped ? '-flipped' : '')}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
            className="absolute inset-0"
          >
            <Card
              className="h-full w-full p-6 cursor-pointer bg-white shadow-lg relative"
              onClick={onFlip}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front side - Question */}
              <div 
                className="absolute inset-0 p-6 flex flex-col items-center justify-center backface-hidden"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(0deg)'
                }}
              >
                <p className="text-lg text-center">
                  {flashcards[currentIndex].question}
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  {currentIndex + 1} of {flashcards.length}
                </p>
              </div>

              {/* Back side - Answer */}
              <div 
                className="absolute inset-0 p-6 flex flex-col items-center justify-center backface-hidden"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <p className="text-lg text-center">
                  {flashcards[currentIndex].answer}
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  {currentIndex + 1} of {flashcards.length}
                </p>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => onSwipe('right')}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => onSwipe('left')}
          disabled={currentIndex === flashcards.length - 1}
        >
          Next
        </Button>
      </div>

      <Button
        className="w-full"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving Flashcards...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Flashcards
          </>
        )}
      </Button>
    </div>
  );
};
