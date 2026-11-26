/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useRef, useState } from 'react';
import { AdvantagesSection } from './components/AdvantagesSection';
import { ChatbotWidget } from './components/ChatbotWidget';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { Navbar } from './components/Navbar';
import { PricingSection } from './components/PricingSection';
import { PromotionSection } from './components/PromotionSection';
import { ServicesSection } from './components/ServicesSection';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [queuedPrompt, setQueuedPrompt] = useState<{ id: number; text: string } | null>(
    null
  );
  const promptCounterRef = useRef<number>(0);

  const handleOpenChat = useCallback(() => {
    setIsChatOpen(true);
  }, []);

  const handleAskWithPrompt = useCallback((question: string) => {
    promptCounterRef.current += 1;
    setQueuedPrompt({ id: promptCounterRef.current, text: question });
    setIsChatOpen(true);
  }, []);

  const handleQueuedPromptHandled = useCallback(() => {
    setQueuedPrompt(null);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#173C38]">
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#087F75] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Langsung ke konten utama
      </a>

      <Navbar onOpenChat={handleOpenChat} />

      <main id="konten-utama">
        <HeroSection onOpenChat={handleOpenChat} />
        <ServicesSection onAskService={handleAskWithPrompt} />
        <PricingSection onAskEstimate={handleAskWithPrompt} />
        <AdvantagesSection />
        <HowItWorksSection />
        <PromotionSection onAskPromo={handleAskWithPrompt} />
        <FaqSection />
        <ContactSection onOpenChat={handleOpenChat} />
      </main>

      <Footer />

      <ChatbotWidget
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
        queuedPrompt={queuedPrompt}
        onQueuedPromptHandled={handleQueuedPromptHandled}
      />
    </div>
  );
}
