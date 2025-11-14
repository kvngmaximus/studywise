
import { useState } from 'react';

export const usePdfText = () => {
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For now, we'll just use a placeholder for PDF text extraction
      // In a future iteration, we can implement actual PDF parsing
      const reader = new FileReader();
      reader.onload = (e) => {
        setText('Sample text from PDF: ' + file.name);
        setIsLoading(false);
      };
      reader.readAsText(file);
    } catch (err) {
      setError('Error reading PDF file');
      setIsLoading(false);
    }
  };

  return { text, setText, isLoading, error, handleFileUpload };
};
