/**
 * 住人マスターデータ - まほうのにわ
 * 各住人の定義、エリア、好きなもの
 */

export const RESIDENTS = {
  // ======================================
  // もりのどうぶつ（森エリアに出現）
  // ======================================
  rabbit: {
    id: 'rabbit',
    name: 'うさぎ',
    type: 'forest_animal',
    category: 'common',
    area: 'forest',
    description: 'かわいい うさぎさん。ぴょんぴょん とびはねるよ',
    imagePath: '/assets/images/residents/rabbit.png',
    rarity: 1,
    appearsFrom: 'bunny_house', // どの建物から来るか
    favoriteGifts: ['vegetable_carrot', 'grass', 'flower_red'],
    personality: 'cheerful', // 明るい
    schedule: {
      morning: 'walk',     // あさ: さんぽ
      afternoon: 'garden', // ひる: にわ
      evening: 'home',     // ゆうがた: おうち
      night: 'sleep'       // よる: ねる
    },
    friendship: {
      level1: { points: 0, title: 'はじめまして' },
      level2: { points: 25, title: 'しりあい' },
      level3: { points: 50, title: 'ともだち' },
      level4: { points: 75, title: 'しんゆう' },
      level5: { points: 100, title: 'かぞく' }
    }
  },

  squirrel: {
    id: 'squirrel',
    name: 'りす',
    type: 'forest_animal',
    category: 'common',
    area: 'forest',
    description: 'げんきな りすさん。どんぐりが だいすき',
    imagePath: '/assets/images/residents/squirrel.png',
    rarity: 1,
    appearsFrom: 'tree_oak',
    favoriteGifts: ['tree_oak', 'mushroom', 'bush'],
    personality: 'energetic', // 元気
    schedule: {
      morning: 'garden',
      afternoon: 'play',
      evening: 'home',
      night: 'sleep'
    }
  },

  bird: {
    id: 'bird',
    name: 'ことり',
    type: 'forest_animal',
    category: 'common',
    area: 'forest',
    description: 'かわいい ことり。うたが じょうず',
    imagePath: '/assets/images/residents/bird.png',
    rarity: 1,
    appearsFrom: 'tree_large',
    favoriteGifts: ['tree_small', 'flower_yellow', 'grass'],
    personality: 'gentle', // やさしい
    schedule: {
      morning: 'garden',
      afternoon: 'garden',
      evening: 'home',
      night: 'sleep'
    }
  },

  // ======================================
  // みずのいきもの（湖エリアに出現）
  // ======================================
  frog: {
    id: 'frog',
    name: 'かえる',
    type: 'water_creature',
    category: 'uncommon',
    area: 'lake',
    description: 'げんきな かえるさん。げろげろ なくよ',
    imagePath: '/assets/images/residents/frog.png',
    rarity: 2,
    appearsFrom: 'frog_house',
    favoriteGifts: ['lily_pond', 'pond', 'mushroom'],
    personality: 'cheerful',
    schedule: {
      morning: 'pond',
      afternoon: 'pond',
      evening: 'pond',
      night: 'home'
    }
  },

  duck: {
    id: 'duck',
    name: 'あひる',
    type: 'water_creature',
    category: 'uncommon',
    area: 'lake',
    description: 'かわいい あひるさん。およぐのが とくい',
    imagePath: '/assets/images/residents/duck.png',
    rarity: 2,
    appearsFrom: 'pond',
    favoriteGifts: ['pond', 'waterfall', 'lily_pond'],
    personality: 'calm', // おだやか
    schedule: {
      morning: 'pond',
      afternoon: 'walk',
      evening: 'pond',
      night: 'sleep'
    }
  },

  fish: {
    id: 'fish',
    name: 'おさかな',
    type: 'water_creature',
    category: 'uncommon',
    area: 'lake',
    description: 'きらきら ひかる おさかな',
    imagePath: '/assets/images/residents/fish.png',
    rarity: 2,
    appearsFrom: 'pond',
    favoriteGifts: ['waterfall', 'fountain', 'lily_pond'],
    personality: 'shy', // はずかしがりや
    schedule: {
      morning: 'pond',
      afternoon: 'pond',
      evening: 'pond',
      night: 'pond'
    }
  },

  // ======================================
  // まちのひと（村エリアに出現）
  // ======================================
  cat_florist: {
    id: 'cat_florist',
    name: 'ねこのはなやさん',
    type: 'town_resident',
    category: 'rare',
    area: 'town',
    description: 'おはなやさんの ねこさん。はなに くわしいよ',
    imagePath: '/assets/images/residents/cat_florist.png',
    rarity: 3,
    appearsFrom: 'flower_shop',
    favoriteGifts: ['flower_special', 'flower_red', 'flower_blue'],
    personality: 'elegant', // じょうひん
    schedule: {
      morning: 'shop',
      afternoon: 'shop',
      evening: 'garden',
      night: 'sleep'
    }
  },

  bear_baker: {
    id: 'bear_baker',
    name: 'くまのパンやさん',
    type: 'town_resident',
    category: 'rare',
    area: 'town',
    description: 'やさしい くまさん。パンが じょうず',
    imagePath: '/assets/images/residents/bear_baker.png',
    rarity: 3,
    appearsFrom: 'bakery',
    favoriteGifts: ['vegetable_tomato', 'mushroom', 'tree_oak'],
    personality: 'kind', // やさしい
    schedule: {
      morning: 'shop',
      afternoon: 'shop',
      evening: 'home',
      night: 'sleep'
    }
  },

  dog_shopkeeper: {
    id: 'dog_shopkeeper',
    name: 'いぬのてんいん',
    type: 'town_resident',
    category: 'rare',
    area: 'town',
    description: 'げんきな いぬさん。おみせを てつだうよ',
    imagePath: '/assets/images/residents/dog_shopkeeper.png',
    rarity: 3,
    appearsFrom: 'shop',
    favoriteGifts: ['house_small', 'windmill', 'bakery'],
    personality: 'energetic',
    schedule: {
      morning: 'shop',
      afternoon: 'shop',
      evening: 'walk',
      night: 'sleep'
    }
  },

  // ======================================
  // まほうのいきもの（特殊条件で出現）
  // ======================================
  fairy: {
    id: 'fairy',
    name: 'ようせい',
    type: 'magic_creature',
    category: 'epic',
    area: 'sky',
    description: 'きれいな ようせいさん。まほうが つかえるよ',
    imagePath: '/assets/images/residents/fairy.png',
    rarity: 4,
    appearsFrom: 'fairy_house',
    favoriteGifts: ['rainbow', 'star_flower', 'magic_tree'],
    personality: 'mysterious', // ふしぎ
    schedule: {
      morning: 'sky',
      afternoon: 'garden',
      evening: 'sky',
      night: 'sky'
    }
  },

  angel: {
    id: 'angel',
    name: 'てんし',
    type: 'magic_creature',
    category: 'epic',
    area: 'sky',
    description: 'やさしい てんしさん。そらに すんでいるよ',
    imagePath: '/assets/images/residents/angel.png',
    rarity: 4,
    appearsFrom: 'cloud_path',
    favoriteGifts: ['rainbow', 'cloud_path', 'star_flower'],
    personality: 'gentle',
    schedule: {
      morning: 'sky',
      afternoon: 'sky',
      evening: 'sky',
      night: 'sky'
    }
  },

  // ======================================
  // でんせつのいきもの（超レア）
  // ======================================
  unicorn: {
    id: 'unicorn',
    name: 'ユニコーン',
    type: 'legendary',
    category: 'legendary',
    area: 'secret',
    description: 'でんせつの ユニコーン！つのが きらきら ひかるよ',
    imagePath: '/assets/images/residents/unicorn.png',
    rarity: 5,
    appearsFrom: 'unicorn',
    favoriteGifts: ['rainbow', 'star_flower', 'magic_tree'],
    personality: 'noble', // たかい
    schedule: {
      morning: 'garden',
      afternoon: 'garden',
      evening: 'sky',
      night: 'secret'
    }
  },

  dragon: {
    id: 'dragon',
    name: 'ドラゴン',
    type: 'legendary',
    category: 'legendary',
    area: 'secret',
    description: 'でんせつの ドラゴン！やさしい ドラゴンだよ',
    imagePath: '/assets/images/residents/dragon.png',
    rarity: 5,
    appearsFrom: 'dragon',
    favoriteGifts: ['treasure_tree', 'castle', 'magic_tree'],
    personality: 'wise', // かしこい
    schedule: {
      morning: 'cave',
      afternoon: 'garden',
      evening: 'sky',
      night: 'cave'
    }
  },

  phoenix: {
    id: 'phoenix',
    name: 'ほうおう',
    type: 'legendary',
    category: 'legendary',
    area: 'secret',
    description: 'でんせつの ほうおう！ほのおが きれいだね',
    imagePath: '/assets/images/residents/phoenix.png',
    rarity: 5,
    appearsFrom: 'phoenix',
    favoriteGifts: ['rainbow', 'star_flower', 'treasure_tree'],
    personality: 'mysterious',
    schedule: {
      morning: 'sky',
      afternoon: 'sky',
      evening: 'sky',
      night: 'sky'
    }
  },

  princess: {
    id: 'princess',
    name: 'おひめさま',
    type: 'legendary',
    category: 'legendary',
    area: 'secret',
    description: 'きれいな おひめさま。おしろに すんでいるよ',
    imagePath: '/assets/images/residents/princess.png',
    rarity: 5,
    appearsFrom: 'castle',
    favoriteGifts: ['flower_special', 'rainbow', 'castle'],
    personality: 'elegant',
    schedule: {
      morning: 'castle',
      afternoon: 'garden',
      evening: 'castle',
      night: 'castle'
    }
  }
};

/**
 * 住人IDから情報を取得
 * @param {string} residentId - 住人のID
 * @returns {Object|null} 住人の情報
 */
export function getResidentById(residentId) {
  return RESIDENTS[residentId] || null;
}

/**
 * エリアでフィルタリング
 * @param {string} area - エリア名
 * @returns {Array} 該当する住人のリスト
 */
export function getResidentsByArea(area) {
  return Object.values(RESIDENTS).filter(resident => resident.area === area);
}

/**
 * タイプでフィルタリング
 * @param {string} type - タイプ名
 * @returns {Array} 該当する住人のリスト
 */
export function getResidentsByType(type) {
  return Object.values(RESIDENTS).filter(resident => resident.type === type);
}

/**
 * レア度でフィルタリング
 * @param {number} rarity - レア度（1-5）
 * @returns {Array} 該当する住人のリスト
 */
export function getResidentsByRarity(rarity) {
  return Object.values(RESIDENTS).filter(resident => resident.rarity === rarity);
}

/**
 * すべての住人IDリストを取得
 * @returns {Array} 住人IDの配列
 */
export function getAllResidentIds() {
  return Object.keys(RESIDENTS);
}

/**
 * 現在の時間帯での行動を取得
 * @param {string} residentId - 住人のID
 * @param {number} hour - 現在の時刻（0-23）
 * @returns {string|null} 行動（'walk', 'shop', etc.）
 */
export function getCurrentActivity(residentId, hour) {
  const resident = getResidentById(residentId);
  if (!resident) return null;

  if (hour >= 6 && hour < 10) return resident.schedule.morning;
  if (hour >= 10 && hour < 16) return resident.schedule.afternoon;
  if (hour >= 16 && hour < 20) return resident.schedule.evening;
  return resident.schedule.night;
}

/**
 * 好きなプレゼントかどうかチェック
 * @param {string} residentId - 住人のID
 * @param {string} giftId - プレゼントのID
 * @returns {boolean} 好きなプレゼントならtrue
 */
export function isFavoriteGift(residentId, giftId) {
  const resident = getResidentById(residentId);
  if (!resident) return false;

  return resident.favoriteGifts.includes(giftId);
}

/**
 * なかよし度レベルを取得
 * @param {number} friendshipPoints - なかよし度ポイント（0-100）
 * @returns {Object} レベル情報
 */
export function getFriendshipLevel(friendshipPoints) {
  if (friendshipPoints >= 100) return { level: 5, title: 'かぞく' };
  if (friendshipPoints >= 75) return { level: 4, title: 'しんゆう' };
  if (friendshipPoints >= 50) return { level: 3, title: 'ともだち' };
  if (friendshipPoints >= 25) return { level: 2, title: 'しりあい' };
  return { level: 1, title: 'はじめまして' };
}
