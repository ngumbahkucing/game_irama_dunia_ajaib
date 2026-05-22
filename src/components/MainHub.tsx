import React, { useState } from 'react';
import { Song, Chapter, PlayerStats } from '../types';
import { SONGS } from '../data/songs';
import { CHARACTERS, CARDS_DATABASE } from '../data/characters';
import { STORIES } from '../data/stories';
import { audio } from '../utils/audio';
import { Sparkles, Play, BookOpen, ShoppingBag, FolderHeart, Award, Heart, ShieldCheck, Gamepad2, Volume2, Info, Star } from 'lucide-react';

interface MainHubProps {
  playerStats: PlayerStats;
  onEnterRhythmSong: (song: Song) => void;
  onEnterStoryChapter: (chapter: Chapter) => void;
  onEnterGacha: () => void;
  onEnterAlbum: () => void;
  onResetData: () => void;
}

export default function MainHub({ 
  playerStats, 
  onEnterRhythmSong, 
  onEnterStoryChapter, 
  onEnterGacha, 
  onEnterAlbum,
  onResetData
}: MainHubProps) {
  const [subscreen, setSubscreen] = useState<'lobby' | 'songs_selector' | 'story_selector'>('lobby');
  const [selectedFactionFilter, setSelectedFactionFilter] = useState<'Semua' | 'Ceria' | 'Fantasi' | 'Alam'>('Semua');
  const [activeSpeechQuote, setActiveSpeechQuote] = useState<string | null>(null);

  // Retrieve selected frontman character
  const activeFrontmanCard = CARDS_DATABASE.find(c => c.id === playerStats.activeFrontmanId) || CARDS_DATABASE[0];
  const activeFrontmanInfo = CHARACTERS.find(c => c.id === activeFrontmanCard.characterId) || CHARACTERS[0];

  // Pick a random greetings speech quote
  const triggerRandomGreeting = () => {
    audio.playChopClick();
    const length = activeFrontmanInfo.quotes.length;
    const randomQuote = activeFrontmanInfo.quotes[Math.floor(Math.random() * length)];
    setActiveSpeechQuote(randomQuote);
    setTimeout(() => {
      setActiveSpeechQuote(null);
    }, 5000); // automatic dissolve speech bubble
  };

  // Convert XP to Level
  const calculatedLevel = Math.floor(playerStats.xp / 400) + 1;

  // Render subscreen level selector
  if (subscreen === 'songs_selector') {
    return (
      <div className="relative w-full min-h-screen bg-natural-bg text-natural-text flex flex-col p-4 overflow-hidden" id="songs_stage_pannel">
        {/* Soft warm theme glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-natural-orange/15 blur-3xl pointer-events-none"></div>

        {/* TOP COZY NAV */}
        <div className="relative z-10 w-full max-w-2xl mx-auto flex items-center justify-between mb-6 border-b-4 border-natural-border pb-3" id="song_select_header">
          <div>
            <span className="text-xs font-bold text-natural-primary uppercase tracking-widest flex items-center gap-1 font-mono"><Gamepad2 size={12} /> Konser Musik Di Panggung</span>
            <h2 className="text-2xl font-black tracking-tight text-natural-text mt-0.5">Mulai Panggung Konsermu!</h2>
          </div>
          <button 
            onClick={() => { audio.playChopClick(); setSubscreen('lobby'); }}
            className="py-2.5 px-5 rounded-full bg-white hover:bg-natural-card text-natural-text border-2 border-natural-border active:translate-y-0.5 transition-all text-xs font-black shadow-md flex items-center gap-1.5"
            id="back_lobby_songs_btn"
          >
            Lobby Tampilan
          </button>
        </div>

        {/* SONGS CAROUSEL SELECTOR LIST */}
        <div className="relative z-10 w-full max-w-2xl mx-auto space-y-4" id="song_list_roster">
          {SONGS.map((song) => {
            const highscore = playerStats.highScores[song.id] || 0;
            const maxcombo = playerStats.maxCombos[song.id] || 0;
            
            const difficultyColor = song.difficulty === 'Easy' 
              ? 'bg-natural-teal/10 text-natural-teal border-natural-teal/20' 
              : song.difficulty === 'Normal' 
                ? 'bg-natural-orange/10 text-natural-orange border-natural-bg/30' 
                : 'bg-natural-primary/10 text-natural-primary border-natural-primary/20';

            return (
              <div 
                key={song.id} 
                className="bg-white border-2 border-natural-border rounded-3xl p-5 hover:scale-[1.01] hover:shadow-lg transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden"
                id={`song_bar_${song.id}`}
              >
                {/* Visual grid decor for each song matching natural theme colors */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-natural-primary"></div>

                <div className="flex-1 pl-3">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-sm font-black text-natural-text">{song.title}</span>
                    <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${difficultyColor}`}>
                      {song.difficulty} ★{song.stars}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-natural-text/60">BPM: {song.bpm}</span>
                  </div>
                  <p className="text-xs text-natural-text/85 leading-relaxed font-sans pr-4">{song.description}</p>
                  
                  {/* Highscore indicators */}
                  {highscore > 0 ? (
                    <div className="flex items-center gap-3 mt-3 text-[10px] font-mono font-black text-natural-primary bg-natural-primary/10 py-1.5 px-3 rounded-xl border border-natural-primary/20 w-fit">
                      <span className="flex items-center gap-0.5 text-natural-orange"><Award size={12} /> Highscore: {highscore.toLocaleString('id-ID')}</span>
                      <span>• Combo Max: {maxcombo}x</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-natural-text/50 font-sans italic mt-3">Belum pernah dimainkan</div>
                  )}
                </div>

                <button 
                  onClick={() => { audio.playChopClick(); onEnterRhythmSong(song); }}
                  className="w-full md:w-auto py-3 px-6 rounded-full bg-natural-primary hover:bg-natural-orange text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0 border-b-4 border-natural-primary-dark active:border-b-0 active:translate-y-1"
                  id={`play_song_btn_${song.id}`}
                >
                  <Play size={12} fill="currentColor" /> Mulai Panggung
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render chapters selection story list
  if (subscreen === 'story_selector') {
    return (
      <div className="relative w-full min-h-screen bg-natural-bg text-natural-text flex flex-col p-4 overflow-hidden" id="story_stage_pannel">
        <div className="absolute top-0 left-10 w-64 h-64 rounded-full bg-natural-orange/10 blur-3xl pointer-events-none"></div>

        {/* STORY COZY HEADER */}
        <div className="relative z-10 w-full max-w-2xl mx-auto flex items-center justify-between mb-6 border-b-4 border-natural-border pb-3" id="story_select_header">
          <div>
            <span className="text-xs font-bold text-natural-primary uppercase tracking-widest flex items-center gap-1 font-mono"><BookOpen size={12} /> Kisah Persahabatan</span>
            <h2 className="text-2xl font-black tracking-tight text-natural-text mt-0.5">Cari Kisah Band Ajaib</h2>
          </div>
          <button 
            onClick={() => { audio.playChopClick(); setSubscreen('lobby'); }}
            className="py-2.5 px-5 rounded-full bg-white hover:bg-natural-card text-natural-text border-2 border-natural-border active:translate-y-0.5 transition-all text-xs font-black shadow-md flex items-center gap-1.5"
            id="back_lobby_stories_btn"
          >
            Lobby Tampilan
          </button>
        </div>

        {/* Faction selector tags */}
        <div className="relative z-10 w-full max-w-2xl mx-auto flex gap-4 border-b-2 border-natural-border/40 mb-6 pb-2 text-xs font-black">
          {['Semua', 'Ceria', 'Fantasi', 'Alam'].map((fac) => (
            <button 
              key={fac}
              onClick={() => { audio.playChopClick(); setSelectedFactionFilter(fac as any); }}
              className={`pb-1 px-1 transition-all ${selectedFactionFilter === fac ? 'text-natural-primary border-b-4 border-natural-primary' : 'text-natural-text/60 hover:text-natural-text'}`}
              id={`filter_fac_${fac}`}
            >
              Grup {fac}
            </button>
          ))}
        </div>

        {/* ROSTER CHAPTERS GRID */}
        <div className="relative z-10 w-full max-w-2xl mx-auto space-y-4" id="story_list_roster">
          {STORIES
            .filter(ch => selectedFactionFilter === 'Semua' || ch.faction === selectedFactionFilter)
            .map((chapter) => {
              const isLocked = chapter.unlockCostPoints > 0 && !playerStats.unlockedChapterIds.includes(chapter.id);
              const isCompleted = playerStats.unlockedChapterIds.includes(chapter.id);
              
              const colorText = chapter.faction === 'Ceria' ? 'text-natural-primary' : chapter.faction === 'Fantasi' ? 'text-natural-orange' : 'text-natural-teal';

              return (
                <div 
                  key={chapter.id}
                  className="bg-white border-2 border-natural-border rounded-3xl p-5 hover:scale-[1.01] hover:shadow-lg transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden"
                  id={`chapter_bar_${chapter.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 text-xs">
                      <span className={`font-mono font-black uppercase tracking-tight ${colorText}`}>{chapter.faction} Grup</span>
                      <span className="text-natural-text/50 font-mono">• Episode {chapter.id.split('_').pop()}</span>
                    </div>
                    <h3 className="text-sm font-black text-natural-text">{chapter.title}</h3>
                    <p className="text-xs text-natural-text/80 mt-1 font-sans pr-4">{chapter.summary}</p>
                    
                    {isCompleted && (
                      <div className="text-[10px] font-bold text-natural-teal bg-natural-teal/10 py-1.5 px-3 rounded-xl border border-natural-teal/20 w-fit mt-3">
                        ✓ Kisah Selesai Dibaca
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => { audio.playChopClick(); onEnterStoryChapter(chapter); }}
                    className="w-full md:w-auto py-3 px-6 rounded-full bg-natural-primary hover:bg-natural-orange text-white font-black text-xs transition-all tracking-wide shadow-md flex items-center justify-center gap-1.5 shrink-0 border-b-4 border-natural-primary-dark active:border-b-0 active:translate-y-1"
                    id={`read_story_btn_${chapter.id}`}
                  >
                    Buka Lembaran Cerita
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    );
  }

  // --- STANDARD MAIN LOBBY HUB ---
  return (
    <div className="relative w-full min-h-screen bg-natural-bg text-natural-text flex flex-col justify-between p-4 overflow-hidden select-none" id="lobby_stage">
      {/* Background ambient natural light points */}
      <div className="absolute top-20 left-10 w-48 h-48 rounded-full bg-natural-orange/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-56 h-56 rounded-full bg-natural-accent/15 blur-3xl pointer-events-none"></div>

      {/* TOP USER STATE BAR PANEL */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-4 border-natural-border p-5 rounded-[32px] shadow-lg" id="user_stats_hud">
        {/* Level and basic progress bar */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-natural-primary to-natural-orange text-white flex flex-col items-center justify-center shadow-md font-mono border-2 border-white">
            <span className="text-[7.5px] font-black uppercase tracking-widest leading-none">LEVEL</span>
            <span className="text-xl font-black leading-none mt-0.5">{calculatedLevel}</span>
          </div>
          <div>
            <div className="text-sm font-black text-natural-text">Musisi Cilik Handal</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-28 bg-natural-bg h-3 rounded-full overflow-hidden border border-natural-border/50">
                <div className="h-full bg-natural-primary rounded-full" style={{ width: `${Math.min(100, (playerStats.xp % 400) / 4)}%` }}></div>
              </div>
              <span className="text-[9.5px] font-mono font-black text-natural-text/60">{playerStats.xp % 400}/400 XP</span>
            </div>
          </div>
        </div>

        {/* Gems and Star Dust balances */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-natural-accent/15 py-1.5 px-4 rounded-full border-2 border-natural-accent flex items-center gap-1.5 shadow-sm">
            <span className="text-[10px] font-black text-blue-700 tracking-wider">GEM PERMATA</span>
            <span className="font-mono text-xs font-black text-blue-800">💎  {playerStats.magicGems}</span>
          </div>

          <div className="bg-natural-orange/15 py-1.5 px-4 rounded-full border-2 border-natural-border flex items-center gap-1.5 shadow-sm">
            <span className="text-[10px] font-black text-natural-primary tracking-wider">STAR DUST</span>
            <span className="font-mono text-xs font-black text-natural-text">✨  {playerStats.starDust}</span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE SPOKESMAN CHATTER HERO */}
      <div className="relative z-10 flex-1 w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 py-6" id="frontman_hero_segment">
        {/* Left Side: Dynamic Greeting bubble speech */}
        <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start" id="speech_bubble">
          {/* Main big chat bubble */}
          <div className="relative bg-white text-natural-text rounded-[28px] p-5 max-w-sm border-4 border-natural-border shadow-xl tracking-wide leading-relaxed mb-6">
            {/* Dialogue tiny arrow */}
            <div className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 md:-bottom-[11px] md:left-14 w-4 h-4 bg-white border-r-4 border-b-4 border-natural-border rotate-45 transform"></div>
            
            <p className="text-xs font-semibold italic">
              {activeSpeechQuote ? activeSpeechQuote : `“Halo kawan! Aku ${activeFrontmanInfo.name}. Selamat datang di panggung Irama Dunia Ajaib! Sentuh badanku, ayo kita tampil bersama!”`}
            </p>
          </div>

          {/* Sizing indicators */}
          <span className="text-[10px] uppercase font-mono font-black text-natural-primary tracking-widest bg-natural-primary/10 px-3 py-1 rounded-full">Ketua Panggung Musik Saat Ini</span>
          <h2 className="text-3xl font-black tracking-tight text-natural-text mt-2">{activeFrontmanCard.name}</h2>
          <span className="text-xs text-natural-text/60 mt-1 italic font-semibold capitalize">Style: {activeFrontmanCard.artStyle} • {activeFrontmanInfo.nickname}</span>
        </div>

        {/* Right Side: Tactile Character Avatar Frame in Natural Tones design */}
        <div 
          onClick={triggerRandomGreeting}
          className="relative w-48 h-48 rounded-full flex items-center justify-center p-3 cursor-pointer transition-all hover:scale-105 active:scale-95 bg-white border-4 border-natural-border shadow-2xl animate-spin-slow duration-8000"
          id="spokesman_avatar_trigger"
          title="Klik saya untuk mengobrol!"
        >
          {/* Inside clean container */}
          <div className="w-full h-full rounded-full bg-natural-accent flex flex-col items-center justify-center text-center p-3 border-4 border-white relative overflow-hidden shadow-inner">
            <span className="text-5xl animate-bounce mb-1">⭐</span>
            <div className="text-sm font-black text-natural-text uppercase leading-none mt-1">{activeFrontmanInfo.name}</div>
            <p className="text-[8px] font-mono text-natural-text/65 mt-1 font-bold uppercase tracking-wider">Sentuh Aku!</p>
          </div>
        </div>
      </div>

      {/* CORE HUB BUTTON PANEL (4 rounded routes styled with Natural Tones) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" id="gamelink_cards">
        {/* Mulai Konser (Rhythm level selector) */}
        <button 
          onClick={() => { audio.playChopClick(); setSubscreen('songs_selector'); }}
          className="bg-natural-primary hover:bg-natural-orange border-b-8 border-natural-primary-dark active:border-b-0 hover:translate-y-1 text-white rounded-[32px] p-6 text-center transition-all shadow-xl flex flex-col items-center gap-2.5 flex-1 cursor-pointer"
          id="btn_play_selector"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-xl border-2 border-white/40">
            🎵
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-white/80 uppercase tracking-widest block">Rhythm Game</span>
            <span className="text-xs font-black">Mulai Konser</span>
          </div>
        </button>

        {/* Kisah Persahabatan (Visual Novel) */}
        <button 
          onClick={() => { audio.playChopClick(); setSubscreen('story_selector'); }}
          className="bg-white hover:bg-natural-card border-4 border-natural-border text-natural-text rounded-[32px] p-6 text-center transition-all hover:-translate-y-1 shadow-md flex flex-col items-center gap-2.5 flex-1 cursor-pointer"
          id="btn_stories_selector"
        >
          <div className="w-12 h-12 rounded-full bg-natural-teal/15 flex items-center justify-center text-natural-teal text-xl border border-natural-teal/20">
            📖
          </div>
          <div>
            <span className="text-[10px] font-mono font-black text-natural-text/50 uppercase tracking-widest block">Visual Novel</span>
            <span className="text-xs font-black">Kisah Persahabatan</span>
          </div>
        </button>

        {/* Gacha Ajaib (Summon Gate) */}
        <button 
          onClick={() => { audio.playChopClick(); onEnterGacha(); }}
          className="bg-white hover:bg-natural-card border-4 border-natural-border text-natural-text rounded-[32px] p-6 text-center transition-all hover:-translate-y-1 shadow-md flex flex-col items-center gap-2.5 flex-1 cursor-pointer"
          id="btn_gacha_center"
        >
          <div className="w-12 h-12 rounded-full bg-natural-orange/15 flex items-center justify-center text-natural-primary text-xl border border-natural-primary/20">
            🌌
          </div>
          <div>
            <span className="text-[10px] font-mono font-black text-natural-text/50 uppercase tracking-widest block">Card Summon</span>
            <span className="text-xs font-black">Gacha Ajaib</span>
          </div>
        </button>

        {/* Koleksi Kartu (Album) */}
        <button 
          onClick={() => { audio.playChopClick(); onEnterAlbum(); }}
          className="bg-white hover:bg-natural-card border-4 border-natural-border text-natural-text rounded-[32px] p-6 text-center transition-all hover:-translate-y-1 shadow-md flex flex-col items-center gap-2.5 flex-1 cursor-pointer"
          id="btn_album_view"
        >
          <div className="w-12 h-12 rounded-full bg-natural-accent/15 flex items-center justify-center text-blue-700 text-xl border border-natural-accent/20">
            🗂️
          </div>
          <div>
            <span className="text-[10px] font-mono font-black text-natural-text/50 uppercase tracking-widest block">Koleksi Kami</span>
            <span className="text-xs font-black">Album Kartu</span>
          </div>
        </button>
      </div>

      {/* DEV RESET DATA ACTION FOR CHILDREN TESTING */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between py-2 border-t-2 border-natural-border/45 text-[10px] font-bold text-natural-text/55" id="reset_bar">
        <span>Irama Dunia Ajaib • Natural Panggung Emas 2026</span>
        <button 
          onClick={() => {
            if (confirm('Ulangi permainan dari awal? Semua gems dan kartu akan diset kembali.')) {
              onResetData();
              audio.playChopClick();
            }
          }}
          className="text-natural-primary hover:text-natural-orange underline cursor-pointer font-black"
          id="reset_data_btn"
        >
          Reset Data Progres
        </button>
      </div>
    </div>
  );
}
