import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Chatbot from "@/pages/Chatbot";
import DiseaseDetection from "@/pages/DiseaseDetection";
import Weather from "@/pages/Weather";
import Community from "@/pages/Community";
import NotFound from "@/pages/not-found";

// Use a fresh QueryClient here; custom fetch is handled in hooks
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={Auth} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/ai" component={Chatbot} />
        <Route path="/disease" component={DiseaseDetection} />
        <Route path="/weather" component={Weather} />
        <Route path="/community" component={Community} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
