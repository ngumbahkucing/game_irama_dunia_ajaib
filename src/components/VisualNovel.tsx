import React, { useState, useEffect } from 'react';
import { Chapter, StoryNode, PlayerStats } from '../types';
import { CHARACTERS } from '../data/characters';
import { audio } from '../utils/audio';
import { BookOpen, ArrowRight, Home, Sparkles, AlertCircle, Heart } from 'lucide-react';

interface VisualNovelProps {
  chapter: Chapter;
  playerStats: PlayerStats;
  onFinishChapter: (chapterId: string) => void;
  onBack: () => void;
}

const EXPRESSION_EMOJIS: Record<string, string> = {
  SENANG: '🌸  (☆‿☆)',
  BINGUNG: '❓  (・_・?)',
  SEMANGAT: '🔥  ٩(ˊᗜˋ*)و',
  SERIUS: '⭐  ( •_•)',
  BIASA: '✨  (o^^o)'
};

const EXPRESSION_BG: Record<string, string> = {
  SENANG: 'bg-gradient-to-tr from-pink-400 to-amber-300 shadow-[0_0_25px_rgba(244,63,94,0.5)]',
  BINGUNG: 'bg-gradient-to-tr from-cyan-400 to-indigo-300 shadow-[0_0_20px_rgba(34,211,238,0.4)]',
  SEMANGAT: 'bg-gradient-to-tr from-yellow-400 to-rose-500 shadow-[0_0_30px_rgba(234,179,8,0.6)] animate-bounce',
  SERIUS: 'bg-gradient-to-tr from-indigo-500 to-blue-600 shadow-[0_0_20px_rgba(79,70,229,0.4)]',
  BIASA: 'bg-gradient-to-tr from-emerald-400 to-teal-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
};

export default function VisualNovel({ chapter, playerStats, onFinishChapter, onBack }: VisualNovelProps) {
  const [currentNodeIdx, setCurrentNodeIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [storyFinished, setStoryFinished] = useState(false);

  const totalNodes = chapter.nodes.length;
  const currentNode: StoryNode = chapter.nodes[currentNodeIdx] || chapter.nodes[0];
  
  // Find which character is talking to present their full bio
  const characterObj = CHARACTERS.find(c => c.name.toLowerCase() === currentNode.characterName.toLowerCase()) || CHARACTERS[0];

  // Simple typewriter effect
  useEffect(() => {
    setTypedText('');
    setIsTyping(true);
    let index = 0;
    const fullText = currentNode.dialogue;
    
    const interval = setInterval(() => {
      setTypedText(prev => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 28); // Speed of reading for kids

    return () => clearInterval(interval);
  }, [currentNodeIdx, chapter]);

  const handleNext = () => {
    audio.playChopClick();
    if (isTyping) {
      // Skip typewriter animation
      setTypedText(currentNode.dialogue);
      setIsTyping(false);
    } else {
      if (currentNodeIdx < totalNodes - 1) {
        setCurrentNodeIdx(prev => prev + 1);
      } else {
        setStoryFinished(true);
        audio.playSuccessCelebration();
      }
    }
  };

  const handleClaimReward = () => {
    onFinishChapter(chapter.id);
  };

  return (
    <div className="relative w-full min-h-screen bg-natural-bg text-natural-text flex flex-col justify-between p-4 overflow-hidden select-none" id="vn_board">
      {/* Decorative Pastel Grid Art */}
      <div className="absolute inset-0 bg-[radial-gradient(#E9C46A_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-20"></div>

      {/* TOPBAR NAVIGATION STATUS */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex items-center justify-between bg-white border-4 border-natural-border p-4 rounded-[24px] shadow-md text-natural-text" id="vn_navigation">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-natural-primary" />
          <div>
            <span className="text-[10px] font-mono font-black text-natural-primary uppercase tracking-widest">{chapter.faction} • Episode {chapter.id.split('_').pop()}</span>
            <h3 className="text-sm font-black text-natural-text line-clamp-1">{chapter.title}</h3>
          </div>
        </div>
        <button 
          onClick={onBack}
          className="py-1.5 px-4 rounded-full bg-natural-bg hover:bg-natural-card text-natural-text text-xs font-bold flex items-center gap-1.5 transition-all border-2 border-natural-border shadow-sm cursor-pointer active:translate-y-0.5"
          id="exit_vn_btn"
        >
          <Home size={12} /> Keluar
        </button>
      </div>

      {/* ACTIVE CHARACTER SPRITE DISPLAY FRAME */}
      {!storyFinished && (
        <div className="relative flex-1 w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-6" id="vn_sprite_container">
          {/* Faction Banner Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-natural-orange/10 blur-3xl pointer-events-none"></div>

          {/* Character Main Profile Display Card */}
          <div className="relative flex flex-col items-center animate-fade-in">
            {/* Expression Emotion Banner above head */}
            <div className="mb-4 bg-white border-4 border-natural-border py-1.5 px-4 rounded-full text-xs font-mono font-black text-natural-primary flex items-center gap-1.5 shadow-md">
              <span>{EXPRESSION_EMOJIS[currentNode.expression]}</span>
              <span className="text-[9px] uppercase tracking-wide text-natural-text/50 font-sans">Emosi: {currentNode.expression}</span>
            </div>

            {/* Glowing avatar sphere */}
            <div className={`w-40 h-40 rounded-full flex items-center justify-center p-1.5 transition-all duration-300 ${EXPRESSION_BG[currentNode.expression]}`}>
              <div className="w-full h-full rounded-full bg-natural-card flex flex-col items-center justify-center p-4 text-center border-4 border-white shadow-inner">
                <span className="text-4xl">🐱</span>
                <span className={`text-xl font-black uppercase mt-1 ${characterObj.textColor}`}>{currentNode.characterName}</span>
                <span className="text-[9px] font-mono text-natural-text/50 mt-0.5 tracking-wider uppercase font-bold">{characterObj.nickname}</span>
              </div>
            </div>

            {/* Bubble decoration */}
            <div className="absolute bottom-6 -right-6 w-10 h-10 rounded-full bg-gradient-to-tr from-rose-400 to-natural-orange blur-sm opacity-55 animate-pulse"></div>
            <div className="absolute top-16 -left-10 w-8 h-8 rounded-full bg-gradient-to-tr from-natural-teal to-[#A2D2FF] blur-sm opacity-40 animate-bounce"></div>
          </div>
        </div>
      )}

      {/* REWARD / FINISH CONGRATULATIONS PAGE */}
      {storyFinished && (
        <div className="relative flex-1 w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center p-6" id="vn_completed_sheet">
          <div className="bg-white border-4 border-natural-border p-8 rounded-[32px] max-w-sm shadow-xl text-natural-text relative">
            <div className="w-16 h-16 bg-gradient-to-tr from-natural-teal to-[#A2D2FF] rounded-full flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce border-2 border-white shadow-md">
              🎉
            </div>
            
            <h3 className="text-xl font-black text-natural-text">Kisah Selesai Dibaca!</h3>
            <p className="text-xs text-natural-text/60 mt-2 mb-6 font-sans">Hebat! Kamu telah menyimak kisah persahabatan yang manis ini sampai akhir. Teruslah berkarya!</p>

            {/* Rewards */}
            <div className="flex flex-col gap-2 mb-6 bg-natural-bg p-3.5 rounded-2xl border-2 border-natural-border/60">
              <div className="flex items-center justify-between text-xs px-2 py-1">
                <span className="font-bold text-natural-text/60 font-sans">Bonus Star Dust</span>
                <span className="font-mono font-black text-natural-primary flex items-center gap-1"><Sparkles size={12} /> +100 Star Dust</span>
              </div>
              <div className="flex items-center justify-between text-xs px-2 py-1 border-t-2 border-natural-border/30">
                <span className="font-bold text-natural-text/60 font-sans">Bonus Gems</span>
                <span className="font-mono font-black text-blue-700 flex items-center gap-1"><Heart size={12} fill="currentColor" /> +50 Permata</span>
              </div>
            </div>

            <button 
              onClick={handleClaimReward}
              className="w-full py-3 px-6 rounded-full bg-natural-primary hover:bg-natural-orange text-white font-black text-sm transition-all shadow-md border-b-4 border-natural-primary-dark active:border-b-0 active:translate-y-1 cursor-pointer"
              id="claim_vn_reward_btn"
            >
              Klaim & Kembali ke Panggung
            </button>
          </div>
        </div>
      )}

      {/* DIALOG BOX WITH CHARACTER NAME TAG (Bottom layout) */}
      {!storyFinished && (
        <div 
          onClick={handleNext}
          className="relative z-10 w-full max-w-2xl mx-auto bg-white border-4 border-natural-border hover:shadow-lg p-5 rounded-[28px] cursor-pointer shadow-xl transition-all"
          id="dialogue_box"
        >
          {/* Character Name Badge */}
          <div className={`absolute -top-4.5 left-8 ${characterObj.avatarColor} px-6 py-1.5 rounded-full border-2 border-white shadow-md`}>
            <span className="text-xs font-black tracking-wide text-slate-950 uppercase">{currentNode.characterName}</span>
          </div>

          {/* Main dialogue speech content */}
          <div className="min-h-[70px] mt-2.5 text-natural-text font-semibold text-sm leading-relaxed antialiased select-text">
            {typedText}
            {isTyping && <span className="inline-block w-2.5 h-4 bg-natural-primary ml-1 animate-pulse"></span>}
          </div>

          {/* Action indicator inside boundary */}
          <div className="flex justify-between items-center text-[10px] font-bold text-natural-text/50 border-t-2 border-natural-border/30 mt-3 pt-2">
            <span>Progress Episode {currentNodeIdx + 1} / {totalNodes}</span>
            <span className="flex items-center gap-1 align-middle text-natural-primary font-black">Klik / Sentuh untuk Lanjut <ArrowRight size={10} className="mt-0.5 animate-bounce-horizontal" /></span>
          </div>
        </div>
      )}
    </div>
  );
}
