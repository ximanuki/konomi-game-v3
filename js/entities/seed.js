/**
 * まほうのにわ - たねエンティティ
 *
 * たね（Seed）クラス
 * - 7種類のたね: green, brown, pink, blue, yellow, purple, gold
 * - 各たねから生まれるもののリスト（outcomes）
 * - ランダム結果取得
 */

// ユニークID生成
let seedIdCounter = 0;

/**
 * ユニークIDを生成する
 * @returns {string} ユニークID
 */
export function generateId() {
  const timestamp = Date.now().toString(36);
  const counter = (seedIdCounter++).toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `seed_${timestamp}_${counter}_${random}`;
}

/**
 * たねの種類
 * @typedef {'green' | 'brown' | 'pink' | 'blue' | 'yellow' | 'purple' | 'gold'} SeedType
 */

/**
 * たねクラス
 */
export class Seed {
  /**
   * @param {SeedType} type - たねの種類
   */
  constructor(type) {
    /** @type {string} ユニークID */
    this.id = generateId();

    /** @type {SeedType} たねの種類 */
    this.type = type;

    /** @type {number} 作成日時（ミリ秒） */
    this.createdAt = Date.now();
  }

  /**
   * たねから生まれるもののリスト
   * GDD.md の設計に基づく
   *
   * 🟢 みどり: 花、草、野菜
   * 🟤 ちゃいろ: 木、森、きのこ
   * 🩷 ピンク: かわいいもの（うさぎのおうち等）
   * 🔵 あお: 水関連（池、噴水）
   * 🟡 きいろ: たてもの（家、お店）
   * 🟣 むらさき: まほう（虹、雲の道）
   * ⭐ きんいろ: でんせつ（城、ドラゴン）
   */
  static outcomes = {
    green: [
      'flower_red',      // あかいおはな
      'flower_blue',     // あおいおはな
      'flower_yellow',   // きいろいおはな
      'flower_white',    // しろいおはな
      'grass',           // くさ
      'clover',          // クローバー
      'vegetable_carrot', // にんじん
      'vegetable_tomato'  // トマト
    ],
    brown: [
      'tree_small',      // ちいさいき
      'tree_large',      // おおきいき
      'tree_apple',      // りんごのき
      'tree_cherry',     // さくらのき
      'mushroom_red',    // あかいきのこ
      'mushroom_brown',  // ちゃいろきのこ
      'stump'            // きりかぶ
    ],
    pink: [
      'bunny_house',     // うさぎのおうち
      'flower_special',  // とくべつなおはな
      'butterfly',       // ちょうちょ
      'heart_tree',      // ハートのき
      'ribbon_flower',   // リボンフラワー
      'candy_bush'       // キャンディのしげみ
    ],
    blue: [
      'pond_small',      // ちいさいいけ
      'pond_large',      // おおきいいけ
      'fountain',        // ふんすい
      'frog_house',      // かえるのおうち
      'water_lily',      // すいれん
      'stream'           // おがわ
    ],
    yellow: [
      'house_small',     // ちいさいおうち
      'house_large',     // おおきいおうち
      'shop',            // おみせ
      'windmill',        // ふうしゃ
      'bakery',          // パンや
      'cafe'             // カフェ
    ],
    purple: [
      'rainbow',         // にじ
      'cloud_path',      // くものみち
      'fairy_house',     // ようせいのおうち
      'magic_flower',    // まほうのはな
      'star_tree',       // ほしのき
      'moon_well'        // つきのいど
    ],
    gold: [
      'castle',          // おしろ
      'dragon',          // ドラゴン
      'unicorn',         // ユニコーン
      'phoenix',         // フェニックス
      'treasure_tree',   // たからのき
      'legendary_garden' // でんせつのにわ
    ]
  };

  /**
   * たねの入手難度（★の数）
   * GDD.md の設計に基づく
   */
  static rarity = {
    green: 1,   // ★☆☆☆☆
    brown: 2,   // ★★☆☆☆
    pink: 2,    // ★★☆☆☆
    blue: 3,    // ★★★☆☆
    yellow: 3,  // ★★★☆☆
    purple: 4,  // ★★★★☆
    gold: 5     // ★★★★★
  };

  /**
   * たねの表示名（日本語）
   */
  static displayNames = {
    green: 'みどりのたね',
    brown: 'ちゃいろのたね',
    pink: 'ピンクのたね',
    blue: 'あおのたね',
    yellow: 'きいろのたね',
    purple: 'むらさきのたね',
    gold: 'きんいろのたね'
  };

  /**
   * たねの絵文字
   */
  static emojis = {
    green: '🟢',
    brown: '🟤',
    pink: '🩷',
    blue: '🔵',
    yellow: '🟡',
    purple: '🟣',
    gold: '⭐'
  };

  /**
   * ランダムな結果を取得
   * @returns {string} 生まれるものの種類
   */
  getRandomOutcome() {
    const outcomes = Seed.outcomes[this.type];
    if (!outcomes || outcomes.length === 0) {
      console.warn(`Unknown seed type: ${this.type}`);
      return 'unknown';
    }
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  }

  /**
   * たねの入手難度を取得
   * @returns {number} 難度（1-5）
   */
  getRarity() {
    return Seed.rarity[this.type] || 1;
  }

  /**
   * たねの表示名を取得
   * @returns {string} 表示名
   */
  getDisplayName() {
    return Seed.displayNames[this.type] || this.type;
  }

  /**
   * たねの絵文字を取得
   * @returns {string} 絵文字
   */
  getEmoji() {
    return Seed.emojis[this.type] || '🌱';
  }

  /**
   * シリアライズ（保存用）
   * @returns {object} シリアライズされたデータ
   */
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      createdAt: this.createdAt
    };
  }

  /**
   * デシリアライズ（復元用）
   * @param {object} data - シリアライズされたデータ
   * @returns {Seed} 復元されたSeedインスタンス
   */
  static fromJSON(data) {
    const seed = new Seed(data.type);
    seed.id = data.id;
    seed.createdAt = data.createdAt;
    return seed;
  }

  /**
   * 有効なたねタイプかチェック
   * @param {string} type - チェックするタイプ
   * @returns {boolean} 有効かどうか
   */
  static isValidType(type) {
    return type in Seed.outcomes;
  }

  /**
   * 全てのたねタイプを取得
   * @returns {string[]} たねタイプの配列
   */
  static getAllTypes() {
    return Object.keys(Seed.outcomes);
  }
}

export default Seed;
