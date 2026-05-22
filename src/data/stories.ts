import { Chapter } from '../types';

export const STORIES: Chapter[] = [
  // FACTION A: Ceria
  {
    id: 'ch_ceria_1',
    title: 'Gitar Hilang di Taman Bermain',
    faction: 'Ceria',
    summary: 'Lily kehilangan kotak musik cermedian kesayangannya tepat sebelum pertunjukan taman bermain dimulai. Bisakah Riko dan Mimi membantunya?',
    unlockCostPoints: 0,
    nodes: [
      {
        id: 'c1_node_1',
        characterName: 'Lily',
        expression: 'BINGUNG',
        dialogue: 'Aduh gawat, gawat sekali! Di mana ya aku menaruh mikrofon gelembung ajaibku tadi? Tanpa itu kita tidak bisa konser...'
      },
      {
        id: 'c1_node_2',
        characterName: 'Riko',
        expression: 'SENANG',
        dialogue: 'Hai Lily! Kenapa kamu mondar-mandir seperti mainan rusak begitu? Sini, makan cokelat dulu!'
      },
      {
        id: 'c1_node_3',
        characterName: 'Lily',
        expression: 'BINGUNG',
        dialogue: 'Rikoo! Aku sedang panik! Aku lupa menaruh mikrofon merah jambuku. Padahal anak-anak di taman bermain sudah berkumpul!'
      },
      {
        id: 'c1_node_4',
        characterName: 'Mimi',
        expression: 'SEMANGAT',
        dialogue: 'Tadaaa! Apakah yang kamu cari adalah silinder pink panjang berkilau ini? Tadi kamu meninggalkannya di atas komidi putar!'
      },
      {
        id: 'c1_node_5',
        characterName: 'Lily',
        expression: 'SENANG',
        dialogue: 'Wahhh! Mimi! Kamu penyelamatku! Terima kasih banyak ya!'
      },
      {
        id: 'c1_node_6',
        characterName: 'Riko',
        expression: 'SEMANGAT',
        dialogue: 'Baguslah! Sekarang semuanya sudah lengkap. Ayo kita ketuk drum kita, kita guncang taman bermain ini dengan kegembiraan!'
      },
      {
        id: 'c1_node_7',
        characterName: 'Mimi',
        expression: 'SENANG',
        dialogue: 'Aku akan memencet tuts keyboard gelembung stroberi! Bersiaplah melompat sesuka hati!'
      }
    ]
  },
  {
    id: 'ch_ceria_2',
    title: 'Gelembung Musik Raksasa',
    faction: 'Ceria',
    summary: 'Eksperimen keyboard Mimi tidak sengaja membungkus seluruh band dalam gelembung sabun raksasa yang mengambang ke langit!',
    unlockCostPoints: 120,
    nodes: [
      {
        id: 'c2_node_1',
        characterName: 'Mimi',
        expression: 'SENANG',
        dialogue: 'Teman-teman, lihat! Aku berhasil memperbarui sirkuit penghasil sabun cair keyboardku!'
      },
      {
        id: 'c2_node_2',
        characterName: 'Riko',
        expression: 'BINGUNG',
        dialogue: 'Wah, tapi Mimi, gelembung yang keluar kenapa ukurannya jadi sebesar semangka ya?'
      },
      {
        id: 'c2_node_3',
        characterName: 'Lily',
        expression: 'SEMANGAT',
        dialogue: 'Lucu sekali! Ayo kita melompat ke dalamnya... Heh? Lho, kok tubuh kita jadi terangkat naik ke udara?'
      },
      {
        id: 'c2_node_4',
        characterName: 'Mimi',
        expression: 'BINGUNG',
        dialogue: 'Aaaak! Aku lupa mematikan mode anti-gravitasi! Sekarang kita mengapung di atas balai kota!'
      },
      {
        id: 'c2_node_5',
        characterName: 'Riko',
        expression: 'SEMANGAT',
        dialogue: 'Tenang, jangan panik! Ayo kita mainkan tempo musik pop yang cepat! Tekanan udaranya pasti bisa memecahkan gelembung ini!'
      },
      {
        id: 'c2_node_6',
        characterName: 'Lily',
        expression: 'SENANG',
        dialogue: 'Ide hebat! Bernyanyi bersama dalam hitungan satu, dua, tiga... Meluncur!'
      }
    ]
  },

  // FACTION B: Fantasi
  {
    id: 'ch_fantasi_1',
    title: 'Keberanian yang Padam',
    faction: 'Fantasi',
    summary: 'Arthur sang ksatria merasa takut memimpin barisan musik karena mahkota kertas miliknya robek. Elfin menyemangatinya.',
    unlockCostPoints: 0,
    nodes: [
      {
        id: 'f1_node_1',
        characterName: 'Arthur',
        expression: 'SERIUS',
        dialogue: 'Duh, mahkota kertas kebanggaanku robek terkena dahan pohon pelindung tadi. Tanpa mahkota ini, aku tidak merasa gagah seperti ksatria...'
      },
      {
        id: 'f1_node_2',
        characterName: 'Gaby',
        expression: 'BINGUNG',
        dialogue: 'Hei Arthur! Mengapa kamu menunduk lesu di balik tameng kayu? Kita harus segera membunyikan lonceng orkestra istana!'
      },
      {
        id: 'f1_node_3',
        characterName: 'Arthur',
        expression: 'SERIUS',
        dialogue: 'Aku malu, Gaby... Mahkotaku sudah rusak. Rakyat fantasi tidak akan mau mendengar pawai ksatria tanpa mahkota megah.'
      },
      {
        id: 'f1_node_4',
        characterName: 'Elfin',
        expression: 'SENANG',
        dialogue: 'Penyihir harpa Elfin datang membawa pertolongan! Sini kawan, akan kuhias mahkota kertasmu dengan kelopak kelap-kelip bintang!'
      },
      {
        id: 'f1_node_5',
        characterName: 'Arthur',
        expression: 'SENANG',
        dialogue: 'Hah? Wah! Mahkotaku sekarang memancarkan cahaya ungu berkilau! Indah sekali!'
      },
      {
        id: 'f1_node_6',
        characterName: 'Gaby',
        expression: 'SEMANGAT',
        dialogue: 'Keberanian sejati itu ada di dalam hatimu saat membela teman, bukan pada kertas di kepalamu! Ayo, tegakkan kepalamu!'
      },
      {
        id: 'f1_node_7',
        characterName: 'Arthur',
        expression: 'SEMANGAT',
        dialogue: 'Kalian benar! Terima kasih kawan-kawan. Angkat tamengmu Gaby, petik harpamu Elfin! Demi persahabatan, kita kumandangkan simfoni!'
      }
    ]
  },

  // FACTION C: Alam
  {
    id: 'ch_alam_1',
    title: 'Memanggil Hujan Berkah',
    faction: 'Alam',
    summary: 'Kebun wortel kelinci Kiki mengalami kekeringan. Koko berniat membuat paduan tiupan suling bambu penarik mendung hujan.',
    unlockCostPoints: 0,
    nodes: [
      {
        id: 'a1_node_1',
        characterName: 'Kiki',
        expression: 'SERIUS',
        dialogue: 'Kasihan sekali wortel-wortelku... Mereka menunduk layu karena sudah satu minggu hujan tidak turun di lembah alam ini.'
      },
      {
        id: 'a1_node_2',
        characterName: 'Koko',
        expression: 'BIASA',
        dialogue: 'Tenang Kiki, jangan berkecil hati. Kata kakek Beaver tua, suara suling bambu yang diembus dengan penuh kasih bisa memanggil awan putih mendung.'
      },
      {
        id: 'a1_node_3',
        characterName: 'Pippo',
        expression: 'SEMANGAT',
        dialogue: 'Dan aku akan membantu dengan menggesek biola pinusku! Gesekannya akan berbunyi seperti desau gerimis yang sejuk!'
      },
      {
        id: 'a1_node_4',
        characterName: 'Kiki',
        expression: 'BINGUNG',
        dialogue: 'Benarkah? Apakah musik tradisional kita bisa sekuat itu menjangkau langit?'
      },
      {
        id: 'a1_node_5',
        characterName: 'Koko',
        expression: 'SENANG',
        dialogue: 'Tentu saja! Kekuatan musik berasal dari kesungguhan cinta kita pada bumi ini. Mari kita buktikan bersama!'
      },
      {
        id: 'a1_node_6',
        characterName: 'Pippo',
        expression: 'SEMANGAT',
        dialogue: 'Dengar! Angin mulai bertiup kencang saat kita memetik senar pertama. Langit pun menyambut nada kita!'
      },
      {
        id: 'a1_node_7',
        characterName: 'Kiki',
        expression: 'SENANG',
        dialogue: 'Hore! Rintik air mulai turun membasahi dedaunan! Wortel-wortelku berdansa tegak kembali! Terima kasih, semuanya!'
      }
    ]
  }
];
