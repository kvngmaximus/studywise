
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export interface FlashcardPreferences {
  count: number;
  format: 'qa' | 'cloze' | 'terminology';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface FlashcardOptionsProps {
  preferences: FlashcardPreferences;
  onPreferencesChange: (preferences: FlashcardPreferences) => void;
}

export const FlashcardOptions = ({ preferences, onPreferencesChange }: FlashcardOptionsProps) => {
  const handleCountChange = (value: number[]) => {
    onPreferencesChange({ ...preferences, count: value[0] });
  };

  const handleFormatChange = (format: FlashcardPreferences['format']) => {
    onPreferencesChange({ ...preferences, format });
  };

  const handleDifficultyChange = (difficulty: FlashcardPreferences['difficulty']) => {
    onPreferencesChange({ ...preferences, difficulty });
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Flashcard Options</h3>
      
      <div className="space-y-4">
        <div>
          <Label>Number of Cards: {preferences.count}</Label>
          <div className="mt-2">
            <Slider
              value={[preferences.count]}
              onValueChange={handleCountChange}
              max={25}
              min={5}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>5</span>
              <span>15</span>
              <span>25</span>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="flashcard-format">Format</Label>
          <Select value={preferences.format} onValueChange={handleFormatChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="qa">Q&A</SelectItem>
              <SelectItem value="cloze">Cloze Deletion (Fill-in-the-blanks)</SelectItem>
              <SelectItem value="terminology">Terminology + Definitions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="flashcard-difficulty">Difficulty</Label>
          <Select value={preferences.difficulty} onValueChange={handleDifficultyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy (basic recall)</SelectItem>
              <SelectItem value="medium">Medium (understanding)</SelectItem>
              <SelectItem value="hard">Hard (application)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
