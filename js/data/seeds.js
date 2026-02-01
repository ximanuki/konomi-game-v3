/**
 * たねマスターデータ - まほうのにわ
 * 各たねの定義、生まれるもの、レア度
 */

export const SEEDS = {
  green: {
    id: 'green',
    name: 'みどりのたね',
    color: '#7BC47F',
    emoji: '🟢',
    rarity: 1, // ★☆☆☆☆
    description: 'よくみる、ふつうのたね。はなや くさが そだつよ',
    outcomes: [
      'flower_red',
      'flower_blue',
      'flower_yellow',
      'grass',
      'vegetable_carrot',
      'vegetable_tomato'
    ],
    baseGrowthTime: 1 // 基本成長時間（時間）
  },

  brown: {
    id: 'brown',
    name: 'ちゃいろのたね',
    color: '#8B6F47',
    emoji: '🟤',
    rarity: 2, // ★★☆☆☆
    description: 'つちのにおいがする たね。きや もりが できるよ',
    outcomes: [
      'tree_small',
      'tree_large',
      'tree_oak',
      'mushroom',
      'bush'
    ],
    baseGrowthTime: 2
  },

  pink: {
    id: 'pink',
    name: 'ピンクのたね',
    color: '#FFB6C1',
    emoji: '🩷',
    rarity: 2, // ★★☆☆☆
    description: 'かわいい ピンクのたね。かわいいものが うまれるよ',
    outcomes: [
      'bunny_house',
      'flower_special',
      'butterfly_garden',
      'heart_plant',
      'ribbon_tree'
    ],
    baseGrowthTime: 2
  },

  blue: {
    id: 'blue',
    name: 'あおいたね',
    color: '#4A90E2',
    emoji: '🔵',
    rarity: 3, // ★★★☆☆
    description: 'みずのような あおいたね。いけや みずうみが できるよ',
    outcomes: [
      'pond',
      'fountain',
      'frog_house',
      'waterfall',
      'lily_pond'
    ],
    baseGrowthTime: 3
  },

  yellow: {
    id: 'yellow',
    name: 'きいろいたね',
    color: '#FFD700',
    emoji: '🟡',
    rarity: 3, // ★★★☆☆
    description: 'ぴかぴか ひかる たね。おうちや おみせが できるよ',
    outcomes: [
      'house_small',
      'shop',
      'windmill',
      'bakery',
      'flower_shop'
    ],
    baseGrowthTime: 3
  },

  purple: {
    id: 'purple',
    name: 'むらさきのたね',
    color: '#9B59B6',
    emoji: '🟣',
    rarity: 4, // ★★★★☆
    description: 'ふしぎな ちからを もつたね。まほうが おきるよ',
    outcomes: [
      'rainbow',
      'cloud_path',
      'fairy_house',
      'magic_tree',
      'star_flower'
    ],
    baseGrowthTime: 4
  },

  gold: {
    id: 'gold',
    name: 'きんいろのたね',
    color: '#FFD700',
    emoji: '⭐',
    rarity: 5, // ★★★★★
    description: 'でんせつの たね。なにが うまれるかは わからない！',
    outcomes: [
      'castle',
      'dragon',
      'unicorn',
      'phoenix',
      'treasure_tree'
    ],
    baseGrowthTime: 6
  }
};

/**
 * たねIDから情報を取得
 * @param {string} seedId - たねのID
 * @returns {Object|null} たねの情報
 */
export function getSeedById(seedId) {
  return SEEDS[seedId] || null;
}

/**
 * レア度でフィルタリング
 * @param {number} rarity - レア度（1-5）
 * @returns {Array} 該当するたねのリスト
 */
export function getSeedsByRarity(rarity) {
  return Object.values(SEEDS).filter(seed => seed.rarity === rarity);
}

/**
 * たねから生まれる可能性のあるアイテムを取得
 * @param {string} seedId - たねのID
 * @returns {Array} 生まれる可能性のあるアイテムIDリスト
 */
export function getPossibleOutcomes(seedId) {
  const seed = getSeedById(seedId);
  return seed ? seed.outcomes : [];
}

/**
 * ランダムなoutcomeを取得
 * @param {string} seedId - たねのID
 * @returns {string|null} ランダムに選ばれたoutcome ID
 */
export function getRandomOutcome(seedId) {
  const outcomes = getPossibleOutcomes(seedId);
  if (outcomes.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * outcomes.length);
  return outcomes[randomIndex];
}

/**
 * すべてのたねIDリストを取得
 * @returns {Array} たねIDの配列
 */
export function getAllSeedIds() {
  return Object.keys(SEEDS);
}

/**
 * レア度の星表示を取得
 * @param {number} rarity - レア度（1-5）
 * @returns {string} 星表示（例: "★★☆☆☆"）
 */
export function getRarityStars(rarity) {
  const filled = '★'.repeat(rarity);
  const empty = '☆'.repeat(5 - rarity);
  return filled + empty;
}
