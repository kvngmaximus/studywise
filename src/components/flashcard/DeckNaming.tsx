
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Edit3, Trash2 } from "lucide-react";

interface DeckNamingProps {
  onSave: (deckName: string) => void;
  isSaving: boolean;
  cardCount: number;
}

export const DeckNaming = ({ onSave, isSaving, cardCount }: DeckNamingProps) => {
  const [deckName, setDeckName] = useState("");
  const defaultName = `Deck - ${new Date().toLocaleDateString()}`;

  const handleSave = () => {
    onSave(deckName.trim() || defaultName);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="deck-name">Name Your Deck</Label>
        <Input
          id="deck-name"
          placeholder={defaultName}
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          {cardCount} cards • Created {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1"
        >
          {isSaving ? (
            <>
              <Save className="mr-2 h-4 w-4 animate-spin" />
              Saving Deck...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Deck
            </>
          )}
        </Button>
        
        <Button variant="outline" size="icon">
          <Edit3 className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
