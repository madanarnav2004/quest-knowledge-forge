
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import QAPage from "./pages/QAPage";
import InputPage from "./pages/InputPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/qa" element={<QAPage />} />
          <Route path="/input" element={<InputPage />} />
          {/* Placeholder routes for other sections */}
          <Route path="/knowledge" element={<Dashboard />} />
          <Route path="/docs" element={<Dashboard />} />
          <Route path="/code" element={<Dashboard />} />
          <Route path="/learning" element={<Dashboard />} />
          <Route path="/settings" element={<Dashboard />} />
          <Route path="/contact" element={<Dashboard />} />
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
