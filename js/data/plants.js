/**
 * 植物マスターデータ - まほうのにわ
 * 各植物の定義、成長時間、画像パス
 */

export const PLANTS = {
  // ======================================
  // みどりのたね から生まれる植物
  // ======================================
  flower_red: {
    id: 'flower_red',
    name: 'あかいはな',
    type: 'flower',
    category: 'common',
    description: 'かわいい あかいはな。ちょうちょが よってくるよ',
    growthTime: {
      stage1: 1,  // たね→芽（時間）
      stage2: 2,  // 芽→つぼみ
      stage3: 3   // つぼみ→完成
    },
    waterInterval: 12, // 水やり必要間隔（時間）
    imagePath: '/assets/images/plants/flower_red',
    seedOrigin: 'green',
    rarity: 1
  },

  flower_blue: {
    id: 'flower_blue',
    name: 'あおいはな',
    type: 'flower',
    category: 'common',
    description: 'すずしい あおいはな。よるに ひかるよ',
    growthTime: { stage1: 1, stage2: 2, stage3: 3 },
    waterInterval: 12,
    imagePath: '/assets/images/plants/flower_blue',
    seedOrigin: 'green',
    rarity: 1
  },

  flower_yellow: {
    id: 'flower_yellow',
    name: 'きいろいはな',
    type: 'flower',
    category: 'common',
    description: 'げんきな きいろいはな。みつばちが すきだよ',
    growthTime: { stage1: 1, stage2: 2, stage3: 3 },
    waterInterval: 12,
    imagePath: '/assets/images/plants/flower_yellow',
    seedOrigin: 'green',
    rarity: 1
  },

  grass: {
    id: 'grass',
    name: 'くさ',
    type: 'ground',
    category: 'common',
    description: 'やわらかい くさ。ねころぶと きもちいいよ',
    growthTime: { stage1: 0.5, stage2: 1, stage3: 1.5 },
    waterInterval: 24,
    imagePath: '/assets/images/plants/grass',
    seedOrigin: 'green',
    rarity: 1
  },

  vegetable_carrot: {
    id: 'vegetable_carrot',
    name: 'にんじん',
    type: 'vegetable',
    category: 'common',
    description: 'オレンジの にんじん。うさぎさんが よろこぶよ',
    growthTime: { stage1: 1, stage2: 2, stage3: 2 },
    waterInterval: 8,
    imagePath: '/assets/images/plants/vegetable_carrot',
    seedOrigin: 'green',
    rarity: 1
  },

  vegetable_tomato: {
    id: 'vegetable_tomato',
    name: 'トマト',
    type: 'vegetable',
    category: 'common',
    description: 'まっかな トマト。あまくて おいしいよ',
    growthTime: { stage1: 1, stage2: 2, stage3: 3 },
    waterInterval: 6,
    imagePath: '/assets/images/plants/vegetable_tomato',
    seedOrigin: 'green',
    rarity: 1
  },

  // ======================================
  // ちゃいろのたね から生まれる植物
  // ======================================
  tree_small: {
    id: 'tree_small',
    name: 'ちいさなき',
    type: 'tree',
    category: 'uncommon',
    description: 'まだ ちいさい き。おおきく そだつよ',
    growthTime: { stage1: 2, stage2: 3, stage3: 4 },
    waterInterval: 24,
    imagePath: '/assets/images/plants/tree_small',
    seedOrigin: 'brown',
    rarity: 2
  },

  tree_large: {
    id: 'tree_large',
    name: 'おおきなき',
    type: 'tree',
    category: 'uncommon',
    description: 'りっぱな おおきなき。とりが すをつくるよ',
    growthTime: { stage1: 3, stage2: 4, stage3: 5 },
    waterInterval: 48,
    imagePath: '/assets/images/plants/tree_large',
    seedOrigin: 'brown',
    rarity: 2
  },

  tree_oak: {
    id: 'tree_oak',
    name: 'どんぐりのき',
    type: 'tree',
    category: 'uncommon',
    description: 'どんぐりが なる き。りすさんが あつまるよ',
    growthTime: { stage1: 2, stage2: 3, stage3: 4 },
    waterInterval: 24,
    imagePath: '/assets/images/plants/tree_oak',
    seedOrigin: 'brown',
    rarity: 2
  },

  mushroom: {
    id: 'mushroom',
    name: 'きのこ',
    type: 'fungus',
    category: 'uncommon',
    description: 'かわいい きのこ。あめのあとに はえるよ',
    growthTime: { stage1: 1, stage2: 1, stage3: 2 },
    waterInterval: 6,
    imagePath: '/assets/images/plants/mushroom',
    seedOrigin: 'brown',
    rarity: 2
  },

  bush: {
    id: 'bush',
    name: 'しげみ',
    type: 'shrub',
    category: 'uncommon',
    description: 'こんもりした しげみ。むしが かくれているよ',
    growthTime: { stage1: 1.5, stage2: 2, stage3: 2.5 },
    waterInterval: 12,
    imagePath: '/assets/images/plants/bush',
    seedOrigin: 'brown',
    rarity: 2
  },

  // ======================================
  // ピンクのたね から生まれる建物・特殊
  // ======================================
  bunny_house: {
    id: 'bunny_house',
    name: 'うさぎのおうち',
    type: 'building',
    category: 'rare',
    description: 'ちいさな うさぎのおうち。うさぎさんが すむよ',
    growthTime: { stage1: 2, stage2: 3, stage3: 4 },
    waterInterval: 24,
    imagePath: '/assets/images/plants/bunny_house',
    seedOrigin: 'pink',
    rarity: 2,
    spawnsResident: 'rabbit'
  },

  flower_special: {
    id: 'flower_special',
    name: 'レインボーフラワー',
    type: 'flower',
    category: 'rare',
    description: 'にじいろに ひかる はな。とても めずらしいよ',
    growthTime: { stage1: 2, stage2: 3, stage3: 4 },
    waterInterval: 12,
    imagePath: '/assets/images/plants/flower_special',
    seedOrigin: 'pink',
    rarity: 3
  },

  butterfly_garden: {
    id: 'butterfly_garden',
    name: 'ちょうちょのにわ',
    type: 'garden',
    category: 'rare',
    description: 'ちょうちょが たくさん とぶ にわ',
    growthTime: { stage1: 2, stage2: 3, stage3: 3 },
    waterInterval: 12,
    imagePath: '/assets/images/plants/butterfly_garden',
    seedOrigin: 'pink',
    rarity: 2
  },

  heart_plant: {
    id: 'heart_plant',
    name: 'ハートのくさ',
    type: 'flower',
    category: 'rare',
    description: 'ハートのかたちを した くさ。あいがいっぱい',
    growthTime: { stage1: 1, stage2: 2, stage3: 3 },
    waterInterval: 12,
    imagePath: '/assets/images/plants/heart_plant',
    seedOrigin: 'pink',
    rarity: 2
  },

  ribbon_tree: {
    id: 'ribbon_tree',
    name: 'リボンのき',
    type: 'tree',
    category: 'rare',
    description: 'リボンが なる ふしぎなき',
    growthTime: { stage1: 2, stage2: 3, stage3: 4 },
    waterInterval: 24,
    imagePath: '/assets/images/plants/ribbon_tree',
    seedOrigin: 'pink',
    rarity: 2
  },

  // ======================================
  // あおいたね から生まれる水関連
  // ======================================
  pond: {
    id: 'pond',
    name: 'いけ',
    type: 'water',
    category: 'rare',
    description: 'ちいさな いけ。おさかなが およいでいるよ',
    growthTime: { stage1: 3, stage2: 4, stage3: 5 },
    waterInterval: 0, // 水場なので水やり不要
    imagePath: '/assets/images/plants/pond',
    seedOrigin: 'blue',
    rarity: 3
  },

  fountain: {
    id: 'fountain',
    name: 'ふんすい',
    type: 'water',
    category: 'rare',
    description: 'きれいな ふんすい。みずが ぴょんぴょん',
    growthTime: { stage1: 3, stage2: 4, stage3: 5 },
    waterInterval: 0,
    imagePath: '/assets/images/plants/fountain',
    seedOrigin: 'blue',
    rarity: 3
  },

  frog_house: {
    id: 'frog_house',
    name: 'かえるのおうち',
    type: 'building',
    category: 'rare',
    description: 'かえるさんの おうち。げろげろ！',
    growthTime: { stage1: 2, stage2: 3, stage3: 4 },
    waterInterval: 6,
    imagePath: '/assets/images/plants/frog_house',
    seedOrigin: 'blue',
    rarity: 3,
    spawnsResident: 'frog'
  },

  waterfall: {
    id: 'waterfall',
    name: 'たき',
    type: 'water',
    category: 'rare',
    description: 'ざぁざぁ ながれる たき。すずしいよ',
    growthTime: { stage1: 4, stage2: 5, stage3: 6 },
    waterInterval: 0,
    imagePath: '/assets/images/plants/waterfall',
    seedOrigin: 'blue',
    rarity: 3
  },

  lily_pond: {
    id: 'lily_pond',
    name: 'はすのいけ',
    type: 'water',
    category: 'rare',
    description: 'はすのはなが さく いけ。きれいだね',
    growthTime: { stage1: 3, stage2: 4, stage3: 5 },
    waterInterval: 0,
    imagePath: '/assets/images/plants/lily_pond',
    seedOrigin: 'blue',
    rarity: 3
  },

  // ======================================
  // きいろいたね から生まれる建物
  // ======================================
  house_small: {
    id: 'house_small',
    name: 'ちいさなおうち',
    type: 'building',
    category: 'rare',
    description: 'かわいい ちいさなおうち。だれか すむかな？',
    growthTime: { stage1: 3, stage2: 4, stage3: 5 },
    waterInterval: 48,
    imagePath: '/assets/images/plants/house_small',
    seedOrigin: 'yellow',
    rarity: 3,
    spawnsResident: 'random'
  },

  shop: {
    id: 'shop',
    name: 'おみせ',
    type: 'building',
    category: 'rare',
    description: 'ちいさな おみせ。いろんなものが うっているよ',
    growthTime: { stage1: 4, stage2: 5, stage3: 6 },
    waterInterval: 48,
    imagePath: '/assets/images/plants/shop',
    seedOrigin: 'yellow',
    rarity: 3,
    spawnsResident: 'shopkeeper'
  },

  windmill: {
    id: 'windmill',
    name: 'ふうしゃ',
    type: 'building',
    category: 'rare',
    description: 'くるくる まわる ふうしゃ。かぜが きもちいいよ',
    growthTime: { stage1: 4, stage2: 5, stage3: 6 },
    waterInterval: 48,
    imagePath: '/assets/images/plants/windmill',
    seedOrigin: 'yellow',
    rarity: 3
  },

  bakery: {
    id: 'bakery',
    name: 'パンや',
    type: 'building',
    category: 'rare',
    description: 'パンやさん。いいにおいが するね',
    growthTime: { stage1: 4, stage2: 5, stage3: 6 },
    waterInterval: 48,
    imagePath: '/assets/images/plants/bakery',
    seedOrigin: 'yellow',
    rarity: 3,
    spawnsResident: 'bear_baker'
  },

  flower_shop: {
    id: 'flower_shop',
    name: 'おはなや',
    type: 'building',
    category: 'rare',
    description: 'おはなやさん。きれいなはなが いっぱい',
    growthTime: { stage1: 3, stage2: 4, stage3: 5 },
    waterInterval: 24,
    imagePath: '/assets/images/plants/flower_shop',
    seedOrigin: 'yellow',
    rarity: 3,
    spawnsResident: 'cat_florist'
  },

  // ======================================
  // むらさきのたね から生まれる魔法
  // ======================================
  rainbow: {
    id: 'rainbow',
    name: 'にじ',
    type: 'magic',
    category: 'epic',
    description: 'ほんものの にじ！そらへの みちが ひらくよ',
    growthTime: { stage1: 4, stage2: 5, stage3: 6 },
    waterInterval: 24,
    imagePath: '/assets/images/plants/rainbow',
    seedOrigin: 'purple',
    rarity: 4,
    unlocksArea: 'sky'
  },

  cloud_path: {
    id: 'cloud_path',
    name: 'くものみち',
    type: 'magic',
    category: 'epic',
    description: 'くもの うえを あるける みち',
    growthTime: { stage1: 4, stage2: 5, stage3: 6 },
    waterInterval: 48,
    imagePath: '/assets/images/plants/cloud_path',
    seedOrigin: 'purple',
    rarity: 4
  },

  fairy_house: {
    id: 'fairy_house',
    name: 'ようせいのおうち',
    type: 'building',
    category: 'epic',
    description: 'ようせいさんの おうち。きらきら ひかるよ',
    growthTime: { stage1: 4, stage2: 5, stage3: 6 },
    waterInterval: 24,
    imagePath: '/assets/images/plants/fairy_house',
    seedOrigin: 'purple',
    rarity: 4,
    spawnsResident: 'fairy'
  },

  magic_tree: {
    id: 'magic_tree',
    name: 'まほうのき',
    type: 'tree',
    category: 'epic',
    description: 'まほうの ちからを もつ き。ふしぎなことが おきるよ',
    growthTime: { stage1: 5, stage2: 6, stage3: 7 },
    waterInterval: 48,
    imagePath: '/assets/images/plants/magic_tree',
    seedOrigin: 'purple',
    rarity: 4
  },

  star_flower: {
    id: 'star_flower',
    name: 'ほしのはな',
    type: 'flower',
    category: 'epic',
    description: 'よるに ほしのように ひかる はな',
    growthTime: { stage1: 4, stage2: 5, stage3: 6 },
    waterInterval: 24,
    imagePath: '/assets/images/plants/star_flower',
    seedOrigin: 'purple',
    rarity: 4
  },

  // ======================================
  // きんいろのたね から生まれる伝説
  // ======================================
  castle: {
    id: 'castle',
    name: 'おしろ',
    type: 'building',
    category: 'legendary',
    description: 'すごい！ほんものの おしろだ！',
    growthTime: { stage1: 6, stage2: 8, stage3: 10 },
    waterInterval: 72,
    imagePath: '/assets/images/plants/castle',
    seedOrigin: 'gold',
    rarity: 5,
    spawnsResident: 'princess'
  },

  dragon: {
    id: 'dragon',
    name: 'ドラゴン',
    type: 'creature',
    category: 'legendary',
    description: 'でんせつの ドラゴン！やさしい ドラゴンだよ',
    growthTime: { stage1: 8, stage2: 10, stage3: 12 },
    waterInterval: 48,
    imagePath: '/assets/images/plants/dragon',
    seedOrigin: 'gold',
    rarity: 5,
    spawnsResident: 'dragon'
  },

  unicorn: {
    id: 'unicorn',
    name: 'ユニコーン',
    type: 'creature',
    category: 'legendary',
    description: 'でんせつの ユニコーン！つのが きらきら',
    growthTime: { stage1: 8, stage2: 10, stage3: 12 },
    waterInterval: 48,
    imagePath: '/assets/images/plants/unicorn',
    seedOrigin: 'gold',
    rarity: 5,
    spawnsResident: 'unicorn'
  },

  phoenix: {
    id: 'phoenix',
    name: 'ほうおう',
    type: 'creature',
    category: 'legendary',
    description: 'でんせつの ほうおう！ほのおが きれいだね',
    growthTime: { stage1: 8, stage2: 10, stage3: 12 },
    waterInterval: 48,
    imagePath: '/assets/images/plants/phoenix',
    seedOrigin: 'gold',
    rarity: 5,
    spawnsResident: 'phoenix'
  },

  treasure_tree: {
    id: 'treasure_tree',
    name: 'たからのき',
    type: 'tree',
    category: 'legendary',
    description: 'たからが なる ふしぎなき。きんかが キラキラ',
    growthTime: { stage1: 6, stage2: 8, stage3: 10 },
    waterInterval: 72,
    imagePath: '/assets/images/plants/treasure_tree',
    seedOrigin: 'gold',
    rarity: 5
  }
};

/**
 * 植物IDから情報を取得
 * @param {string} plantId - 植物のID
 * @returns {Object|null} 植物の情報
 */
export function getPlantById(plantId) {
  return PLANTS[plantId] || null;
}

/**
 * カテゴリでフィルタリング
 * @param {string} category - カテゴリ名
 * @returns {Array} 該当する植物のリスト
 */
export function getPlantsByCategory(category) {
  return Object.values(PLANTS).filter(plant => plant.category === category);
}

/**
 * タイプでフィルタリング
 * @param {string} type - タイプ名
 * @returns {Array} 該当する植物のリスト
 */
export function getPlantsByType(type) {
  return Object.values(PLANTS).filter(plant => plant.type === type);
}

/**
 * レア度でフィルタリング
 * @param {number} rarity - レア度（1-5）
 * @returns {Array} 該当する植物のリスト
 */
export function getPlantsByRarity(rarity) {
  return Object.values(PLANTS).filter(plant => plant.rarity === rarity);
}

/**
 * すべての植物IDリストを取得
 * @returns {Array} 植物IDの配列
 */
export function getAllPlantIds() {
  return Object.keys(PLANTS);
}

/**
 * 植物の総成長時間を計算
 * @param {string} plantId - 植物のID
 * @returns {number} 総成長時間（時間）
 */
export function getTotalGrowthTime(plantId) {
  const plant = getPlantById(plantId);
  if (!plant) return 0;

  const { stage1, stage2, stage3 } = plant.growthTime;
  return stage1 + stage2 + stage3;
}
