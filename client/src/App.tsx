import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import Home from "./pages/home";
import Guide from "./pages/guide";
import Quiz from "./pages/quiz";
import Locator from "./pages/locator";
import Leaderboard from "./pages/leaderboard";
import Admin from "./pages/admin";
import Auth from "./pages/auth";
import NotFound from "@/pages/not-found";
import { localStorageManager } from "./lib/storage";
import { MouseFollower } from "./components/mouse-follower";

// Protected Route Component
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const isAuthenticated = localStorageManager.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Auth />;
  }
  
  return <Component />;
}

// Admin Route Component
function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const isAuthenticated = localStorageManager.isAuthenticated();
  const isAdmin = localStorageManager.isAdmin();
  
  if (!isAuthenticated) {
    return <Auth />;
  }
  
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">You need admin privileges to access this page.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Use the admin account (admin@ecosort.com / admin123) to access this page.
          </p>
        </div>
      </div>
    );
  }
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/guide" component={Guide} />
      <Route path="/quiz">
        <ProtectedRoute component={Quiz} />
      </Route>
      <Route path="/locator">
        <ProtectedRoute component={Locator} />
      </Route>
      <Route path="/leaderboard">
        <ProtectedRoute component={Leaderboard} />
      </Route>
      <Route path="/admin">
        <AdminRoute component={Admin} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background relative overflow-hidden">
          <MouseFollower />
          <Navigation />
          <main>
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
