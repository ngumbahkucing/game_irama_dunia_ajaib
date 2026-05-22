import React, { useState, useEffect } from 'react';
import { Song, Chapter, PlayerStats, Card } from './types';
import MainHub from './components/MainHub';
import RhythmGame from './components/RhythmGame';
import VisualNovel from './components/VisualNovel';
import GachaCenter from './components/GachaCenter';
import AlbumView from './components/AlbumView';
import { CARDS_DATABASE } from './data/characters';
import { Sparkles, Star, VolumeX, Music } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'irama_dunia_ajaib_player_progres';

const DEFAULT_PLAYER_STATS: PlayerStats = {
  level: 1,
  xp: 0,
  magicGems: 500, // Enough for multiple single pulls, rewards saving for a 10x!
  starDust: 150,
  unlockedCardIds: ['card_lily_3s'], // Starts with Lily 3-star
  unlockedChapterIds: ['ch_ceria_1', 'ch_fantasi_1', 'ch_alam_1'], // Initial chapters unlocked
  highScores: {},
  maxCombos: {},
  activeFrontmanId: 'card_lily_3s',
  cardUpgrades: {}
};

export default function App() {
  const [playerStats, setPlayerStats] = useState<PlayerStats>(DEFAULT_PLAYER_STATS);
  const [currentScreen, setCurrentScreen] = useState<'hub' | 'rhythm_game' | 'story_reader' | 'gacha' | 'album'>('hub');
  
  // Selection carriers
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  // Load from local storage upon initial boot
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Ensure backward compatibility of parameters
        const alignedStatsObj: PlayerStats = {
          ...DEFAULT_PLAYER_STATS,
          ...parsed,
          highScores: parsed.highScores || {},
          maxCombos: parsed.maxCombos || {},
          unlockedCardIds: parsed.unlockedCardIds || ['card_lily_3s'],
          unlockedChapterIds: parsed.unlockedChapterIds || ['ch_ceria_1', 'ch_fantasi_1', 'ch_alam_1'],
          cardUpgrades: parsed.cardUpgrades || {}
        };
        setPlayerStats(alignedStatsObj);
      }
    } catch (e) {
      console.warn('LocalStorage load failed, using default stats:', e);
    }
  }, []);

  // Save to local storage helper
  const saveStats = (updated: PlayerStats) => {
    setPlayerStats(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  };

  // --- REWARD MECHANICS FOR PLAYING RHYTHM SONGS ---
  const handleFinishRhythmSong = (
    score: number, 
    maxCombo: number, 
    perfects: number, 
    greats: number, 
    misses: number
  ) => {
    if (!selectedSong) return;

    // Check actual card multiplier upgrades
    const frontmanCard = CARDS_DATABASE.find(c => c.id === playerStats.activeFrontmanId) || CARDS_DATABASE[0];
    const currentCardUpgradeRank = playerStats.cardUpgrades[frontmanCard.id] || 0;
    
    // Each upgrade rank increases the multiplier by +5% (e.g. 1.1 + 0.05 * lvl)
    const activeMultiplier = frontmanCard.bonusMultiplier + (currentCardUpgradeRank * 0.05);
    const boostedScore = Math.round(score * activeMultiplier);

    // Calculate level metrics based on boosted score
    const earnedXp = Math.round(boostedScore / 5);
    const earnedGems = Math.round(boostedScore / 80);

    const oldHighScore = playerStats.highScores[selectedSong.id] || 0;
    const oldMaxCombo = playerStats.maxCombos[selectedSong.id] || 0;

    const newHighScore = Math.max(oldHighScore, boostedScore);
    const newMaxCombo = Math.max(oldMaxCombo, maxCombo);

    const updatedStats: PlayerStats = {
      ...playerStats,
      xp: playerStats.xp + earnedXp,
      magicGems: playerStats.magicGems + earnedGems,
      highScores: {
        ...playerStats.highScores,
        [selectedSong.id]: newHighScore
      },
      maxCombos: {
        ...playerStats.maxCombos,
        [selectedSong.id]: newMaxCombo
      }
    };

    // Calculate level-up rewards (+150 Gems bonus!)
    const currentLevel = Math.floor(playerStats.xp / 400) + 1;
    const newLevel = Math.floor(updatedStats.xp / 400) + 1;
    
    if (newLevel > currentLevel) {
      updatedStats.level = newLevel;
      updatedStats.magicGems += 150; // Level up reward!
      setTimeout(() => {
        alert(`🌟 HEBAT! Level Musisi kamu naik menjadi Level ${newLevel}! Memperoleh bonus +150 Permata Ajaib! 🌟`);
      }, 500);
    }

    saveStats(updatedStats);
    setCurrentScreen('hub');
    setSelectedSong(null);
  };

  // --- REWARD MECHANICS FOR FINISHING STORIES ---
  const handleFinishStoryChapter = (chapterId: string) => {
    const isFirstTime = !playerStats.unlockedChapterIds.includes(chapterId);
    
    const updatedStats: PlayerStats = {
      ...playerStats,
      unlockedChapterIds: isFirstTime 
        ? [...playerStats.unlockedChapterIds, chapterId] 
        : playerStats.unlockedChapterIds,
      // Award story clear bonuses (100 starDust, 50 gems)
      starDust: playerStats.starDust + 100,
      magicGems: playerStats.magicGems + 50
    };

    saveStats(updatedStats);
    setCurrentScreen('hub');
    setSelectedChapter(null);
  };

  // --- GACHA CARD SUMMON DISPATCH ---
  const handlePullGacha = (pulledCards: Card[], totalCostGems: number) => {
    let gainedStarDust = 0;
    const freshlyUnlockedIds = [...playerStats.unlockedCardIds];

    pulledCards.forEach((c) => {
      if (freshlyUnlockedIds.includes(c.id)) {
        // Player already owned card, convert into star dust
        gainedStarDust += 100; // Large recycler value
      } else {
        freshlyUnlockedIds.push(c.id);
      }
    });

    const updatedStats: PlayerStats = {
      ...playerStats,
      magicGems: Math.max(0, playerStats.magicGems - totalCostGems),
      unlockedCardIds: freshlyUnlockedIds,
      starDust: playerStats.starDust + gainedStarDust
    };

    saveStats(updatedStats);
  };

  // --- SET ACTIVE FRONTMAN ---
  const handleSelectFrontman = (cardId: string) => {
    const updatedStats: PlayerStats = {
      ...playerStats,
      activeFrontmanId: cardId
    };
    saveStats(updatedStats);
  };

  // --- UPGRADE CARD MULTIPLIER RANK ---
  const handleUpgradeMultiplier = (cardId: string, costStarDust: number) => {
    const currentRank = playerStats.cardUpgrades[cardId] || 0;
    const updatedStats: PlayerStats = {
      ...playerStats,
      starDust: Math.max(0, playerStats.starDust - costStarDust),
      cardUpgrades: {
        ...playerStats.cardUpgrades,
        [cardId]: currentRank + 1
      }
    };
    saveStats(updatedStats);
  };

  // Reset Progres
  const handleResetData = () => {
    saveStats(DEFAULT_PLAYER_STATS);
    setCurrentScreen('hub');
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] font-sans selection:bg-natural-primary/30 overflow-x-hidden antialiased" id="main_root">
      {/* Route Switchers */}
      {currentScreen === 'hub' && (
        <MainHub 
          playerStats={playerStats}
          onEnterRhythmSong={(song) => {
            setSelectedSong(song);
            setCurrentScreen('rhythm_game');
          }}
          onEnterStoryChapter={(chapter) => {
            setSelectedChapter(chapter);
            setCurrentScreen('story_reader');
          }}
          onEnterGacha={() => setCurrentScreen('gacha')}
          onEnterAlbum={() => setCurrentScreen('album')}
          onResetData={handleResetData}
        />
      )}

      {currentScreen === 'rhythm_game' && selectedSong && (
        <RhythmGame 
          song={selectedSong}
          playerStats={playerStats}
          onFinish={handleFinishRhythmSong}
          onBack={() => {
            setSelectedSong(null);
            setCurrentScreen('hub');
          }}
        />
      )}

      {currentScreen === 'story_reader' && selectedChapter && (
        <VisualNovel 
          chapter={selectedChapter}
          playerStats={playerStats}
          onFinishChapter={handleFinishStoryChapter}
          onBack={() => {
            setSelectedChapter(null);
            setCurrentScreen('hub');
          }}
        />
      )}

      {currentScreen === 'gacha' && (
        <GachaCenter 
          playerStats={playerStats}
          onPull={handlePullGacha}
          onBack={() => setCurrentScreen('hub')}
        />
      )}

      {currentScreen === 'album' && (
        <AlbumView 
          playerStats={playerStats}
          onSelectFrontman={handleSelectFrontman}
          onUpgradeMultiplier={handleUpgradeMultiplier}
          onBack={() => setCurrentScreen('hub')}
        />
      )}
    </div>
  );
}
