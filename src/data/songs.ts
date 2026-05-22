import { Song, ChartNote } from '../types';

// Helper to generate a rhythmic note list for a song based on beat division
function generateChart(
  bpm: number, 
  difficulty: 'Easy' | 'Normal' | 'Hard', 
  durationSec: number
): ChartNote[] {
  const notes: ChartNote[] = [];
  const beatMs = (60 / bpm) * 1000;
  const totalMs = durationSec * 1000;
  let idCounter = 0;

  // Easy: Notes mostly on heavy downbeats (beats 0, 2, 4, 6)
  // Normal: Notes on downbeats and upbeats (beats 0, 1, 2, 3, 4, 5, 6, 7)
  // Hard: Multi-lane dense taps, double taps, and frequent flicks
  const stepDividers = difficulty === 'Easy' ? [0, 4] : difficulty === 'Normal' ? [0, 2, 4, 6] : [0, 1, 2, 3, 4, 5, 6, 7];
  
  // Outer loop walking through beats (every bar has 8 half-beat steps)
  let timeMs = 1500; // Let the reader prepare for 1.5 seconds before notes fall
  
  while (timeMs < totalMs - 2000) {
    const isSpecialBeat = Math.random() > 0.65;
    
    if (difficulty === 'Easy') {
      // Very simple downbeat taps
      const lane = Math.floor(Math.random() * 4);
      notes.push({
        id: `easy_note_${idCounter++}`,
        timeMs,
        lane,
        type: Math.random() > 0.85 ? 'hold' : 'tap',
        durationMs: Math.random() > 0.85 ? beatMs * 2 : undefined
      });
      timeMs += beatMs * 2; // Jump 2 full beats
    } else {
      // Normal / Hard
      const randomType = Math.random();
      const lane = Math.floor(Math.random() * 4);
      
      if (randomType < 0.6) {
        // Standard Tap
        notes.push({
          id: `normal_tap_${idCounter++}`,
          timeMs,
          lane,
          type: 'tap'
        });
      } else if (randomType < 0.85) {
        // Flick Note (Yellow Sparkle swipe)
        notes.push({
          id: `normal_flick_${idCounter++}`,
          timeMs,
          lane,
          type: 'flick'
        });
      } else {
        // Hold Note
        const holdDuration = beatMs * (Math.random() > 0.5 ? 2 : 1.5);
        notes.push({
          id: `normal_hold_${idCounter++}`,
          timeMs,
          lane,
          type: 'hold',
          durationMs: holdDuration
        });
      }
      
      // Let's create interesting dual-note chord patterns occasionally on Hard/Normal
      if (difficulty === 'Hard' && Math.random() > 0.7) {
        const lane2 = (lane + 2) % 4;
        notes.push({
          id: `hard_double_${idCounter++}`,
          timeMs,
          lane: lane2,
          type: 'tap'
        });
      }

      timeMs += beatMs * (difficulty === 'Hard' ? 1 : 1.5);
    }
  }

  // Sort notes by onset time
  return notes.sort((a, b) => a.timeMs - b.timeMs);
}

export const SONGS: Song[] = [
  {
    id: 'song_taman_bermain',
    title: 'Taman Bermain Ria',
    composer: 'Lily & Grup Ceria',
    bpm: 120,
    difficulty: 'Easy',
    stars: 1,
    durationSeconds: 26,
    primaryToneHz: 261.63, // C4
    description: 'Melodi riang gembira bertema mainan anak-anak. Ketukannya santai, sangat cocok untuk pemula merapikan refleks jari!',
    notes: generateChart(120, 'Easy', 26)
  },
  {
    id: 'song_taman_bermain_norm',
    title: 'Taman Bermain Ria',
    composer: 'Lily & Grup Ceria',
    bpm: 120,
    difficulty: 'Normal',
    stars: 3,
    durationSeconds: 26,
    primaryToneHz: 261.63,
    description: 'Melodi riang gembira bertema mainan anak-anak. Hadir dengan ketukan hold dan geser teratur yang lebih menantang!',
    notes: generateChart(120, 'Normal', 26)
  },
  {
    id: 'song_ksatria_cilik',
    title: 'Mars Petualang Kece',
    composer: 'Arthur & Paduan Musik Fantasi',
    bpm: 135,
    difficulty: 'Normal',
    stars: 4,
    durationSeconds: 30,
    primaryToneHz: 293.66, // D4
    description: 'Lagu baris-berbaris fantasi dengan drum serbu gagah berani. Bersiaplah meluncurkan flick (geser) cepat mengikuti sang trompet!',
    notes: generateChart(135, 'Normal', 30)
  },
  {
    id: 'song_ksatria_cilik_hard',
    title: 'Mars Petualang Kece',
    composer: 'Arthur & Paduan Musik Fantasi',
    bpm: 135,
    difficulty: 'Hard',
    stars: 6,
    durationSeconds: 32,
    primaryToneHz: 293.66,
    description: 'Uji kemampuan jari-jarimu! Ketukan ganda super cepat dan hold menantang di bawah gerbang istana piano!',
    notes: generateChart(135, 'Hard', 32)
  },
  {
    id: 'song_melodi_hutan',
    title: 'Nyanyian Lembah Bambu',
    composer: 'Koko & Sahabat Rimbawan',
    bpm: 100,
    difficulty: 'Easy',
    stars: 2,
    durationSeconds: 30,
    primaryToneHz: 349.23, // F4
    description: 'Lagu akustik tradisional dengan petikan banjo santai dan desau suling sepoi-sepoi. Nikmati keindahan alam secara perlahan.',
    notes: generateChart(100, 'Easy', 30)
  },
  {
    id: 'song_melodi_hutan_norm',
    title: 'Nyanyian Lembah Bambu',
    composer: 'Koko & Sahabat Rimbawan',
    bpm: 100,
    difficulty: 'Normal',
    stars: 3,
    durationSeconds: 30,
    primaryToneHz: 349.23,
    description: 'Ketukan merdu mengikuti alunan melodi mandolin alam. Sangat indah didengar di sore hari!',
    notes: generateChart(100, 'Normal', 30)
  }
];
