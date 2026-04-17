import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Timer, Trophy, RotateCcw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Level, GameNode } from '../types';
import { cn } from '../lib/utils';

interface TrailGameProps {
  level: Level;
  onComplete: (time: number) => void;
  onReset: () => void;
}

export const TrailGame: React.FC<TrailGameProps> = ({ level, onComplete, onReset }) => {
  const [connectedNodes, setConnectedNodes] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(level.timeLimit || null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errorNode, setErrorNode] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset state when level changes
  useEffect(() => {
    setConnectedNodes([]);
    setTimeLeft(level.timeLimit || null);
    setStartTime(null);
    setErrorNode(null);
    setIsFinished(false);
  }, [level]);

  // Timer logic
  useEffect(() => {
    if (startTime && timeLeft !== null && timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? Math.max(0, prev - 1) : null));
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isFinished) {
      // Game over logic could go here, but for kids we might just let them finish or show a gentle nudge
    }
  }, [startTime, timeLeft, isFinished]);

  const handleNodeClick = (nodeId: string) => {
    if (isFinished) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const nextRequiredNodeId = level.sequence[connectedNodes.length];

    if (nodeId === nextRequiredNodeId) {
      const newConnected = [...connectedNodes, nodeId];
      setConnectedNodes(newConnected);
      setErrorNode(null);

      // Check if level is complete
      if (newConnected.length === level.sequence.length) {
        setIsFinished(true);
        const endTime = Date.now();
        const duration = startTime ? (endTime - startTime) / 1000 : 0;
        
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FF6321', '#32CD32', '#3B82F6']
        });

        setTimeout(() => {
          onComplete(duration);
        }, 2000);
      }
    } else {
      // Wrong node
      setErrorNode(nodeId);
      setTimeout(() => setErrorNode(null), 500);
    }
  };

  const getLinePoints = () => {
    return connectedNodes.map((id) => {
      const node = level.nodes.find((n) => n.id === id);
      return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
    });
  };

  const linePoints = getLinePoints();

  return (
    <div className="relative w-full h-full flex flex-col items-center select-none" dir="rtl">
      {/* HUD */}
      <div className="w-full max-w-4xl flex justify-between items-center p-4 mb-4 bg-white vibrant-border rounded-2xl shadow-vibrant">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-accent border-3 border-ink px-4 py-2 rounded-xl text-ink font-bold">
            <Star className="w-5 h-5 fill-ink text-ink" />
            <span>{connectedNodes.length} / {level.sequence.length}</span>
          </div>
          {level.timeLimit && (
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-bold border-3 border-ink transition-colors",
              timeLeft && timeLeft < 10 ? "bg-primary text-white animate-pulse" : "bg-secondary text-ink"
            )}>
              <Timer className="w-5 h-5" />
              <span>{timeLeft} ثانية</span>
            </div>
          )}
        </div>
        
        <button 
          onClick={onReset}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-ink"
          title="إعادة المحاولة"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Game Area */}
      <div 
        ref={containerRef}
        className={cn(
          "relative w-full max-w-4xl aspect-[4/3] bg-white vibrant-border rounded-3xl shadow-vibrant overflow-hidden",
          level.theme === 'nature' && "bg-green-50/30",
          level.theme === 'racing' && "bg-slate-50/30",
          level.theme === 'circus' && "bg-red-50/30",
          level.theme === 'detective' && "bg-indigo-50/30",
          level.theme === 'maze' && "bg-amber-50/30"
        )}
      >
        {/* Background Decorations based on theme */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {level.theme === 'nature' && <div className="w-full h-full bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:20px_20px]" />}
          {level.theme === 'racing' && <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#64748b,#64748b_10px,#94a3b8_10px,#94a3b8_20px)]" />}
        </div>

        {/* Lines */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {linePoints.length > 1 && (
            <motion.path
              d={`M ${linePoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
              fill="none"
              stroke="#FF6B6B"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </svg>

        {/* Nodes */}
        {level.nodes.map((node) => {
          const isConnected = connectedNodes.includes(node.id);
          const isNext = level.sequence[connectedNodes.length] === node.id;
          const isError = errorNode === node.id;

          return (
            <motion.button
              key={node.id}
              onClick={() => handleNodeClick(node.id)}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center text-xl font-black transition-all duration-200 border-3 border-ink",
                isConnected ? "bg-primary text-white scale-90 shadow-none" : "bg-white text-ink hover:scale-110 active:scale-95 shadow-vibrant",
                isNext && !isConnected && "ring-4 ring-accent ring-offset-2",
                isError && "bg-red-500 text-white animate-shake",
                node.type === 'color' && !isConnected && "border-4"
              )}
              style={{ 
                left: `${node.x}%`, 
                top: `${node.y}%`,
                backgroundColor: node.type === 'color' && !isConnected ? node.color : undefined,
                borderColor: node.type === 'color' && !isConnected ? 'white' : undefined
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {node.type === 'color' ? (
                isConnected ? node.label || connectedNodes.indexOf(node.id) + 1 : ''
              ) : (
                node.label
              )}
              
              {isConnected && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-secondary rounded-full p-1 border-2 border-ink shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-ink" />
                </motion.div>
              )}
            </motion.button>
          );
        })}

        {/* Success Overlay */}
        <AnimatePresence>
          {isFinished && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-accent/40 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-center p-6"
            >
              <motion.div
                initial={{ scale: 0.5, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white p-8 vibrant-card max-w-sm"
              >
                <Trophy className="w-20 h-20 text-primary mx-auto mb-4 drop-shadow-[0_4px_0_rgba(0,0,0,0.1)]" />
                <h2 className="text-3xl font-black text-ink mb-2">{level.message}</h2>
                <p className="text-gray-600 mb-6 font-bold">لقد أكملت المستوى بنجاح!</p>
                <div className="flex items-center justify-center gap-1 text-accent mb-6">
                  <Star className="w-8 h-8 fill-current stroke-ink stroke-2" />
                  <Star className="w-8 h-8 fill-current stroke-ink stroke-2" />
                  <Star className="w-8 h-8 fill-current stroke-ink stroke-2" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center max-w-2xl px-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{level.title}</h3>
        <p className="text-lg text-gray-600 leading-relaxed">{level.description}</p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          25% { transform: translate(-50%, -50%) rotate(-5deg); }
          75% { transform: translate(-50%, -50%) rotate(5deg); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
