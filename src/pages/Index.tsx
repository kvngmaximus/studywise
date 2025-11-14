
import { Book, Brain, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">AI Study Assistant</h1>
          <p className="text-muted-foreground">Your intelligent study companion</p>
        </div>

        <div className="grid gap-4">
          <Link to="/summarize">
            <Card className="p-6 hover:bg-accent transition-colors">
              <div className="flex items-center space-x-4">
                <Book className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <h2 className="font-semibold">Summarize Notes</h2>
                  <p className="text-sm text-muted-foreground">Get quick summaries of your study materials</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/flashcards">
            <Card className="p-6 hover:bg-accent transition-colors">
              <div className="flex items-center space-x-4">
                <Brain className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <h2 className="font-semibold">Generate Flashcards</h2>
                  <p className="text-sm text-muted-foreground">Create AI-powered flashcards instantly</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/qa">
            <Card className="p-6 hover:bg-accent transition-colors">
              <div className="flex items-center space-x-4">
                <MessageSquare className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <h2 className="font-semibold">Ask AI (Q&A)</h2>
                  <p className="text-sm text-muted-foreground">Get answers to your study questions</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
