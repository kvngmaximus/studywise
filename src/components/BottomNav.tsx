
import { Home, User, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card p-4 animate-slide-up">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link
          to="/"
          className={`flex flex-col items-center transition-colors ${
            isActive("/") ? "text-primary" : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center transition-colors ${
            isActive("/profile") ? "text-primary" : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
        <Link
          to="/settings"
          className={`flex flex-col items-center transition-colors ${
            isActive("/settings") ? "text-primary" : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <Settings className="h-6 w-6" />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </nav>
  );
};
