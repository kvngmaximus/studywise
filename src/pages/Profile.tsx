
import { PageLayout } from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Flashcard } from "@/types/flashcard";
import { QAEntry } from "@/types/qa";
import { useNavigate } from "react-router-dom";

interface Summary {
  id: string;
  user_id: string;
  created_at: string;
  original_text: string;
  summary_text: string;
  title: string | null;
}

interface FlashcardEntry extends Flashcard {
  id: string;
  user_id: string;
  created_at: string;
  original_text: string;
}

const Profile = () => {
  const navigate = useNavigate();
  
  const { data: summaries, isLoading: isLoadingSummaries } = useQuery({
    queryKey: ['summaries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('summaries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Summary[];
    }
  });

  const { data: flashcards, isLoading: isLoadingFlashcards } = useQuery({
    queryKey: ['flashcards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching flashcards:", error);
        throw error;
      }
      console.log("Fetched flashcards:", data);
      return data as FlashcardEntry[];
    }
  });

  const { data: qaHistory, isLoading: isLoadingQA } = useQuery({
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

  const viewSummary = (summary: Summary) => {
    navigate(`/summary/${summary.id}`, { state: { summary } });
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Your study history</p>
        </div>

        <Tabs defaultValue="summaries" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summaries">Summaries</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
          </TabsList>
          <TabsContent value="summaries">
            <Card className="p-4">
              {isLoadingSummaries ? (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : !summaries?.length ? (
                <p className="text-center text-muted-foreground">No summaries yet</p>
              ) : (
                <div className="space-y-4">
                  {summaries.map((summary) => (
                    <Card 
                      key={summary.id} 
                      className="p-4 space-y-2 hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => viewSummary(summary)}
                    >
                      <p className="font-medium">{summary.title || 'Untitled Summary'}</p>
                      <p className="text-muted-foreground line-clamp-3">{summary.summary_text}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(summary.created_at).toLocaleDateString()}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="flashcards">
            <Card className="p-4">
              {isLoadingFlashcards ? (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : !flashcards?.length ? (
                <p className="text-center text-muted-foreground">No flashcards yet</p>
              ) : (
                <div className="space-y-4">
                  {flashcards.map((card) => (
                    <Card key={card.id} className="p-4 space-y-2">
                      <p className="font-medium">Q: {card.question}</p>
                      <p className="text-muted-foreground">A: {card.answer}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(card.created_at).toLocaleDateString()}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="qa">
            <Card className="p-4">
              {isLoadingQA ? (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : !qaHistory?.length ? (
                <p className="text-center text-muted-foreground">No Q&A history yet</p>
              ) : (
                <div className="space-y-4">
                  {qaHistory.map((qa) => (
                    <Card key={qa.id} className="p-4 space-y-2">
                      <p className="font-medium">Q: {qa.question}</p>
                      <p className="text-muted-foreground">A: {qa.answer}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(qa.created_at).toLocaleDateString()}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Profile;
