
import { Card } from "@/components/ui/card";

interface ErrorDisplayProps {
  error: string | null;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  if (!error) return null;
  
  return (
    <Card className="p-4 border-destructive bg-destructive/10">
      <p className="text-sm text-destructive">{error}</p>
    </Card>
  );
};
