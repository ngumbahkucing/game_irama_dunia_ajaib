import React, { useState } from 'react';
import { Card, PlayerStats } from '../types';
import { CARDS_DATABASE, CHARACTERS } from '../data/characters';
import { audio } from '../utils/audio';
import { Sparkles, Star, Heart, ArrowLeft, ArrowUpCircle, RefreshCw, AlertCircle, ShoppingBag } from 'lucide-react';

interface GachaCenterProps {
  playerStats: PlayerStats;
  onPull: (pulledCards: Card[], totalCost: number) => void;
  onBack: () => void;
}

export default function GachaCenter({ playerStats, onPull, onBack }: GachaCenterProps) {
  const [isSummoning, setIsSummoning] = useState(false);
  const [pulledItems, setPulledItems] = useState<{ card: Card; isDuplicate: boolean }[]>([]);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [summonType, setSummonType] = useState<1 | 10>(1);

  // Magic Gacha rate computation:
  // 5 Stars: 10% rate
  // 4 Stars: 30% rate
  // 3 Stars: 60% rate
  const executeDraw = (count: 1 | 10) => {
    const cost = count === 1 ? 100 : 900;
    if (playerStats.magicGems < cost) {
      alert('Permata Ajaib kamu tidak mencukupi! Selesaikan konser lagu di panggung untuk memperoleh lebih banyak Permata!');
      return;
    }

    audio.playGachaReveal();
    setIsSummoning(true);
    setSummonType(count);

    // Simulate animated pulling delay
    setTimeout(() => {
      const drawnItems: { card: Card; isDuplicate: boolean }[] = [];
      const db5 = CARDS_DATABASE.filter(c => c.rarity === 5);
      const db4 = CARDS_DATABASE.filter(c => c.rarity === 4);
      const db3 = CARDS_DATABASE.filter(c => c.rarity === 3);

      for (let i = 0; i < count; i++) {
        const roll = Math.random() * 100;
        let pool: Card[] = db3;
        
        if (roll < 10) {
          pool = db5; // 10% chance
        } else if (roll < 40) {
          pool = db4; // 30% chance
        }

        const randomCard = pool[Math.floor(Math.random() * pool.length)];
        const isDuplicate = playerStats.unlockedCardIds.includes(randomCard.id);
        drawnItems.push({ card: randomCard, isDuplicate });
      }

      setPulledItems(drawnItems);
      setIsSummoning(false);
      setShowResultsModal(true);
      
      // Fire top level dispatch state change
      const cardsOnly = drawnItems.map(item => item.card);
      onPull(cardsOnly, cost);
    }, 2200); // 2.2 seconds of cosmic spin animation
  };

  const closeResults = () => {
    setPulledItems([]);
    setShowResultsModal(false);
  };

  return (
    <div className="relative w-full min-h-screen bg-natural-bg text-natural-text flex flex-col justify-between p-4 overflow-hidden" id="gacha_stage">
      {/* Decorative starry patterns */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-natural-orange/10 via-natural-orange/5 to-transparent pointer-events-none"></div>

      {/* TOP HEADER WITH RESOURCE TICKER */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex items-center justify-between" id="gacha_header">
        <button 
          onClick={onBack}
          className="py-2.5 px-5 rounded-full bg-white hover:bg-natural-card text-natural-text border-2 border-natural-border active:translate-y-0.5 transition-all text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer"
          id="gacha_back_btn"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="flex items-center gap-3 bg-white border-4 border-natural-border py-2 px-4 rounded-full shadow-md text-natural-text">
          <div className="flex items-center gap-1.5 border-r-2 border-natural-border/40 pr-3">
            <span className="text-[10px] font-black text-blue-700 font-sans tracking-tight">PERMATA</span>
            <span className="font-mono text-xs font-black text-blue-800">{playerStats.magicGems} 💎</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-natural-primary font-sans tracking-tight">STAR DUST</span>
            <span className="font-mono text-xs font-black text-natural-text">{playerStats.starDust} ✨</span>
          </div>
        </div>
      </div>

      {/* ANCHOR SPINNER ANIMATION STATE */}
      {isSummoning ? (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10" id="summon_spin_zone">
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* Spinning decorative geometric background lines */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-natural-primary/25 animate-spin-slow duration-8000"></div>
            <div className="absolute inset-4 rounded-full border-2 border-dashed border-natural-orange/30 animate-spin-reverse duration-5000"></div>
            <div className="absolute inset-8 rounded-full bg-natural-orange/10 flex items-center justify-center animate-pulse">
              <Sparkles size={56} className="text-natural-primary fill-natural-orange animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
          <h3 className="text-2xl font-black tracking-wide text-center text-natural-primary mt-6 animate-pulse">MEMANGGIL KARTU AJAIB...</h3>
          <p className="text-xs text-natural-text/60 font-sans mt-2">Menyeimbangkan harmoni suara istana panggung!</p>
        </div>
      ) : (
        /* MAIN LANDING GACHA DISPLAY */
        <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-6 relative z-10" id="gacha_hub_hero">
          <div className="text-center max-w-md mb-8">
            <span className="text-xs font-black tracking-wider bg-natural-primary/10 text-natural-primary px-4 py-1.5 rounded-full border border-natural-primary/20">KUPON SUMMON AMAN & CERIA</span>
            <h2 className="text-3xl font-black tracking-tight text-natural-text mt-4 leading-tight">Gerbang Pemanggilan Kartu</h2>
            <p className="text-xs text-natural-text/75 mt-2 font-sans px-4">Gunakan Permata Ajaib yang kamu dapatkan dari menyelesaikan konser musik untuk memanggil teman panggung baru atau kostum konser super langka! (Saran: Multi-Pull 10x menghemat biaya!)</p>
          </div>

          {/* Core Draw options rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-4" id="draw_options">
            {/* SINGLE PULL CARD */}
            <div className="bg-white border-4 border-natural-border rounded-[32px] p-6 flex flex-col justify-between hover:shadow-lg transition-all shadow-md text-natural-text" id="pull_1_option">
              <div className="mb-4">
                <span className="text-[10px] font-mono font-black text-natural-primary uppercase tracking-wider bg-natural-primary/10 px-2 py-0.5 rounded">PAKET SEDERHANA</span>
                <h3 className="text-lg font-black text-natural-text mt-2">Pemanggilan 1 Kali</h3>
                <p className="text-xs text-natural-text/70 mt-1 font-sans">Mendapatkan 1 kartu karakter acak.</p>
              </div>
              <button 
                onClick={() => executeDraw(1)}
                className="w-full py-3.5 rounded-full bg-natural-primary hover:bg-natural-orange text-white font-black text-xs transition-all tracking-wide shadow-md border-b-4 border-natural-primary-dark active:border-b-0 active:translate-y-1 cursor-pointer flex items-center justify-center gap-1.5"
                id="sum_1_btn"
              >
                Summon x1 <span className="text-xs font-mono font-normal opacity-85">(100 💎)</span>
              </button>
            </div>

            {/* MULTI PULL CARD */}
            <div className="bg-[#FDFCF0] border-4 border-natural-primary rounded-[32px] p-6 flex flex-col justify-between hover:shadow-lg transition-all shadow-md text-natural-text relative" id="pull_10_option">
              <div className="absolute -top-3.5 right-6 bg-natural-primary border-2 border-white text-white font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-wider shadow">Hemat Untung!</div>
              <div className="mb-4">
                <span className="text-[10px] font-mono font-black text-natural-orange uppercase tracking-wider bg-natural-orange/10 px-2 py-0.5 rounded animate-pulse">KOMBO MENAKJUBKAN</span>
                <h3 className="text-lg font-black text-natural-text mt-2">Pemanggilan 10 Kali</h3>
                <p className="text-xs text-natural-text/70 mt-1 font-sans">Mengundi 10 kartu sekaligus dengan potongan harga 100 Permata!</p>
              </div>
              <button 
                onClick={() => executeDraw(10)}
                className="w-full py-3.5 rounded-full bg-natural-orange hover:bg-natural-primary text-white font-black text-xs transition-all tracking-wide shadow-md border-b-4 border-natural-primary-dark active:border-b-0 active:translate-y-1 cursor-pointer flex items-center justify-center gap-1.5"
                id="sum_10_btn"
              >
                Summon x10 <span className="text-xs font-mono font-black opacity-85">(900 💎)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER INFORMATIONAL RATES BOX */}
      {!isSummoning && (
        <div className="relative z-10 w-full max-w-xl mx-auto bg-white/80 border-2 border-natural-border/30 rounded-full py-2.5 px-4 text-center text-[10px] font-bold text-natural-text/60 flex items-center justify-center gap-1.5 shadow-sm" id="gacha_rates_ticker">
          <AlertCircle size={10} className="text-natural-primary" />
          <span>Rasio Peluang: ★5 Ultra (10%)  •  ★4 Hebat (30%)  •  ★3 Biasa (60%). Duplikasi otomatis dikonversi menjadi Star Dust!</span>
        </div>
      )}

      {/* SUMMON RESULTS MODAL SCREEN (Overlay with card designs) */}
      {showResultsModal && (
        <div className="absolute inset-0 z-40 bg-natural-bg/95 backdrop-blur-md overflow-y-auto flex flex-col items-center justify-start p-6" id="gacha_results_modal">
          <div className="w-full max-w-2xl text-center mb-8 mt-4 animate-fade-in border-b-4 border-natural-border pb-3">
            <span className="text-sm font-black tracking-widest text-natural-primary flex items-center justify-center gap-1.5"><Sparkles size={14} /> HASIL PEMANGGILAN GACHA <Sparkles size={14} /></span>
            <p className="text-xs text-natural-text/70 mt-1 font-sans">Berikut adalah sahabat barumu yang bergabung dalam harmoni!</p>
          </div>

          {/* Cards Flex Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-4xl px-2 self-center mb-6" id="card_deck_results">
            {pulledItems.map((pulled, idx) => {
              const charInfo = CHARACTERS.find(c => c.id === pulled.card.characterId);
              const starsArr = Array.from({ length: pulled.card.rarity });
              
              const rarityBg = pulled.card.rarity === 5 
                ? 'bg-white border-4 border-[#E9C46A] shadow-md' 
                : pulled.card.rarity === 4 
                  ? 'bg-white border-4 border-natural-orange/60 shadow-md' 
                  : 'bg-white border-2 border-natural-border/30 shadow-sm';

              return (
                <div 
                  key={`${pulled.card.id}-${idx}`} 
                  className={`rounded-[24px] p-4 flex flex-col justify-between relative overflow-hidden transition-all hover:scale-105 active:scale-95 text-natural-text ${rarityBg}`}
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  {/* Duplicate warning tag with star dust converter description */}
                  {pulled.isDuplicate && (
                    <div className="absolute top-2.5 right-2.5 bg-natural-primary border border-white text-white px-1.5 py-0.5 rounded-full text-[8px] font-mono font-black tracking-tight uppercase flex items-center gap-0.5 shadow z-10">
                      Duplikat: +100 ✨
                    </div>
                  )}

                  {/* Character Icon or Theme Circle */}
                  <div className="flex flex-col items-center text-center mt-2">
                    <div className={`w-12 h-12 rounded-full ${charInfo?.avatarColor} border-2 border-white flex items-center justify-center text-sm font-black text-slate-950 shadow-md`}>
                      {charInfo?.name[0]}
                    </div>
                    
                    <h4 className="text-xs font-black tracking-tight text-natural-text mt-2 line-clamp-1">{pulled.card.name}</h4>
                    <span className="text-[9px] font-black text-natural-primary uppercase mt-0.5 tracking-wider">{charInfo?.name}</span>
                  </div>

                  {/* Card specific parameters */}
                  <div className="mt-4 text-center">
                    {/* Stars Rarity tracker */}
                    <div className="flex justify-center gap-0.5 mb-1.5">
                      {starsArr.map((_, i) => (
                        <Star key={i} size={8} className="text-[#E9C46A] fill-[#E9C46A]" />
                      ))}
                    </div>

                    <div className="text-[10px] font-sans text-natural-text/60 line-clamp-1 italic mb-1 border-t border-natural-border/20 pt-1.5">
                      Style: {pulled.card.artStyle}
                    </div>
                    <span className="text-[9px] font-mono font-black text-natural-teal uppercase tracking-tight">Boost: +{Math.round((pulled.card.bonusMultiplier - 1) * 100)}% SCORE</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed highlighted card showcase for spectacular feel if any 5-star was pulled! */}
          {pulledItems.some(item => item.card.rarity === 5) && (
            <div className="w-full max-w-md bg-[#FDFCF0] border-y-4 border-natural-border p-4.5 rounded-[24px] text-center my-4 animate-bounce shrink-0 shadow-sm" id="summon_spectacular_showcase">
              <span className="text-[9px] font-mono font-black text-[#E9C46A] uppercase tracking-widest block mb-1">Wow! Hoki Tinggi!</span>
              <p className="text-xs text-natural-text font-black italic">“{pulledItems.find(item => item.card.rarity === 5)?.card.unlockedQuote}”</p>
            </div>
          )}

          {/* Close summon overlay plate */}
          <button 
            onClick={closeResults}
            className="w-full max-w-xs py-3.5 rounded-full bg-natural-primary hover:bg-natural-orange text-white font-black text-xs transition-all tracking-wide shadow-md border-b-4 border-natural-primary-dark active:border-b-0 active:translate-y-1 cursor-pointer block my-6"
            id="gacha_close_results_btn"
          >
            Selesai & Tutup Portal
          </button>
        </div>
      )}
    </div>
  );
}
