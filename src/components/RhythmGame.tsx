import React, { useState, useEffect, useRef } from 'react';
import { Song, ChartNote, PlayerStats } from '../types';
import { audio } from '../utils/audio';
import { CHARACTERS } from '../data/characters';
import { Sparkles, Trophy, Music, RotateCcw, Volume2, Key, Star, ShieldCheck, Heart } from 'lucide-react';

interface RhythmGameProps {
  song: Song;
  playerStats: PlayerStats;
  onFinish: (score: number, maxCombo: number, perfects: number, greats: number, misses: number) => void;
  onBack: () => void;
}

export default function RhythmGame({ song, playerStats, onFinish, onBack }: RhythmGameProps) {
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'paused' | 'failed' | 'finished'>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [health, setHealth] = useState(100);
  
  // Rating counts
  const [perfectCount, setPerfectCount] = useState(0);
  const [greatCount, setGreatCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [currentRating, setCurrentRating] = useState<{ text: string; color: string; id: number } | null>(null);

  // Lanes pressed status for lighting
  const [lanesActive, setLanesActive] = useState<boolean[]>([false, false, false, false]);
  
  const [noteStateList, setNoteStateList] = useState<ChartNote[]>([]);
  const [muted, setMuted] = useState(false);

  // Time reference
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const notesRef = useRef<ChartNote[]>([]);
  const scoreRef = useRef<number>(0);
  const comboRef = useRef<number>(0);
  const healthRef = useRef<number>(100);

  // Beat flash indicator
  const [beatPulse, setBeatPulse] = useState(false);

  // Config constants
  const hitLineY = 85; // Target line is at Y = 85%
  const approachTimeMs = 1600; // Time in ms for a note to fall from top to target
  const perfectThreshold = 55; // ms
  const greatThreshold = 120; // ms
  const missThreshold = 180; // ms

  // Sync references
  useEffect(() => {
    // Clone notes with fresh states
    const clonedNotes = song.notes.map(n => ({ ...n, hitRating: null }));
    setNoteStateList(clonedNotes);
    notesRef.current = clonedNotes;
    scoreRef.current = 0;
    comboRef.current = 0;
    healthRef.current = 100;
  }, [song]);

  // Handle countdown
  useEffect(() => {
    if (gameState === 'countdown') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            startGameplay();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  const startGameplay = () => {
    setGameState('playing');
    startTimeRef.current = Date.now();
    
    // Start Web Audio Synth music loop
    audio.startBackgroundMusicLoop(song.bpm, song.primaryToneHz, (beatIndex) => {
      // Trigger visual beat pulse on downbeats
      if (beatIndex % 2 === 0) {
        setBeatPulse(true);
        setTimeout(() => setBeatPulse(false), 120);
      }
    });

    // Run animation frames
    tick();
  };

  // Main high-precision animation loop
  const tick = () => {
    if (healthRef.current <= 0) {
      handleFail();
      return;
    }

    const elapsed = Date.now() - startTimeRef.current;
    
    // Check if the song has naturally completed with some margin
    const songTotalDurationMs = song.durationSeconds * 1000;
    if (elapsed >= songTotalDurationMs + 1000) {
      handleComplete();
      return;
    }

    // Auto-miss expired notes in reference
    let updatedNeeded = false;
    const currentNotes = [...notesRef.current];

    for (let i = 0; i < currentNotes.length; i++) {
      const note = currentNotes[i];
      if (!note.hitRating) {
        // If note passed hit threshold and has not been rated
        const timeDiff = elapsed - note.timeMs;
        if (timeDiff > missThreshold) {
          note.hitRating = 'MISS';
          setMissCount(prev => prev + 1);
          setCombo(0);
          comboRef.current = 0;
          
          setHealth(prev => {
            const h = Math.max(0, prev - 10);
            healthRef.current = h;
            return h;
          });
          
          triggerRatingFeedback('LEWAT', 'text-rose-500 font-bold tracking-widest scale-125');
          updatedNeeded = true;
        }
      }
    }

    if (updatedNeeded) {
      setNoteStateList(currentNotes);
      notesRef.current = currentNotes;
    }

    // Force React re-render of active falling notes
    if (gameState === 'playing') {
      animationFrameRef.current = requestAnimationFrame(tick);
    }
  };

  const handleFail = () => {
    cancelAnimationFrame(animationFrameRef.current);
    audio.stopBackgroundMusicLoop();
    setGameState('failed');
  };

  const handleComplete = () => {
    cancelAnimationFrame(animationFrameRef.current);
    audio.stopBackgroundMusicLoop();
    audio.playSuccessCelebration();
    setGameState('finished');
  };

  const triggerRatingFeedback = (rating: string, colorClass: string) => {
    setCurrentRating({
      text: rating,
      color: colorClass,
      id: Date.now()
    });
  };

  // Input Tapping Mechanics
  const handleLaneTap = (laneIdx: number) => {
    if (gameState !== 'playing') return;

    // Pulse lane visual active state
    setLanesActive(prev => {
      const copy = [...prev];
      copy[laneIdx] = true;
      return copy;
    });
    setTimeout(() => {
      setLanesActive(prev => {
        const copy = [...prev];
        copy[laneIdx] = false;
        return copy;
      });
    }, 100);

    const elapsed = Date.now() - startTimeRef.current;
    
    // Find nearest unhit note in the same lane
    const activeNotes = notesRef.current;
    let nearestNote: ChartNote | null = null;
    let smallestTimeDistance = Infinity;

    for (let i = 0; i < activeNotes.length; i++) {
      const n = activeNotes[i];
      if (n.lane === laneIdx && n.hitRating === null) {
        const distance = Math.abs(elapsed - n.timeMs);
        if (distance < smallestTimeDistance && distance < missThreshold) {
          smallestTimeDistance = distance;
          nearestNote = n;
        }
      }
    }

    if (nearestNote) {
      // Evaluate hit accuracy!
      const distance = smallestTimeDistance;
      let rating: 'PERFECT' | 'GREAT' | 'MISS' = 'MISS';
      
      if (distance <= perfectThreshold) {
        rating = 'PERFECT';
      } else if (distance <= greatThreshold) {
        rating = 'GREAT';
      }

      // Mark note as hit
      nearestNote.hitRating = rating;
      
      // Hit sound indicators
      if (nearestNote.type === 'flick') {
        audio.playFlick();
      } else {
        audio.playTap();
      }

      // Calculations and Scores
      if (rating === 'PERFECT') {
        setPerfectCount(prev => prev + 1);
        const earned = Math.round(150 * (1 + comboRef.current * 0.02));
        setScore(prev => {
          const s = prev + earned;
          scoreRef.current = s;
          return s;
        });
        setCombo(prev => {
          const c = prev + 1;
          comboRef.current = c;
          if (c > maxCombo) setMaxCombo(c);
          return c;
        });
        setHealth(prev => {
          const h = Math.min(100, prev + 3);
          healthRef.current = h;
          return h;
        });
        triggerRatingFeedback('SEMPURNA!', 'text-yellow-400 font-extrabold text-2xl drop-shadow-lg scale-110');
      } else if (rating === 'GREAT') {
        setGreatCount(prev => prev + 1);
        const earned = Math.round(100 * (1 + comboRef.current * 0.01));
        setScore(prev => {
          const s = prev + earned;
          scoreRef.current = s;
          return s;
        });
        setCombo(prev => {
          const c = prev + 1;
          comboRef.current = c;
          if (c > maxCombo) setMaxCombo(c);
          return c;
        });
        setHealth(prev => {
          const h = Math.min(100, prev + 1);
          healthRef.current = h;
          return h;
        });
        triggerRatingFeedback('HEBAT!', 'text-emerald-400 font-bold text-xl drop-shadow');
      }

      // Trigger standard React trigger list update
      setNoteStateList([...activeNotes]);
      notesRef.current = activeNotes;
    } else {
      // Tapped empty lane - quiet synth tick
      audio.playChopClick();
    }
  };

  // Hook keyboard listener (S, D, K, L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'paused' || gameState === 'failed' || gameState === 'finished') return;
      
      const key = e.key.toLowerCase();
      if (key === 's') handleLaneTap(0);
      else if (key === 'd') handleLaneTap(1);
      else if (key === 'k') handleLaneTap(2);
      else if (key === 'l') handleLaneTap(3);
      else if (e.key === 'Escape' && gameState === 'playing') {
        pauseGameplay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, noteStateList]);

  // Handle Pause controls
  const pauseGameplay = () => {
    audio.stopBackgroundMusicLoop();
    cancelAnimationFrame(animationFrameRef.current);
    setGameState('paused');
  };

  const resumeGameplay = () => {
    setGameState('playing');
    startTimeRef.current = Date.now() - (Date.now() - startTimeRef.current); // offset time
    audio.startBackgroundMusicLoop(song.bpm, song.primaryToneHz, (beatIndex) => {
      if (beatIndex % 2 === 0) {
        setBeatPulse(true);
        setTimeout(() => setBeatPulse(false), 120);
      }
    });
    tick();
  };

  const restartSong = () => {
    cancelAnimationFrame(animationFrameRef.current);
    audio.stopBackgroundMusicLoop();
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHealth(100);
    setPerfectCount(0);
    setGreatCount(0);
    setMissCount(0);
    setCurrentRating(null);
    healthRef.current = 100;
    scoreRef.current = 0;
    comboRef.current = 0;
    
    const freshNotes = song.notes.map(n => ({ ...n, hitRating: null }));
    notesRef.current = freshNotes;
    setNoteStateList(freshNotes);
    
    setCountdown(3);
    setGameState('countdown');
  };

  // Clean elements on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      audio.stopBackgroundMusicLoop();
    };
  }, []);

  // Compute falling notes' position inside SVG
  const elapsed = gameState === 'playing' ? (Date.now() - startTimeRef.current) : 0;
  
  // Find which active character represents the team frontman
  const frontmanObj = CHARACTERS.find(c => c.id === playerStats.activeFrontmanId) || CHARACTERS[0];

  return (
    <div className="relative w-full min-h-screen bg-natural-bg text-natural-text flex flex-col items-center justify-between p-4 py-6 overflow-hidden select-none" id="stage_board">
      {/* Dynamic Background aura effects */}
      <div className={`absolute inset-0 bg-natural-orange/5 transition-colors duration-200 ${beatPulse ? 'opacity-80' : 'opacity-40'}`}></div>

      {/* TOP HEADER STATUS */}
      <div className="relative z-10 w-full max-w-xl flex items-center justify-between bg-white p-4 rounded-[24px] border-4 border-natural-border shadow-md text-natural-text" id="game_header">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-full ${frontmanObj.avatarColor} border-2 border-white shadow flex items-center justify-center text-xs font-black text-slate-950`}>
            {frontmanObj.name[0]}
          </div>
          <div>
            <div className="font-sans font-black text-sm tracking-tight text-natural-text line-clamp-1">{song.title}</div>
            <div className="text-[10px] font-mono text-natural-primary font-bold uppercase">{song.difficulty} ★{song.stars}</div>
          </div>
        </div>

        {/* Lifebar / Health bar */}
        <div className="mx-4 flex-1 max-w-[150px]">
          <div className="flex items-center justify-between text-[10px] font-mono text-natural-primary font-black mb-1">
            <span className="flex items-center gap-1"><Heart size={10} className="fill-natural-primary stroke-natural-primary" /> Energi</span>
            <span>{health}%</span>
          </div>
          <div className="w-full bg-natural-bg h-2.5 rounded-full overflow-hidden border border-natural-border/30">
            <div 
              className={`h-full transition-all duration-100 ${health > 40 ? 'bg-natural-teal' : 'bg-natural-primary animate-pulse'}`} 
              style={{ width: `${health}%` }}
            ></div>
          </div>
        </div>

        {/* Score & Controls */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[9px] font-mono text-natural-text/60 font-black">SKOR</div>
            <div className="text-sm font-mono font-black text-natural-primary">{score.toLocaleString('id-ID')}</div>
          </div>

          {gameState === 'playing' ? (
            <button 
              onClick={pauseGameplay}
              className="p-2 rounded-xl bg-natural-bg hover:bg-natural-card text-natural-primary border border-natural-border shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Pause Game (Esc)"
              id="pause_btn"
            >
              <Volume2 size={16} />
            </button>
          ) : null}
        </div>
      </div>

      {/* THREE COUNTDOWN SCREEN */}
      {gameState === 'countdown' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-natural-bg/95 backdrop-blur-md" id="countdown_screen">
          <div className="text-center animate-bounce">
            <Star size={72} className="text-[#E9C46A] fill-[#E9C46A] mx-auto mb-4 animate-spin-slow duration-1000" />
            <h2 className="text-3xl font-black tracking-tight text-natural-text">Bersiaplah, Kawan!</h2>
            <p className="text-xs text-natural-text/70 mt-2 mb-6 font-sans">Letakkan jemari pada tombol <span className="text-natural-primary font-mono bg-white px-2 py-0.5 rounded-full border-2 border-natural-border">S</span> <span className="text-natural-primary font-mono bg-white px-2 py-0.5 rounded-full border-2 border-natural-border">D</span> <span className="text-natural-primary font-mono bg-white px-2 py-0.5 rounded-full border-2 border-natural-border">K</span> <span className="text-natural-primary font-mono bg-white px-2 py-0.5 rounded-full border-2 border-natural-border">L</span></p>
            <div className="text-7xl font-mono font-black text-white bg-natural-primary border-4 border-white w-28 h-28 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              {countdown}
            </div>
          </div>
        </div>
      )}

      {/* PAUSE POPUP MODAL */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-natural-bg/95 backdrop-blur-md" id="pause_screen">
          <div className="bg-white border-4 border-natural-border p-8 rounded-[32px] max-w-xs text-center shadow-2xl text-natural-text">
            <Volume2 size={48} className="text-natural-primary mx-auto mb-3" />
            <h3 className="text-xl font-black">Konser Dihentikan</h3>
            <p className="text-xs text-natural-text/60 mt-1 mb-6 font-sans">Musik sedang bersantai sejenak...</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={resumeGameplay}
                className="w-full py-3.5 rounded-full bg-natural-teal hover:bg-natural-darkteal text-white font-black text-xs transition-all shadow-md border-b-4 border-[#1c6e64] active:border-b-0 active:translate-y-1 cursor-pointer"
                id="resume_btn"
              >
                Lanjutkan Konser
              </button>
              <button 
                onClick={restartSong}
                className="w-full py-3 px-5 rounded-full bg-natural-orange hover:bg-natural-primary text-white font-black text-xs transition-all tracking-wide shadow-md border-b-4 border-[#c87635] active:border-b-0 active:translate-y-1 cursor-pointer flex items-center justify-center gap-1.5"
                id="restart_btn"
              >
                <RotateCcw size={14} /> Ulangi Lagu
              </button>
              <button 
                onClick={onBack}
                className="w-full py-3 px-5 rounded-full bg-white hover:bg-natural-card text-natural-primary border-2 border-natural-primary active:translate-y-0.5 transition-all text-xs font-black shadow-md"
                id="exit_btn"
              >
                Keluar ke Lobby
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAIL PAGE */}
      {gameState === 'failed' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-natural-bg/95 backdrop-blur-md px-6" id="fail_screen">
          <div className="text-center max-w-sm text-natural-text">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4 border-2 border-rose-300 shadow-sm animate-bounce">
              <RotateCcw size={32} />
            </div>
            <h2 className="text-2xl font-black text-natural-text">Sedikit Lagi Berhasil!</h2>
            <p className="text-xs text-natural-text/60 mt-2 mb-6 font-sans leading-relaxed">Musik kita terhenti, namun jangan berkecil hati. Setiap kegagalan membuat refleks kita semakin tajam! Mau coba lagi?</p>

            <div className="flex gap-4">
              <button 
                onClick={restartSong}
                className="flex-1 py-3 px-5 rounded-full bg-natural-orange hover:bg-natural-primary text-white font-black text-xs transition-all tracking-wide shadow-md border-b-4 border-[#c87635] active:border-b-0 active:translate-y-1 cursor-pointer flex items-center justify-center gap-1.5"
                id="retry_fail_btn"
              >
                <RotateCcw size={16} /> Coba Lagi
              </button>
              <button 
                onClick={onBack}
                className="flex-1 py-3 px-5 rounded-full bg-white hover:bg-natural-card text-natural-text border-2 border-natural-border active:translate-y-0.5 transition-all text-xs font-black shadow-md cursor-pointer"
                id="back_fail_btn"
              >
                Ke Lobby
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FINISHED PAGE */}
      {gameState === 'finished' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-natural-bg/95 backdrop-blur-md px-6" id="finished_screen">
          <div className="bg-white border-4 border-natural-border p-8 rounded-[32px] max-w-md w-full text-center shadow-2xl relative text-natural-text">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#FEF9EF] rounded-full flex items-center justify-center shadow-md border-4 border-natural-border animate-pulse">
              <Trophy size={44} className="text-[#E9C46A] fill-[#E9C46A]" />
            </div>

            <div className="mt-12 mb-5">
              <span className="text-[10px] font-black tracking-widest bg-natural-teal/10 text-natural-teal px-3.5 py-1.5 rounded-full border border-natural-teal/20">KONSER BERHASIL!</span>
              <h2 className="text-2xl font-black text-natural-text mt-3 leading-tight">{song.title}</h2>
              <p className="text-xs text-natural-text/60 font-sans mt-1">Grup panggung telah menularkan keceriaan!</p>
            </div>

            {/* Score box */}
            <div className="grid grid-cols-2 gap-3 mb-6 bg-natural-bg p-4 rounded-2xl border-2 border-natural-border/30">
              <div className="text-left">
                <span className="text-[10px] font-black text-natural-text/50 uppercase font-sans">Skor Musik</span>
                <p className="text-xl font-mono font-black text-natural-primary">{score.toLocaleString('id-ID')}</p>
              </div>
              <div className="text-right border-l-2 border-natural-border/30 pl-3">
                <span className="text-[10px] font-black text-natural-text/50 uppercase font-sans">Max Combo</span>
                <p className="text-xl font-mono font-black text-natural-teal">{maxCombo}x</p>
              </div>
            </div>

            {/* Stats Breakdown with graphics */}
            <div className="space-y-2 mb-6 text-sm font-sans" id="finished_breakdown">
              <div className="flex justify-between items-center py-1 border-b-2 border-natural-border/20">
                <span className="text-rose-500 font-extrabold flex items-center gap-1.5 text-xs">★ Sempurna (Perfect)</span>
                <span className="font-mono font-black text-natural-text text-sm">{perfectCount}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b-2 border-natural-border/20">
                <span className="text-natural-teal font-extrabold flex items-center gap-1.5 text-xs">● Hebat (Great)</span>
                <span className="font-mono font-black text-natural-text text-sm">{greatCount}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b-2 border-natural-border/20 text-natural-text/40">
                <span className="flex items-center gap-1.5 text-xs">✕ Lewat (Miss)</span>
                <span className="font-mono font-black text-sm">{missCount}</span>
              </div>
            </div>

            {/* Magic gems reward computation */}
            <div className="flex items-center justify-center gap-2 bg-[#FDFCF0] text-natural-text p-3.5 rounded-2xl border-2 border-natural-border/50 text-xs font-bold mb-7">
              <Sparkles size={16} className="text-[#E9C46A] fill-[#E9C46A] animate-spin-slow" />
              <span>Memperoleh <strong className="text-natural-primary">{Math.round(score / 80)} Permata Ajaib</strong> dari konser!</span>
            </div>

            <button 
              onClick={() => onFinish(score, maxCombo, perfectCount, greatCount, missCount)}
              className="w-full py-3.5 rounded-full bg-natural-primary hover:bg-natural-orange text-white font-black text-xs transition-all tracking-wide shadow-md border-b-4 border-natural-primary-dark active:border-b-0 active:translate-y-1 cursor-pointer animate-pulse"
              id="finish_claim_btn"
            >
              Klaim Hadiah & Selesaikan (Kembali ke Lobby)
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE GAME RYTHM BOARD (SVG Falling Notes) */}
      <div className="relative flex-1 w-full max-w-xl bg-gradient-to-b from-[#264653] to-[#2A9D8F] flex flex-col items-center justify-center border-4 border-natural-border my-4 rounded-[32px] overflow-hidden shadow-2xl" id="board_viewport">
        {/* Combo Ticker */}
        {combo > 0 && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none animate-bounce" id="combo_ticker">
            <span className="text-xs uppercase font-mono font-black tracking-widest text-[#A2D2FF]">Combo</span>
            <div className="text-5xl font-mono font-black text-yellow-300 drop-shadow-[0_2px_8px_rgba(234,179,8,0.5)]">{combo}</div>
          </div>
        )}

        {/* Dynamic Judge Feedback Label */}
        {currentRating && (
          <div 
            key={currentRating.id}
            className="absolute top-28 left-1/2 -translate-x-1/2 z-10 animate-ping duration-100 font-sans text-center select-none pointer-events-none"
          >
            <span className={currentRating.color}>{currentRating.text}</span>
          </div>
        )}

        {/* 4 Lanes Board Drawn as precise robust SVG viewport */}
        <svg 
          className="w-full h-full"
          viewBox="0 0 400 600"
          preserveAspectRatio="none"
          id="rhythm_svg_canvas"
        >
          {/* Lane dividers shadows & lines */}
          <line x1="100" y1="0" x2="100" y2="600" stroke="white" strokeWidth="2" strokeDasharray="4 4" opacity="0.15" />
          <line x1="200" y1="0" x2="200" y2="600" stroke="white" strokeWidth="2" strokeDasharray="4 4" opacity="0.15" />
          <line x1="300" y1="0" x2="300" y2="600" stroke="white" strokeWidth="2" strokeDasharray="4 4" opacity="0.15" />

          {/* Lane highlights upon active keyboard presses */}
          {lanesActive.map((active, idx) => active ? (
            <rect 
              key={`h-${idx}`} 
              x={idx * 100} 
              y="0" 
              width="100" 
              height="600" 
              fill={`url(#lane-gradient-${idx})`} 
              opacity="0.25" 
            />
          ) : null)}

          {/* Gradients definitions for lanes interaction Glows */}
          <defs>
            <linearGradient id="lane-gradient-0" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lane-gradient-1" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lane-gradient-2" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lane-gradient-3" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Hit target line marker at Y = 85% (85% of 600 = 510 px) */}
          <line x1="0" y1="510" x2="400" y2="510" stroke="#E9C46A" strokeWidth="4" opacity="0.8" />
          
          {/* Target points circular nodes for visual alignment */}
          <circle cx="50" cy="510" r="24" fill="#1e343b" stroke="#ec4899" strokeWidth="4" opacity="0.9" />
          <circle cx="150" cy="510" r="24" fill="#1e343b" stroke="#f59e0b" strokeWidth="4" opacity="0.9" />
          <circle cx="250" cy="510" r="24" fill="#1e343b" stroke="#06b6d4" strokeWidth="4" opacity="0.9" />
          <circle cx="350" cy="510" r="24" fill="#1e343b" stroke="#10b981" strokeWidth="4" opacity="0.9" />

          {/* Pulsing rings around hitzones during beats */}
          {beatPulse ? (
            <>
              <circle cx="50" cy="510" r="32" fill="none" stroke="#ec4899" strokeWidth="1" opacity="0.4" />
              <circle cx="150" cy="510" r="32" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.4" />
              <circle cx="250" cy="510" r="32" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
              <circle cx="350" cy="510" r="32" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.4" />
            </>
          ) : null}

          {/* FALLING NOTES RENDERING */}
          {gameState === 'playing' && noteStateList.map((note) => {
            if (note.hitRating) return null; // Hit note, do not render

            // Math formula: time to hit is `note.timeMs`.
            // We want it to be at Y = 510 (85%) when elapsed = note.timeMs.
            // Notes spawn from Y = 20 when elapsed = note.timeMs - approachTimeMs.
            const timeDiff = note.timeMs - elapsed;

            // Outside fall screen
            if (timeDiff > approachTimeMs || timeDiff < -missThreshold) return null;

            // Percentage factor from 0 (spawn) to 1 (hit indicator line)
            const progress = (approachTimeMs - timeDiff) / approachTimeMs;
            const currentY = 20 + (510 - 20) * progress;
            const currentX = 50 + note.lane * 100;

            // Tap Note Rendering
            if (note.type === 'tap') {
              const noteColor = note.lane === 0 ? '#ec4899' : note.lane === 1 ? '#f59e0b' : note.lane === 2 ? '#06b6d4' : '#10b981';
              return (
                <g key={note.id}>
                  {/* Glowing aura */}
                  <circle cx={currentX} cy={currentY} r="20" fill={noteColor} opacity="0.3" filter="blur(2px)" />
                  {/* Main circular note body */}
                  <circle cx={currentX} cy={currentY} r="16" fill={`url(#noteGrad-${note.lane})`} stroke="#ffffff" strokeWidth="2.5" />
                  {/* Inner star accent */}
                  <path d={`M ${currentX} ${currentY - 6} L ${currentX + 1.5} ${currentY - 1.5} L ${currentX + 6} ${currentY - 1.5} L ${currentX + 2} ${currentY + 1} L ${currentX + 3.5} ${currentY + 5.5} L ${currentX} ${currentY + 3.2} L ${currentX - 3.5} ${currentY + 5.5} L ${currentX - 2} ${currentY + 1} L ${currentX - 6} ${currentY - 1.5} L ${currentX - 1.5} ${currentY - 1.5} Z`} fill="#ffffff" />
                  
                  {/* Visual gradient assets */}
                  <defs>
                    <radialGradient id={`noteGrad-${note.lane}`}>
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="60%" stopColor={noteColor} />
                      <stop offset="100%" stopColor={noteColor} />
                    </radialGradient>
                  </defs>
                </g>
              );
            }

            // Hold Note Rendering (with tails)
            if (note.type === 'hold' && note.durationMs) {
              const noteColor = '#3b82f6'; // Bright ocean blue for hold
              
              // End point of hold
              const duration = note.durationMs;
              const endTimeMs = note.timeMs + duration;
              const endTimeDiff = endTimeMs - elapsed;
              const endProgress = (approachTimeMs - endTimeDiff) / approachTimeMs;
              const endY = Math.max(20, 20 + (510 - 20) * endProgress);

              // Connector tail thickness
              return (
                <g key={note.id}>
                  {/* Tail Connecting bar */}
                  <rect 
                    x={currentX - 10} 
                    y={Math.min(currentY, endY)} 
                    width="20" 
                    height={Math.max(5, Math.abs(currentY - endY))} 
                    fill={noteColor} 
                    opacity="0.5" 
                    rx="6"
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                  {/* Head/Body start node */}
                  <circle cx={currentX} cy={currentY} r="15" fill={noteColor} stroke="#ffffff" strokeWidth="2" />
                  {/* End node indicator */}
                  <circle cx={currentX} cy={endY} r="12" fill="#1e3a8a" stroke="#ffffff" strokeWidth="1.5" />
                </g>
              );
            }

            // Flick Note Rendering (Yellow Arrow shape)
            if (note.type === 'flick') {
              const noteColor = '#eab308'; // Star yellow
              return (
                <g key={note.id}>
                  {/* Star shape with top pointing arrow */}
                  <circle cx={currentX} cy={currentY} r="18" fill={noteColor} opacity="0.4" />
                  <polygon 
                    points={`${currentX},${currentY - 18} ${currentX + 15},${currentY - 2} ${currentX + 5},${currentY - 2} ${currentX + 5},${currentY + 10} ${currentX - 5},${currentY + 10} ${currentX - 5},${currentY - 2} ${currentX - 15},${currentY - 2}`} 
                    fill="#ffffff" 
                    stroke={noteColor} 
                    strokeWidth="2.5" 
                  />
                  {/* Miniature flick direction chevron above note */}
                  <path d={`M ${currentX - 10} ${currentY - 24} L ${currentX} ${currentY - 32} L ${currentX + 10} ${currentY - 24}`} stroke="#facc15" strokeWidth="3" fill="none" opacity="0.8" />
                </g>
              );
            }

            return null;
          })}
        </svg>

        {/* Ambient Frontman character cheerleader banner at the side */}
        <div className="absolute right-4 bottom-24 pointer-events-none flex items-center gap-2 bg-white/95 py-2 px-3 rounded-2xl border-2 border-natural-border shadow-md" id="cheerleader_panel">
          <div className="relative">
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-natural-teal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-natural-teal"></span>
            </span>
            <div className={`w-8 h-8 rounded-full ${frontmanObj.avatarColor} border-2 border-white flex items-center justify-center text-xs font-black text-slate-950`}>
              {frontmanObj.name[0]}
            </div>
          </div>
          <div>
            <div className="text-[9px] font-black text-natural-text uppercase leading-none">{frontmanObj.name}</div>
            <p className="text-[10px] font-bold text-natural-teal mt-0.5 tracking-tight">Menyemangati! (+{(frontmanObj.id === 'lily' || frontmanObj.id === 'arthur' || frontmanObj.id === 'koko') ? '50%' : '10%'})</p>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROL PADS (For Touchscreen Users & Clues) */}
      <div className="relative z-10 w-full max-w-xl grid grid-cols-4 gap-2.5 bg-white p-3 rounded-[24px] border-4 border-natural-border shadow-lg" id="control_pads">
        <button 
          onMouseDown={() => handleLaneTap(0)}
          onTouchStart={(e) => { e.preventDefault(); handleLaneTap(0); }}
          className="py-3 px-1.5 rounded-2xl border-b-4 border-pink-700 bg-pink-50 hover:bg-pink-100 active:bg-pink-200 text-pink-700 transition-all font-sans text-center flex flex-col items-center justify-center cursor-pointer"
          id="pad_0"
        >
          <span className="text-sm font-black font-sans bg-pink-100 w-8 h-8 flex items-center justify-center rounded-xl border-2 border-pink-300 mb-1">S</span>
          <span className="text-[9px] font-black uppercase tracking-tight text-pink-600">Cherry</span>
        </button>
        <button 
          onMouseDown={() => handleLaneTap(1)}
          onTouchStart={(e) => { e.preventDefault(); handleLaneTap(1); }}
          className="py-3 px-1.5 rounded-2xl border-b-4 border-amber-600 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-700 transition-all font-sans text-center flex flex-col items-center justify-center cursor-pointer"
          id="pad_1"
        >
          <span className="text-sm font-black font-sans bg-amber-100 w-8 h-8 flex items-center justify-center rounded-xl border-2 border-amber-300 mb-1">D</span>
          <span className="text-[9px] font-black uppercase tracking-tight text-amber-600">Honey</span>
        </button>
        <button 
          onMouseDown={() => handleLaneTap(2)}
          onTouchStart={(e) => { e.preventDefault(); handleLaneTap(2); }}
          className="py-3 px-1.5 rounded-2xl border-b-4 border-cyan-600 bg-cyan-50 hover:bg-cyan-100 active:bg-cyan-200 text-cyan-700 transition-all font-sans text-center flex flex-col items-center justify-center cursor-pointer"
          id="pad_2"
        >
          <span className="text-sm font-black font-sans bg-cyan-100 w-8 h-8 flex items-center justify-center rounded-xl border-2 border-cyan-300 mb-1">K</span>
          <span className="text-[9px] font-black uppercase tracking-tight text-cyan-600">Sky</span>
        </button>
        <button 
          onMouseDown={() => handleLaneTap(3)}
          onTouchStart={(e) => { e.preventDefault(); handleLaneTap(3); }}
          className="py-3 px-1.5 rounded-2xl border-b-4 border-emerald-600 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-700 transition-all font-sans text-center flex flex-col items-center justify-center cursor-pointer"
          id="pad_3"
        >
          <span className="text-sm font-black font-sans bg-emerald-100 w-8 h-8 flex items-center justify-center rounded-xl border-2 border-emerald-300 mb-1">L</span>
          <span className="text-[9px] font-black uppercase tracking-tight text-emerald-600">Mint</span>
        </button>
      </div>
    </div>
  );
}
