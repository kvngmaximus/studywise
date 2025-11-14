
import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  text: string;
  setText: (text: string) => void;
}

export const TextInput = ({ text, setText }: TextInputProps) => {
  return (
    <Textarea
      placeholder="Or paste your text here..."
      className="min-h-[200px]"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
};
