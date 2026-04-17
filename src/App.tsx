/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import { config } from './wagmi';
import { Timer } from './components/Timer';
import { CheckIn } from './components/CheckIn';
import { motion } from 'motion/react';
import { useCallback } from 'react';

const queryClient = new QueryClient();

export default function App() {
  const handleTimerComplete = useCallback(() => {
    // Optional: play sound or notification
    console.log('Focus session finished!');
  }, []);

  const apiKey = process.env.VITE_ONCHAINKIT_API_KEY;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={base} apiKey={apiKey}>
          <div className="min-h-screen noise flex flex-col items-center justify-between py-12 px-6 selection:bg-blue-500/30">
            {/* Header */}
            <motion.header 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-xl flex flex-col items-center"
            >
              <div className="border-l border-white/10 pl-6 space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <h1 className="text-[10px] font-mono tracking-[0.5em] uppercase text-foreground/30">
                    Base / Concentration
                  </h1>
                </div>
                <h2 className="text-5xl font-serif italic font-light tracking-tighter">
                  Quiet Timer
                </h2>
              </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center w-full">
               <motion.div
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1 }}
               >
                 <Timer onComplete={handleTimerComplete} />
               </motion.div>
            </main>

            {/* Footer / Action */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full max-w-xs flex flex-col items-center space-y-12"
            >
              <div className="text-center">
                <p className="text-[10px] font-mono text-foreground/20 uppercase tracking-[0.2em] leading-relaxed mb-6">
                  Attribute your labor • builder code active
                </p>
                <CheckIn />
              </div>
            </motion.footer>

            {/* Background elements */}
            <div className="fixed inset-0 -z-10 bg-[#050505]" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full glow-aura -z-10 pointer-events-none" />
          </div>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
