import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Trophy, Star, Info, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { TrailGame } from './components/TrailGame';
import { LEVELS } from './levels';
import { GameState } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentLevelIndex: 0,
    score: 0,
    stars: 0,
    isGameStarted: false,
    isLevelComplete: false,
    isGameOver: false,
  });

  const currentLevel = LEVELS[gameState.currentLevelIndex];

  const handleStartGame = () => {
    setGameState(prev => ({ ...prev, isGameStarted: true }));
  };

  const handleLevelComplete = (time: number) => {
    setGameState(prev => {
      const isLastLevel = prev.currentLevelIndex === LEVELS.length - 1;
      if (isLastLevel) {
        return { ...prev, isLevelComplete: true, isGameOver: true };
      }
      return {
        ...prev,
        currentLevelIndex: prev.currentLevelIndex + 1,
        score: prev.score + Math.max(10, 100 - Math.floor(time)),
        stars: prev.stars + 3,
      };
    });
  };

  const handleReset = () => {
    setGameState({
      currentLevelIndex: 0,
      score: 0,
      stars: 0,
      isGameStarted: false,
      isLevelComplete: false,
      isGameOver: false,
    });
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] font-sans text-gray-900 overflow-x-hidden" dir="rtl">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-12 bg-white vibrant-border rounded-3xl p-4 shadow-vibrant">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center border-3 border-ink">
              <Sparkles className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-primary">بطل المسارات</h1>
              <p className="text-[10px] font-bold text-ink uppercase tracking-widest">TMT KIDS</p>
            </div>
          </div>

          {gameState.isGameStarted && (
            <div className="flex items-center gap-4">
              <div className="bg-accent border-3 border-ink px-4 py-2 rounded-full font-bold flex items-center gap-2">
                <Star className="w-5 h-5 fill-ink text-ink" />
                <span>{gameState.stars} نقطة</span>
              </div>
              <div className="bg-secondary border-3 border-ink px-4 py-2 rounded-full font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-ink" />
                <span>{gameState.currentLevelIndex + 1} / {LEVELS.length}</span>
              </div>
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {!gameState.isGameStarted ? (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto"
            >
              <div className="relative mb-8">
                <motion.div 
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="w-32 h-32 bg-accent rounded-[2.5rem] flex items-center justify-center border-4 border-ink shadow-vibrant"
                >
                  <Trophy className="w-16 h-16 text-ink" />
                </motion.div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center border-4 border-ink shadow-lg">
                  <Star className="w-6 h-6 text-white fill-current" />
                </div>
              </div>

              <h2 className="text-5xl md:text-6xl font-black text-ink mb-6 leading-tight">
                حول رحلتك إلى <span className="text-primary">مغامرة ذكاء!</span>
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
                مرحباً بك في "بطل المسارات". هل أنت مستعد لتحدي عقلك والقفز بين الأرقام والحروف؟ 
                خمس مستويات من المرح بانتظارك!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
                {[
                  { icon: Star, title: "تركيز بصري", color: "bg-secondary/20 text-ink border-3 border-ink" },
                  { icon: Sparkles, title: "مرونة معرفية", color: "bg-accent/20 text-ink border-3 border-ink" },
                  { icon: Trophy, title: "سرعة معالجة", color: "bg-primary/20 text-ink border-3 border-ink" },
                ].map((item, i) => (
                  <div key={i} className={cn("p-6 rounded-3xl flex flex-col items-center gap-3 shadow-vibrant", item.color)}>
                    <item.icon className="w-8 h-8" />
                    <span className="font-bold">{item.title}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleStartGame}
                className="btn-vibrant-primary text-2xl px-12 py-6"
              >
                <span>ابدأ المغامرة</span>
                <Play className="w-8 h-8 fill-current" />
              </button>
            </motion.div>
          ) : gameState.isGameOver ? (
            <motion.div 
              key="gameover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="bg-white p-12 vibrant-card max-w-2xl w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-3 bg-primary" />
                
                <Trophy className="w-32 h-32 text-accent mx-auto mb-8 drop-shadow-[0_4px_0_rgba(0,0,0,0.1)]" />
                <h2 className="text-5xl font-black text-ink mb-4">أنت بطل حقيقي!</h2>
                <p className="text-xl text-gray-600 mb-8">لقد أكملت جميع مستويات "بطل المسارات" بذكاء وسرعة.</p>
                
                <div className="grid grid-cols-2 gap-6 mb-12">
                  <div className="bg-primary/10 border-3 border-ink p-6 rounded-3xl shadow-vibrant">
                    <span className="block text-sm font-bold text-primary uppercase mb-1">النقاط</span>
                    <span className="text-4xl font-black text-ink">{gameState.score}</span>
                  </div>
                  <div className="bg-accent/20 border-3 border-ink p-6 rounded-3xl shadow-vibrant">
                    <span className="block text-sm font-bold text-accent uppercase mb-1">النجوم</span>
                    <span className="text-4xl font-black text-ink">{gameState.stars}</span>
                  </div>
                </div>

                <button 
                  onClick={handleReset}
                  className="btn-vibrant-primary w-full justify-center"
                >
                  <RotateCcw className="w-6 h-6" />
                  <span>العب مرة أخرى</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Level Selector (Mini) */}
              <div className="flex justify-center gap-3 mb-8 overflow-x-auto py-2">
                {LEVELS.map((level, idx) => (
                  <div 
                    key={level.id}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all border-3",
                      idx === gameState.currentLevelIndex 
                        ? "bg-primary text-white border-ink scale-110 shadow-vibrant" 
                        : idx < gameState.currentLevelIndex
                        ? "bg-secondary text-ink border-ink"
                        : "bg-white text-gray-300 border-gray-200"
                    )}
                  >
                    {idx < gameState.currentLevelIndex ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
                  </div>
                ))}
              </div>

              <TrailGame 
                level={currentLevel} 
                onComplete={handleLevelComplete}
                onReset={() => setGameState(prev => ({ ...prev, isGameStarted: false }))}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <footer className="mt-auto pt-12 pb-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="bg-ink text-white px-6 py-4 rounded-2xl flex items-center gap-4 w-full md:w-auto">
            <div className="text-2xl">🐰</div>
            <div>
              <p className="text-xs font-bold text-accent uppercase">نصيحة الأرنب</p>
              <p className="text-sm font-medium">"أين الـ 1؟ نعم هنا، الآن أبحث عن الألف.. أين هي؟"</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-ink/60 font-bold text-sm">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>دليل تدريبي للأطفال (6-9 سنوات)</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span>تصميم وبرمجة دكتور أحمد حمدي عاشور الغول</span>
              <div className="flex items-center gap-2">
                <span>دكتوراه في علم النفس التربوي</span>
                <div className="w-1 h-1 bg-ink/20 rounded-full" />
                <span>٢٠٢٦</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
