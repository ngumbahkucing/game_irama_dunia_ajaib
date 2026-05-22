import { Character, Card } from '../types';

export const CHARACTERS: Character[] = [
  // GRUP A: Pop Ceria
  {
    id: 'lily',
    name: 'Lily',
    nickname: 'Penyanyi Ceria',
    faction: 'Ceria',
    description: 'Seorang gadis lincah yang selalu membawa mikrofon bertenaga surya. Lily percaya nyanyian riang bisa mewujudkan semua kebaikan!',
    avatarColor: 'bg-pink-400',
    borderColor: 'border-pink-300',
    textColor: 'text-pink-600',
    quotes: [
      'Halo teman-teman! Hari ini cerah sekali, mari kita bernyanyi!',
      'Suara gitar, suara drum... semuanya bersatu membuat kita tersenyum!',
      'Yakinlah, mimpimu pasti akan bersinar terang hari ini!'
    ]
  },
  {
    id: 'riko',
    name: 'Riko',
    nickname: 'Pemain Drum Mainan',
    faction: 'Ceria',
    description: 'Riko gemar mengumpulkan mainan bekas dan merakitnya menjadi drum set yang paling berisik tapi menyenangkan sedunia.',
    avatarColor: 'bg-amber-400',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-600',
    quotes: [
      'Dengarkan ketukanku! Dum-tak-dum! Hebat kan?',
      'Jika kamu lelah, ikuti saja detak musik dari drum ajaibku!',
      'Ayo melompat tinggi-tinggi!'
    ]
  },
  {
    id: 'mimi',
    name: 'Mimi',
    nickname: 'Ratu Keyboard Neon',
    faction: 'Ceria',
    description: 'Mimi adalah jenius kecil pengolah suara. Keyboard miliknya mengeluarkan gelembung sabun warna-warni setiap kali tutsnya ditekan.',
    avatarColor: 'bg-cyan-400',
    borderColor: 'border-cyan-300',
    textColor: 'text-cyan-600',
    quotes: [
      'Tuts keduaku menghasilkan gelembung rasa strawberry lho!',
      'Mari racik suara alam menjadi arpeggio yang keren!',
      'Sstt... dengarkan suara pelangi!'
    ]
  },

  // GRUP B: Fantasi Petualangan
  {
    id: 'arthur',
    name: 'Arthur',
    nickname: 'Ksatria Piano',
    faction: 'Fantasi',
    description: 'Mengenakan mahkota kertas dan jubah biru, Arthur mengiringi petualangan teman-temannya dengan melodi piano klasik yang gagah berani.',
    avatarColor: 'bg-indigo-500',
    borderColor: 'border-indigo-400',
    textColor: 'text-indigo-600',
    quotes: [
      'Gagah berani seperti benteng, musik kita tidak akan pernah goyah!',
      'Untuk persahabatan kita, aku persembahkan simfoni berkilau ini!',
      'Pedang kayu di tangan kanan, tuts piano di tangan kiri!'
    ]
  },
  {
    id: 'elfin',
    name: 'Elfin',
    nickname: 'Penyihir Harpa Kece',
    faction: 'Fantasi',
    description: 'Elfin suka mengenakan topi kerucut penyihir bergemerlap. Harpa sakti miliknya bisa memanggil kelinci bercahaya dari dunia mimpi.',
    avatarColor: 'bg-purple-500',
    borderColor: 'border-purple-400',
    textColor: 'text-purple-600',
    quotes: [
      'Abrakadabra! Dengarkan petikan harpa ajaibku!',
      'Kelap-kelip bintang malam, bawa kita meluncur ke istana melodi!',
      'Harapanku adalah melihat semua orang bahagia.'
    ]
  },
  {
    id: 'gaby',
    name: 'Gaby',
    nickname: 'Penjaga Rebana Ruby',
    faction: 'Fantasi',
    description: 'Gaby selalu siap sedia melindungi kawan-kawannya dari kesedihan. Rebana miliknya terbuat dari kristal merah yang bercahaya hangat.',
    avatarColor: 'bg-rose-500',
    borderColor: 'border-rose-400',
    textColor: 'text-rose-600',
    quotes: [
      'Jangan takut! Tameng rebanaku akan melindungimu dari kemarahan!',
      'Satu! Dua! Langkah kaki tegak beriringan!',
      'Musik adalah pelindung terbaik kawan!'
    ]
  },

  // GRUP C: Santai Alam
  {
    id: 'koko',
    name: 'Koko',
    nickname: 'Suling Kayu Beaver',
    faction: 'Alam',
    description: 'Koko adalah beaver cerdas yang memotong bambu hutan untuk dijadikan suling merdu penghalau kabut pagi.',
    avatarColor: 'bg-emerald-500',
    borderColor: 'border-emerald-400',
    textColor: 'text-emerald-700',
    quotes: [
      'Fiiuww... fiii... tiupan suling ini sedingin angin pegunungan.',
      'Ayo bantu aku mengumpulkan ranting sambil bersiul!',
      'Alam adalah orkestra terindah yang pernah ada.'
    ]
  },
  {
    id: 'pippo',
    name: 'Pippo',
    nickname: 'Tupai Biola Daun',
    faction: 'Alam',
    description: 'Dengan ekor tebal yang lucu, Pippo menggesek biola kecilnya di atas pohon ek tinggi membuat daun-daun ikut menari.',
    avatarColor: 'bg-amber-600',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-800',
    quotes: [
      'Ngiit-ngoot! Gesekan biolaku menandakan kacang kenari siap dipanen!',
      'Mungkinkah angin membawa nadaku hingga ke ujung dunia?',
      'Melompat dari dahan ke dahan diiringi musik!'
    ]
  },
  {
    id: 'kiki',
    name: 'Kiki',
    nickname: 'Kelinci Banjo Bambu',
    faction: 'Alam',
    description: 'Kiki adalah kelinci periang berbulu seputih salju. Banjo bambu miliknya berbunyi nyaring menumbuhkan bunga-bunga liar bermekaran.',
    avatarColor: 'bg-teal-500',
    borderColor: 'border-teal-400',
    textColor: 'text-teal-700',
    quotes: [
      'Tring-tring! Wortel-wortel ayo bergoyang!',
      'Telingaku yang panjang bisa mendengar suara bisikan daun paling kecil!',
      'Musik membuat hati kita seringan kapas!'
    ]
  }
];

export const CARDS_DATABASE: Card[] = [
  // 5 STARS CARDS (Ultra Rare - Bonus 150%)
  {
    id: 'card_lily_5s',
    characterId: 'lily',
    name: 'Konser Bintang Pelangi Lily',
    rarity: 5,
    faction: 'Ceria',
    bonusMultiplier: 1.5,
    imagePrompt: 'A magical vibrant stage filled with multi-color rainbows, bubble machines, and starry neon lights with pastel pink undertone',
    artStyle: 'Rainbow Symphony',
    unlockedQuote: 'Lihatlah! Seluruh dunia ikut bersinar saat kita bernyanyi di bawah lengkungan pelangi!'
  },
  {
    id: 'card_arthur_5s',
    characterId: 'arthur',
    name: 'Ksatria Agung Istana Piano',
    rarity: 5,
    faction: 'Fantasi',
    bonusMultiplier: 1.5,
    imagePrompt: 'A gorgeous medieval fantasy crystal castle stage under starry night, surrounded by hovering golden glowing piano keys',
    artStyle: 'Golden Fantasy',
    unlockedQuote: 'Menara kristal menjadi saksi perjuangan melodi kita. Mari terus melangkah maju tanpa ragu!'
  },
  {
    id: 'card_koko_5s',
    characterId: 'koko',
    name: 'Konser Senja Lembah Hijau',
    rarity: 5,
    faction: 'Alam',
    bonusMultiplier: 1.5,
    imagePrompt: 'A warm autumn sunset glowing over a giant mossy tree house valley with cute animated forest animal silhouettes listening to a wooden flute',
    artStyle: 'Scenic Forest',
    unlockedQuote: 'Angin gunung membisikkan melodi kedamaian. Mari bersatu dalam harmoni hutan yang asri.'
  },

  // 4 STARS CARDS (Rare - Bonus 125%)
  {
    id: 'card_riko_4s',
    characterId: 'riko',
    name: 'Raja Mainan Berdetak',
    rarity: 4,
    faction: 'Ceria',
    bonusMultiplier: 1.25,
    imagePrompt: 'A lively playground full of cute wind-up toys, toy blocks, and candy castles with bright sunshine lighting',
    artStyle: 'Playground Popsicle',
    unlockedQuote: 'Setiap mainan lama punya lagu tersendiri. Dengarkan ketukan drum baruku ini!'
  },
  {
    id: 'card_mimi_4s',
    characterId: 'mimi',
    name: 'Penyelamat Kota Gelembung Sabun',
    rarity: 4,
    faction: 'Ceria',
    bonusMultiplier: 1.25,
    imagePrompt: 'A futuristic pink-and-blue candy neon city filled with glowing neon bubble portals and floating jelly candies',
    artStyle: 'Neon Bubblewave',
    unlockedQuote: 'Jika kamu sedih, masuklah ke pelukan gelembung manis buatanku! Slurrpp... rasanya stroberi!'
  },
  {
    id: 'card_elfin_4s',
    characterId: 'elfin',
    name: 'Pekikan Kelinci Kosmis',
    rarity: 4,
    faction: 'Fantasi',
    bonusMultiplier: 1.25,
    imagePrompt: 'A mystical dark starry sky with glowing constellations in the shape of bunnies and magical violet floating harps',
    artStyle: 'Cosmic Mystique',
    unlockedQuote: 'Bintang utara menunjukkan jalan ke lubang kelinci ajaib. Petik harpamu, saatnya meluncur!'
  },
  {
    id: 'card_gaby_4s',
    characterId: 'gaby',
    name: 'Pelindung Lembah Api Merah',
    rarity: 4,
    faction: 'Fantasi',
    bonusMultiplier: 1.25,
    imagePrompt: 'A heroic shield defense fortress surrounded by red crystalline trees and fireworks lighting the evening skies',
    artStyle: 'Ruby Guardianship',
    unlockedQuote: 'Suara rebanaku adalah pelindung hati yang rapuh. Tidak akan kubiarkan ada tangis kesedihan!'
  },
  {
    id: 'card_pippo_4s',
    characterId: 'pippo',
    name: 'Resital Musim Gugur Daun Emas',
    rarity: 4,
    faction: 'Alam',
    bonusMultiplier: 1.25,
    imagePrompt: 'An elegant forest glade covered in swirling golden falling autumn oak leaves with light filtered through the canopy ',
    artStyle: 'Autumn Gold',
    unlockedQuote: 'Gesekan biolaku menirukan gemerisik daun-daun berguguran. Hangat dan menenangkan!'
  },
  {
    id: 'card_kiki_4s',
    characterId: 'kiki',
    name: 'Tarian Kelinci Kebun Wortel',
    rarity: 4,
    faction: 'Alam',
    bonusMultiplier: 1.25,
    imagePrompt: 'A huge green sunny carrot garden with colorful floral blossoms and floating musical butterflies',
    artStyle: 'Sunny Meadow',
    unlockedQuote: 'Banjo bambuku memanggil cacing tanah ramah dan kelinci untuk menari bersama di bawah matahari pagi!'
  },

  // 3 STARS CARDS (Common - Bonus 110%)
  {
    id: 'card_lily_3s',
    characterId: 'lily',
    name: 'Piknik Santai Taman Kota Lily',
    rarity: 3,
    faction: 'Ceria',
    bonusMultiplier: 1.1,
    imagePrompt: 'A simple sunny park layout with checkered picnic blanket, apples, and pastel skies.',
    artStyle: 'Simple Pastel',
    unlockedQuote: 'Roti lapis keju, jus buah, dan lagu kesukaanmu... ini adalah hari terbaik!'
  },
  {
    id: 'card_riko_3s',
    characterId: 'riko',
    name: 'Latihan Sore Garasi Riko',
    rarity: 3,
    faction: 'Ceria',
    bonusMultiplier: 1.1,
    imagePrompt: 'A cozy playful garage with bicycle tires, cardboard boxes and stickers on the wall.',
    artStyle: 'Retro Kid',
    unlockedQuote: 'Biarpun latihan di garasi rumah, semangat kita tetap setinggi panggung konser!'
  },
  {
    id: 'card_mimi_3s',
    characterId: 'mimi',
    name: 'Koki Kue Gelembung Mimi',
    rarity: 3,
    faction: 'Ceria',
    bonusMultiplier: 1.1,
    imagePrompt: 'A sweet kitchen counter baking delicious colorful cupcakes with cute decorations.',
    artStyle: 'Sweet Bakery',
    unlockedQuote: 'Sedikit taburan melodi ajaib pada adonan kue membuat kuenya bisa mengambang lho!'
  },
  {
    id: 'card_arthur_3s',
    characterId: 'arthur',
    name: 'Ksatria Kertas Arthur',
    rarity: 3,
    faction: 'Fantasi',
    bonusMultiplier: 1.1,
    imagePrompt: 'A playful cardboard sword and paper crown resting on a study desk with notebooks.',
    artStyle: 'Cardboard Hero',
    unlockedQuote: 'Biarpun pedangku terbuat dari kertas koran, mimpiku sungguh-sungguh nyata!'
  },
  {
    id: 'card_elfin_3s',
    characterId: 'elfin',
    name: 'Belajar Ramuan Sihir Elfin',
    rarity: 3,
    faction: 'Fantasi',
    bonusMultiplier: 1.1,
    imagePrompt: 'A small study room with old books, glowing star lamps, and wizard hats.',
    artStyle: 'Apprentice Library',
    unlockedQuote: 'Satu sendok bubuk bintang, satu larikan harpa... bum! Jadilah bunga melati bercahaya.'
  },
  {
    id: 'card_gaby_3s',
    characterId: 'gaby',
    name: 'Kawan Berjalan Kaki Gaby',
    rarity: 3,
    faction: 'Fantasi',
    bonusMultiplier: 1.1,
    imagePrompt: 'A beautiful gravel path through lush blooming meadows under broad daylight.',
    artStyle: 'Happy Outdoors',
    unlockedQuote: 'Berjalanlah di sampingku. Bersama-sama, kita pasti bisa melewati jembatan reyot itu!'
  },
  {
    id: 'card_koko_3s',
    characterId: 'koko',
    name: 'Pondok Kayu Koko',
    rarity: 3,
    faction: 'Alam',
    bonusMultiplier: 1.1,
    imagePrompt: 'A warm wood log cabin interior with fireplace crackling and wooden furniture.',
    artStyle: 'Cozy Log Cabin',
    unlockedQuote: 'Dingin malam tidak terasa berkat kehangatan pondok kecilku dan iringan tiupan suling.'
  },
  {
    id: 'card_pippo_3s',
    characterId: 'pippo',
    name: 'Pengumpul Kacang Pippo',
    rarity: 3,
    faction: 'Alam',
    bonusMultiplier: 1.1,
    imagePrompt: 'A cute oak tree branch with acorns, green leaves, and soft morning dew.',
    artStyle: 'Forest Harvest',
    unlockedQuote: 'Kumpulkan kacang kenari yang gemuk ini! Mereka bersiul sangat merdu jika kita ketuk pelan-pelan.'
  },
  {
    id: 'card_kiki_3s',
    characterId: 'kiki',
    name: 'Kebun Wortel Berdendang Kiki',
    rarity: 3,
    faction: 'Alam',
    bonusMultiplier: 1.1,
    imagePrompt: 'A small lovely organic garden raised bed with cute seedlings sprouting under bright morning sun.',
    artStyle: 'Home Garden',
    unlockedQuote: 'Ayo sirami wortel-wortel ini sambil diiringi petikan banjo manis! Mereka tumbuh lebih cepat lho!'
  }
];
