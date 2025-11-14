
import { BottomNav } from "./BottomNav";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen pb-20">
      <main className="container max-w-md mx-auto p-4 animate-fade-in">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};
