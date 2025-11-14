
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface SummaryPreferences {
  style: 'bullets' | 'paragraph' | 'takeaways' | 'notes';
  tone: 'simple' | 'professional' | 'conversational';
  length: 'short' | 'medium' | 'long';
}

interface SummaryOptionsProps {
  preferences: SummaryPreferences;
  onPreferencesChange: (preferences: SummaryPreferences) => void;
}

export const SummaryOptions = ({ preferences, onPreferencesChange }: SummaryOptionsProps) => {
  const handleStyleChange = (style: SummaryPreferences['style']) => {
    onPreferencesChange({ ...preferences, style });
  };

  const handleToneChange = (tone: SummaryPreferences['tone']) => {
    onPreferencesChange({ ...preferences, tone });
  };

  const handleLengthChange = (length: SummaryPreferences['length']) => {
    onPreferencesChange({ ...preferences, length });
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Summary Preferences</h3>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="summary-style">Summary Style</Label>
          <Select value={preferences.style} onValueChange={handleStyleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bullets">Bullet Points</SelectItem>
              <SelectItem value="paragraph">Paragraph</SelectItem>
              <SelectItem value="takeaways">Key Takeaways</SelectItem>
              <SelectItem value="notes">Notes for Study</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="summary-tone">Tone</Label>
          <Select value={preferences.tone} onValueChange={handleToneChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="conversational">Conversational</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="summary-length">Length Preference</Label>
          <Select value={preferences.length} onValueChange={handleLengthChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short (1-3 sentences)</SelectItem>
              <SelectItem value="medium">Medium (1 paragraph)</SelectItem>
              <SelectItem value="long">Long (detailed)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
