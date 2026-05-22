import React, { useState } from 'react';
import { Card, PlayerStats } from '../types';
import { CARDS_DATABASE, CHARACTERS } from '../data/characters';
import { audio } from '../utils/audio';
import { ArrowLeft, Star, ArrowUp, CheckCircle, ShieldAlert, Sparkles, User, RefreshCw, Zap } from 'lucide-react';

interface AlbumViewProps {
  playerStats: PlayerStats;
  onSelectFrontman: (cardId: string) => void;
  onUpgradeMultiplier: (cardId: string, costStarDust: number) => void;
  onBack: () => void;
}

export default function AlbumView({ playerStats, onSelectFrontman, onUpgradeMultiplier, onBack }: AlbumViewProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(playerStats.activeFrontmanId || null);
  const [activeTab, setActiveTab] = useState<'semua' | 'dimiliki' | 'belum_dimiliki'>('semua');

  // Load upgraded multiplier metrics from local stats if any
  // But since props are controlled, we can read multiplier boosts dynamically or calculate upgrade cost
  const handleSelectFrontmanCard = (cardId: string) => {
    onSelectFrontman(cardId);
    setSelectedCardId(cardId);
    audio.playChopClick();
  };

  const handleUpgradeCard = (card: Card) => {
    const upgradeCost = card.rarity * 150; // Star dust cost scale
    if (playerStats.starDust < upgradeCost) {
      alert(`Star Dust tidak mencukupi! Kamu butuh ${upgradeCost} Star Dust untuk meng-upgrade kartu ini. Dapatkan dari kisah persahabatan atau penarikan gacha duplikat.`);
      return;
    }

    onUpgradeMultiplier(card.id, upgradeCost);
    audio.playSuccessCelebration();
    alert(`Sukses! Kartu "${card.name}" telah di-upgrade. Bonus multiplier panggung melonjak!`);
  };

  // Filter lists
  const filteredCards = CARDS_DATABASE.filter(card => {
    const isOwned = playerStats.unlockedCardIds.includes(card.id);
    if (activeTab === 'dimiliki') return isOwned;
    if (activeTab === 'belum_dimiliki') return !isOwned;
    return true; // semua
  });

  return (
    <div className="relative w-full min-h-screen bg-natural-bg text-natural-text flex flex-col p-4 overflow-hidden select-none" id="album_stage">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-natural-orange/5 blur-3xl pointer-events-none"></div>

      {/* TOP HEADER CONTROLS */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6" id="album_header">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={onBack}
            className="p-3 rounded-full bg-white hover:bg-natural-card text-natural-text border-2 border-natural-border flex items-center justify-center cursor-pointer shadow-md transition-colors active:translate-y-0.5"
            id="album_back_btn"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-natural-text flex items-center gap-1.5">Koleksi Album Karakter</h2>
            <p className="text-xs text-natural-text/60 font-sans">Kelola kartu panggung musik ajaib kamu dan tingkatkan skor konser!</p>
          </div>
        </div>

        {/* Resources indicator */}
        <div className="flex items-center gap-4 bg-white border-4 border-natural-border py-2 px-5 rounded-full shadow-md w-fit">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-natural-primary uppercase tracking-wider">STAR DUST KAMI</span>
            <span className="font-mono text-sm font-black text-natural-text">✨ {playerStats.starDust}</span>
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex border-b border-natural-border/35 gap-6 mb-6 pb-1" id="filter_tabs">
        <button 
          onClick={() => { setActiveTab('semua'); audio.playChopClick(); }}
          className={`pb-2.5 text-xs font-sans transition-all relative cursor-pointer ${activeTab === 'semua' ? 'text-natural-primary border-b-4 border-natural-primary font-black' : 'text-natural-text/65 hover:text-natural-primary font-bold'}`}
        >
          Semua Kartu ({CARDS_DATABASE.length})
        </button>
        <button 
          onClick={() => { setActiveTab('dimiliki'); audio.playChopClick(); }}
          className={`pb-2.5 text-xs font-sans transition-all relative cursor-pointer ${activeTab === 'dimiliki' ? 'text-natural-primary border-b-4 border-natural-primary font-black' : 'text-natural-text/65 hover:text-natural-primary font-bold'}`}
        >
          Sudah Unlocked ({playerStats.unlockedCardIds.length})
        </button>
        <button 
          onClick={() => { setActiveTab('belum_dimiliki'); audio.playChopClick(); }}
          className={`pb-2.5 text-xs font-sans transition-all relative cursor-pointer ${activeTab === 'belum_dimiliki' ? 'text-natural-primary border-b-4 border-natural-primary font-black' : 'text-natural-text/65 hover:text-natural-primary font-bold'}`}
        >
          Belum Dimiliki ({CARDS_DATABASE.length - playerStats.unlockedCardIds.length})
        </button>
      </div>

      {/* MAIN LAYOUT: ALBUM CARD ROSTER GRID */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex-1 h-full mb-4" id="album_grid_layout">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5" id="album_roster_cards">
          {filteredCards.map((card) => {
            const charInfo = CHARACTERS.find(c => c.id === card.characterId) || CHARACTERS[0];
            const isOwned = playerStats.unlockedCardIds.includes(card.id);
            const isActiveFrontman = playerStats.activeFrontmanId === card.id;
            const stars = Array.from({ length: card.rarity });
            
            // Layout styling depending on stats
            const cardBg = isOwned 
              ? card.rarity === 5 
                ? 'bg-white border-4 border-[#E9C46A] shadow-md' 
                : card.rarity === 4 
                  ? 'bg-white border-4 border-natural-orange/60 shadow-md'
                  : 'bg-white border-4 border-natural-border/30 shadow-md'
              : 'bg-white border-2 border-natural-border/20 opacity-60 grayscale shadow-sm';

            return (
              <div 
                key={card.id} 
                className={`rounded-[32px] p-5 flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-lg ${cardBg}`}
                id={`album_card_${card.id}`}
              >
                {/* Active spokesman glow header outline */}
                {isOwned && isActiveFrontman && (
                  <div className="absolute top-3.5 left-3.5 bg-natural-teal text-white text-[9px] font-black px-3 py-1 rounded-full shadow flex items-center gap-1 border border-white">
                    <CheckCircle size={10} /> Ketua Tim
                  </div>
                )}

                {/* Card visual contents */}
                <div>
                  <div className="flex justify-between items-start mb-3 mt-4 h-12">
                    {/* Character Face Badge bubble */}
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-full ${charInfo.avatarColor} border-2 border-white flex items-center justify-center text-xs font-black text-slate-950 shadow`}>
                        {charInfo.name[0]}
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-natural-text line-clamp-1">{card.name}</h3>
                        <span className="text-[9px] font-black text-natural-primary tracking-wide uppercase">{charInfo.nickname}</span>
                      </div>
                    </div>
                  </div>

                  {/* Attributes description list */}
                  <div className="space-y-2 text-xs font-sans text-natural-text mt-2.5 bg-natural-bg p-3.5 rounded-2xl border-2 border-natural-border/30 mb-3">
                    <p className="text-[10px] text-natural-text/60 line-clamp-2 italic leading-relaxed">"{card.unlockedQuote}"</p>
                    <div className="flex justify-between items-center text-[10px] border-t border-natural-border/20 pt-2 font-mono">
                      <span className="text-natural-text/40 font-black">STYLE:</span>
                      <span className="text-natural-teal font-black">{card.artStyle}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-natural-text/40 font-black">ATRIBUT:</span>
                      <span className={`font-black ${charInfo.textColor}`}>{charInfo.faction}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-actions area: Select frontman / upgrade multipliers / draw indicators */}
                <div className="mt-2 text-center" id="card_actions">
                  {/* Rarity Star count */}
                  <div className="flex justify-center gap-1 mb-3">
                    {stars.map((_, i) => (
                      <Star key={i} size={11} className="text-[#E9C46A] fill-[#E9C46A]" />
                    ))}
                  </div>

                  {isOwned ? (
                    <div className="flex gap-2 font-sans" id="album_action_panel">
                      {/* Set Frontman button */}
                      <button 
                        onClick={() => handleSelectFrontmanCard(card.id)}
                        disabled={isActiveFrontman}
                        className={`flex-1 py-1.5 rounded-full text-[10px] font-black tracking-wide transition-all shadow-sm ${isActiveFrontman ? 'bg-natural-bg border border-natural-border/30 text-natural-text/40 cursor-not-allowed' : 'bg-natural-primary hover:bg-natural-orange text-white cursor-pointer active:translate-y-0.5 border-b-2 border-natural-primary-dark hover:brightness-105 hover:scale-[1.02]'}`}
                        id={`select_frontman_${card.id}`}
                      >
                        {isActiveFrontman ? 'Sudah Aktif' : 'Pilih Ketua'}
                      </button>

                      {/* Upgrade Multiplier using Star Dust */}
                      <button 
                        onClick={() => handleUpgradeCard(card)}
                        className="py-1.5 px-3 bg-[#FEF9EF] hover:bg-natural-card text-natural-text rounded-full border-2 border-natural-border text-[10px] font-black flex items-center justify-center gap-1 shadow-sm active:translate-y-0.5 cursor-pointer"
                        title="Upgrade Boost Multiplier"
                        id={`upgrade_boost_${card.id}`}
                      >
                        <Zap size={10} className="text-[#E9C46A] fill-[#E9C46A]" /> +Boost ({card.rarity * 150} ✨)
                      </button>
                    </div>
                  ) : (
                    /* Padlock block indicator for locked cards */
                    <div className="py-2 px-4 rounded-full bg-natural-bg border-2 border-natural-border/60 flex items-center justify-center gap-1.5 text-[10px] font-bold text-natural-text/40">
                      🔒 Terkunci (Dapatkan di Gacha Ajaib)
                    </div>
                  )}

                  {isOwned && (
                    <div className="text-[10px] font-mono font-black text-natural-teal mt-2 tracking-tight uppercase">
                      Bonus Pengganda: +{Math.round((card.bonusMultiplier - 1) * 100)}% Skor
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
