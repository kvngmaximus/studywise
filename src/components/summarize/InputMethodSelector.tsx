
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Mic } from "lucide-react";

interface InputMethodSelectorProps {
  selectedMethod: 'text' | 'voice' | null;
  onMethodSelect: (method: 'text' | 'voice') => void;
}

export const InputMethodSelector = ({ selectedMethod, onMethodSelect }: InputMethodSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Choose Input Method</h3>
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className={`p-4 cursor-pointer transition-colors ${
            selectedMethod === 'text' ? 'bg-primary/10 border-primary' : 'hover:bg-accent/50'
          }`}
          onClick={() => onMethodSelect('text')}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <FileText className="h-8 w-8" />
            <span className="font-medium">Paste Text</span>
            <span className="text-sm text-muted-foreground">Enter or paste your content</span>
          </div>
        </Card>
        
        <Card 
          className={`p-4 cursor-pointer transition-colors ${
            selectedMethod === 'voice' ? 'bg-primary/10 border-primary' : 'hover:bg-accent/50'
          }`}
          onClick={() => onMethodSelect('voice')}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <Mic className="h-8 w-8" />
            <span className="font-medium">Record Voice</span>
            <span className="text-sm text-muted-foreground">Speak and we'll transcribe</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
