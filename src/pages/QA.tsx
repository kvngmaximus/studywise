
import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { QAEntry } from "@/types/qa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

const QA = () => {
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: qaHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['qa-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qa_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as QAEntry[];
    }
  });

  const askMutation = useMutation({
    mutationFn: async (question: string) => {
      // Reset any previous errors
      setApiError(null);
      
      console.log("Calling ask-question edge function with:", question);
      const response = await supabase.functions.invoke('ask-question', {
        body: { question }
      });

      console.log("Response from edge function:", response);
      
      if (response.error) {
        console.error("Edge function error:", response.error);
        throw new Error(`Edge function error: ${response.error.message || JSON.stringify(response.error)}`);
      }
      
      // Check if there's an error message in the data
      if (response.data?.error) {
        console.error("API error in response data:", response.data.error);
        throw new Error(response.data.error);
      }
      
      const { answer } = response.data;
      
      if (!answer) {
        console.error("No answer in response:", response.data);
        throw new Error("Failed to get answer from AI");
      }
      
      // Save the Q&A to the database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: insertError } = await supabase.from('qa_history').insert({
        user_id: user.id,
        question,
        answer,
      });

      if (insertError) {
        console.error("Database insert error:", insertError);
        throw insertError;
      }

      return { question, answer };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa-history'] });
      setQuestion("");
    },
    onError: (error) => {
      console.error("Ask mutation error:", error);
      
      // Store the error message for in-page display
      setApiError(error.message);
      
      toast({
        title: "Error",
        description: `Failed to get answer: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    askMutation.mutate(question);
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Q&A Assistant</h1>
          <p className="text-muted-foreground">Ask questions about your study materials</p>
        </div>

        {apiError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {apiError}
              {apiError.includes("API key") && (
                <p className="mt-2 text-sm">
                  Please check that your API key is correct in the Supabase dashboard.
                  This app supports both OpenAI and DeepSeek API keys.
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className="h-[400px] rounded-md border p-4">
          {isLoadingHistory ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : qaHistory?.length === 0 ? (
            <p className="text-center text-muted-foreground">No questions asked yet</p>
          ) : (
            <div className="space-y-4">
              {qaHistory?.map((qa) => (
                <div key={qa.id} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
                      {qa.question}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                      {qa.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            type="submit"
            className="w-full"
            disabled={askMutation.isPending || !question.trim()}
          >
            {askMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Answer...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Ask Question
              </>
            )}
          </Button>
        </form>
      </div>
    </PageLayout>
  );
};

export default QA;
