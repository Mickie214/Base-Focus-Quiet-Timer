import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, RotateCcw, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TimerProps {
  onComplete?: () => void;
}

export const Timer: React.FC<TimerProps> = ({ onComplete }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [initialTotal] = useState(25 * 60);
  
  const totalSeconds = minutes * 60 + seconds;
  const progress = totalSeconds / initialTotal;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && totalSeconds > 0) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (totalSeconds === 0 && isActive) {
      setIsActive(false);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0052ff', '#ffffff', '#4f46e5']
      });
      if (onComplete) onComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, totalSeconds, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm px-8">
      {/* Decorative Status Bar */}
      <div className="w-full flex justify-between mb-24 font-mono text-[9px] tracking-[0.2em] text-foreground/30 uppercase">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-500 animate-pulse' : 'bg-white/10'}`} />
          {isActive ? 'System Active' : 'Standby'}
        </div>
        <div>25:00 / 0.00 BASE</div>
      </div>

      {/* The Candle Visualization */}
      <div className="relative w-32 h-64 mb-20 flex items-end justify-center">
        {/* Background Glow */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full scale-150"
            />
          )}
        </AnimatePresence>

        {/* Outer Frame */}
        <div className="absolute inset-0 border border-white/5 rounded-full overflow-hidden glass-morphism">
          {/* Progress Pillar (The Wax) */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-700 via-blue-500 to-white/90"
            initial={{ height: '100%' }}
            animate={{ height: `${progress * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>

        {/* The Wick & Flame */}
        <motion.div 
           className="absolute top-[-10px] w-[1px] h-6 bg-white/20"
           animate={{ opacity: isActive ? 1 : 0.3 }}
        >
          {isActive && (
            <motion.div
              animate={{ 
                scale: [1, 1.2, 0.9, 1.1, 1],
                opacity: [0.8, 1, 0.7, 0.9, 0.8],
                y: [0, -2, 1, -1, 0]
              }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full blur-[2px] shadow-[0_0_15px_white]"
            />
          )}
        </motion.div>

        {/* Digital Time Overlay */}
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 rotate-90 flex flex-col items-start">
             <span className="font-mono text-[10px] tracking-widest text-foreground/20 uppercase mb-2">Internal Clock</span>
             <motion.span 
               key={totalSeconds}
               initial={{ opacity: 0, x: -5 }}
               animate={{ opacity: 1, x: 0 }}
               className="text-4xl font-serif italic font-light whitespace-nowrap"
             >
               {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
             </motion.span>
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="w-full flex items-center justify-between glass-morphism p-2 rounded-full px-6">
        <button
          onClick={resetTimer}
          className="p-3 text-foreground/30 hover:text-foreground/80 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={toggleTimer}
          className={`flex items-center gap-3 px-8 py-3 rounded-full font-mono text-[11px] tracking-widest uppercase transition-all ${
            isActive 
            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
            : 'bg-white/5 hover:bg-white/10 text-foreground'
          }`}
        >
          {isActive ? (
            <>
              <Square className="w-3 h-3 fill-current" /> Stop
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" /> Focus
            </>
          )}
        </button>

        <div className="p-3 text-blue-500/50">
          <ShieldCheck className="w-4 h-4" />
        </div>
      </div>

      {/* Micro Info */}
      <div className="mt-8 text-[8px] font-mono text-foreground/20 tracking-[0.3em] uppercase text-center">
        Verification Ready • V2.0.4-Focus
      </div>
    </div>
  );
};
