import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PracticePage from "./pages/PracticePage";
import ContactPage from "./pages/ContactPage";
import MainPage from "./pages/MainPage";
import ConsentPage from "./pages/ConsentPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [consentGiven, setConsentGiven] = useState(false);

  const handleConsentAccepted = () => {
    setConsentGiven(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/*
             * Public content routes — independently accessible without consent.
             * These satisfy the 2-3 page requirement and are crawlable.
             */}
            <Route path="/" element={<HomePage />} />
            <Route path="/practice-areas" element={<PracticePage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/*
             * Legacy full single-page experience (consent-gated).
             * Kept at /home for the original full-scroll experience.
             */}
            <Route
              path="/home"
              element={
                !consentGiven ? (
                  <ConsentPage onConsentAccepted={handleConsentAccepted} />
                ) : (
                  <MainPage />
                )
              }
            />

            {/* 404 catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
