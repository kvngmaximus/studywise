
import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { PdfUploader } from "@/components/summarize/PdfUploader";
import { TextInput } from "@/components/summarize/TextInput";
import { SummarizeButton } from "@/components/summarize/SummarizeButton";
import { EnhancedSummaryResult } from "@/components/summarize/EnhancedSummaryResult";
import { ErrorDisplay } from "@/components/summarize/ErrorDisplay";
import { InputMethodSelector } from "@/components/summarize/InputMethodSelector";
import { SummaryOptions, SummaryPreferences } from "@/components/summarize/SummaryOptions";
import { VoiceRecorder } from "@/components/summarize/VoiceRecorder";
import { usePdfText } from "@/hooks/usePdfText";
import { useSummarizeWithPreferences } from "@/hooks/useSummarizeWithPreferences";

const Summarize = () => {
  const [inputMethod, setInputMethod] = useState<'text' | 'voice' | null>(null);
  const [preferences, setPreferences] = useState<SummaryPreferences>({
    style: 'paragraph',
    tone: 'professional',
    length: 'medium'
  });

  const { text, setText, isLoading: isPdfLoading, error: pdfError, handleFileUpload } = usePdfText();
  const { 
    summary, 
    isSummarizing, 
    isSaving, 
    apiError, 
    handleSummarize, 
    handleSave 
  } = useSummarizeWithPreferences(text, preferences);

  const handleVoiceTranscription = (transcribedText: string) => {
    setText(transcribedText);
  };

  const canSummarize = text.trim() && inputMethod && preferences.style && preferences.tone && preferences.length;

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Summarize Notes</h1>
          <p className="text-muted-foreground">Choose your input method and preferences</p>
        </div>

        {!inputMethod && (
          <InputMethodSelector 
            selectedMethod={inputMethod}
            onMethodSelect={setInputMethod}
          />
        )}

        {inputMethod && (
          <div className="space-y-4">
            {inputMethod === 'text' && (
              <>
                <PdfUploader handleFileUpload={handleFileUpload} />
                <TextInput text={text} setText={setText} />
              </>
            )}
            
            {inputMethod === 'voice' && (
              <VoiceRecorder onTranscription={handleVoiceTranscription} />
            )}

            {text.trim() && (
              <SummaryOptions 
                preferences={preferences}
                onPreferencesChange={setPreferences}
              />
            )}

            <SummarizeButton 
              onClick={handleSummarize} 
              isLoading={isSummarizing} 
              disabled={!canSummarize} 
            />

            <ErrorDisplay error={apiError} />

            {summary && (
              <EnhancedSummaryResult 
                summary={summary} 
                onSave={handleSave} 
                isSaving={isSaving} 
              />
            )}

            {pdfError && (
              <p className="text-sm text-destructive text-center">{pdfError}</p>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Summarize;
