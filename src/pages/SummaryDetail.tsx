
import { useLocation, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { parseMarkdown } from "@/utils/markdownParser";

interface Summary {
  id: string;
  user_id: string;
  created_at: string;
  original_text: string;
  summary_text: string;
  title: string | null;
}

const SummaryDetail = () => {
  const { state, pathname } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [summary, setSummary] = useState<Summary | null>(state?.summary || null);
  const [isLoading, setIsLoading] = useState(!state?.summary);
  
  const summaryId = pathname.split('/').pop();
  
  useEffect(() => {
    // If we don't have the summary in state, fetch it from the database
    if (!summary && summaryId) {
      const fetchSummary = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('summaries')
            .select('*')
            .eq('id', summaryId)
            .single();
            
          if (error) throw error;
          setSummary(data as Summary);
        } catch (error) {
          console.error("Error fetching summary:", error);
          toast({
            title: "Error",
            description: "Could not load the summary. Please try again.",
            variant: "destructive",
          });
          navigate('/profile');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchSummary();
    }
  }, [summaryId, summary, navigate, toast]);

  const handleBack = () => {
    navigate('/profile');
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-pulse">Loading summary...</div>
        </div>
      </PageLayout>
    );
  }

  if (!summary) {
    return (
      <PageLayout>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Summary not found</h1>
          <Button onClick={handleBack}>Back to Profile</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack} className="pl-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>{summary.title || 'Untitled Summary'}</CardTitle>
            <CardDescription>
              Created on {new Date(summary.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
                {parseMarkdown(summary.summary_text)}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Original Text</h3>
              <div className="whitespace-pre-wrap border p-4 rounded-md max-h-[400px] overflow-y-auto">
                {summary.original_text}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default SummaryDetail;
