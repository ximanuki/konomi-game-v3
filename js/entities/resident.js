/**
 * まほうのにわ - 住人エンティティ
 *
 * 庭にやってくる動物や妖精たちを管理する
 * なかよし度システム、1日のスケジュール、インタラクションを担当
 */

import { generateId } from '../core/utils.js';

/**
 * 住人のタイプ定義
 * @type {Object}
 */
export const RESIDENT_TYPES = {
  // もりのどうぶつ（森エリアに来る）
  rabbit: {
    name: 'うさぎ',
    category: 'forest',
    rarity: 'common',
    likes: ['carrot', 'flower_pink', 'grass'],
    dialogue: {
      greeting: 'ぴょん！こんにちは！',
      happy: 'うれしいな〜！',
      gift: 'わーい！ありがとう！'
    }
  },
  squirrel: {
    name: 'りす',
    category: 'forest',
    rarity: 'common',
    likes: ['acorn', 'tree', 'mushroom'],
    dialogue: {
      greeting: 'きゅきゅ！',
      happy: 'どんぐり、すき！',
      gift: 'たからものにするね！'
    }
  },
  bird: {
    name: 'ことり',
    category: 'forest',
    rarity: 'common',
    likes: ['seed', 'flower', 'tree'],
    dialogue: {
      greeting: 'ちゅんちゅん！',
      happy: 'おそらたのしい〜！',
      gift: 'ぴぴぴ！'
    }
  },

  // みずのいきもの（湖エリアに来る）
  frog: {
    name: 'かえる',
    category: 'water',
    rarity: 'common',
    likes: ['pond', 'lotus', 'rain'],
    dialogue: {
      greeting: 'けろけろ！',
      happy: 'みずがきもちいいね！',
      gift: 'けろ〜！'
    }
  },
  duck: {
    name: 'あひる',
    category: 'water',
    rarity: 'uncommon',
    likes: ['pond', 'bread', 'flower_blue'],
    dialogue: {
      greeting: 'がーがー！',
      happy: 'およぐのだいすき！',
      gift: 'がが！うれしい！'
    }
  },

  // まちのひと（村を作ると来る）
  cat: {
    name: 'ねこ',
    category: 'town',
    rarity: 'uncommon',
    likes: ['fish', 'ball', 'cushion'],
    dialogue: {
      greeting: 'にゃー。',
      happy: 'ごろごろ...',
      gift: 'にゃ！'
    }
  },
  dog: {
    name: 'いぬ',
    category: 'town',
    rarity: 'uncommon',
    likes: ['bone', 'ball', 'stick'],
    dialogue: {
      greeting: 'わんわん！',
      happy: 'しっぽふりふり！',
      gift: 'わん！ありがとう！'
    }
  },
  bear: {
    name: 'くまのパンやさん',
    category: 'town',
    rarity: 'rare',
    likes: ['honey', 'bread', 'flower'],
    dialogue: {
      greeting: 'いらっしゃい！',
      happy: 'パンがやけたよ！',
      gift: 'とくべつなパンをあげるね！'
    }
  },

  // まほうのいきもの（特別な条件で来る）
  fairy: {
    name: 'ようせい',
    category: 'magic',
    rarity: 'rare',
    likes: ['rainbow', 'flower_special', 'star'],
    dialogue: {
      greeting: 'きらきら〜！',
      happy: 'まほうをかけてあげる！',
      gift: 'ふしぎなちからをわけてあげる！'
    }
  },
  unicorn: {
    name: 'ユニコーン',
    category: 'magic',
    rarity: 'legendary',
    likes: ['rainbow', 'star', 'cloud'],
    dialogue: {
      greeting: 'ひひーん...',
      happy: 'にじのはしをかけてあげる',
      gift: 'とくべつなたねをあげる'
    }
  },

  // でんせつ（超レア）
  dragon: {
    name: 'ドラゴン',
    category: 'legend',
    rarity: 'legendary',
    likes: ['gold', 'gem', 'fire'],
    dialogue: {
      greeting: 'グルルル...',
      happy: 'ともだちになってくれるのか？',
      gift: 'でんせつのたからものだ'
    }
  }
};

/**
 * なかよし度レベル定義
 * @type {Object}
 */
export const FRIENDSHIP_LEVELS = {
  stranger: { min: 0, name: 'はじめまして' },
  acquaintance: { min: 25, name: 'しりあい' },
  friend: { min: 50, name: 'ともだち' },
  bestfriend: { min: 75, name: 'しんゆう' },
  family: { min: 100, name: 'かぞく' }
};

/**
 * 住人クラス
 */
export default class Resident {
  /**
   * 住人を作成する
   * @param {string} type - 住人のタイプ（rabbit, squirrel等）
   * @param {number} x - X座標
   * @param {number} y - Y座標
   */
  constructor(type, x = 0, y = 0) {
    // 基本情報
    this.id = generateId();
    this.type = type;
    this.typeInfo = RESIDENT_TYPES[type] || RESIDENT_TYPES.rabbit;

    // 名前（なかよし度100%で命名可能）
    this.name = null;

    // 位置情報
    this.x = x;
    this.y = y;

    // なかよし度（0-100）
    this.friendship = 0;

    // 気分
    this.mood = 'happy'; // happy, excited, sleepy, hungry

    // 時間記録
    this.arrivedAt = Date.now();
    this.lastInteraction = null;
    this.lastPetTime = null;

    // 1日のスケジュール
    this.schedule = this.generateSchedule();

    // 今日の状態
    this.todayPetCount = 0;
    this.todayGiftReceived = false;

    // 住んでいる建物のID（あれば）
    this.homeId = null;
  }

  /**
   * 表示名を取得（名前があれば名前、なければタイプ名）
   * @returns {string}
   */
  getDisplayName() {
    return this.name || this.typeInfo.name;
  }

  /**
   * なかよし度レベルを取得
   * @returns {string} - 'stranger', 'acquaintance', 'friend', 'bestfriend', 'family'
   */
  getFriendshipLevel() {
    if (this.friendship >= 100) return 'family';
    if (this.friendship >= 75) return 'bestfriend';
    if (this.friendship >= 50) return 'friend';
    if (this.friendship >= 25) return 'acquaintance';
    return 'stranger';
  }

  /**
   * なかよし度レベル名を日本語で取得
   * @returns {string}
   */
  getFriendshipLevelName() {
    const level = this.getFriendshipLevel();
    return FRIENDSHIP_LEVELS[level].name;
  }

  /**
   * 名前をつけられるか（なかよし度100%）
   * @returns {boolean}
   */
  canBeNamed() {
    return this.friendship >= 100 && this.name === null;
  }

  /**
   * 名前をつける
   * @param {string} newName - 新しい名前
   * @returns {boolean} - 成功したらtrue
   */
  setName(newName) {
    if (!this.canBeNamed()) return false;
    this.name = newName;
    return true;
  }

  /**
   * 1日のスケジュールを生成
   * @returns {Object}
   */
  generateSchedule() {
    const morningActivities = ['walk', 'garden', 'home', 'explore'];
    const afternoonActivities = ['work', 'play', 'visit', 'nap'];
    const eveningActivities = ['shop', 'chat', 'home', 'stroll'];

    return {
      morning: this.randomActivity(morningActivities),
      afternoon: this.randomActivity(afternoonActivities),
      evening: this.randomActivity(eveningActivities),
      night: 'sleep'
    };
  }

  /**
   * ランダムなアクティビティを選ぶ
   * @param {string[]} activities - アクティビティの配列
   * @returns {string}
   */
  randomActivity(activities) {
    return activities[Math.floor(Math.random() * activities.length)];
  }

  /**
   * 現在の行動を取得
   * @param {number} hour - 時刻（0-23）、省略時は現在時刻
   * @returns {string}
   */
  getCurrentActivity(hour = null) {
    if (hour === null) {
      hour = new Date().getHours();
    }

    if (hour >= 6 && hour < 10) return this.schedule.morning;
    if (hour >= 10 && hour < 16) return this.schedule.afternoon;
    if (hour >= 16 && hour < 20) return this.schedule.evening;
    return this.schedule.night;
  }

  /**
   * 現在の時間帯を取得
   * @returns {string} - 'morning', 'afternoon', 'evening', 'night'
   */
  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 16) return 'afternoon';
    if (hour >= 16 && hour < 20) return 'evening';
    return 'night';
  }

  /**
   * 住人をなでる
   * @returns {Object} - 結果とメッセージ
   */
  pet() {
    const now = Date.now();

    // 1日3回までなでられる
    if (this.todayPetCount >= 3) {
      return {
        success: false,
        message: 'きょうはもうたくさんなでてもらったよ！',
        friendshipGain: 0
      };
    }

    // なかよし度UP（毎日会いに行くと+5%）
    const gain = 5;
    this.friendship = Math.min(100, this.friendship + gain);
    this.lastInteraction = now;
    this.lastPetTime = now;
    this.mood = 'happy';
    this.todayPetCount++;

    return {
      success: true,
      message: this.typeInfo.dialogue.happy,
      friendshipGain: gain
    };
  }

  /**
   * プレゼントをあげる
   * @param {string} itemType - アイテムのタイプ
   * @returns {Object} - 結果とメッセージ
   */
  giveGift(itemType) {
    // 1日1回まで
    if (this.todayGiftReceived) {
      return {
        success: false,
        message: 'きょうはもうプレゼントもらったよ！また明日ね！',
        friendshipGain: 0
      };
    }

    // 好きなものかどうかでボーナス
    const isLiked = this.likesItem(itemType);
    const gain = isLiked ? 15 : 10;

    this.friendship = Math.min(100, this.friendship + gain);
    this.lastInteraction = Date.now();
    this.mood = 'excited';
    this.todayGiftReceived = true;

    return {
      success: true,
      message: this.typeInfo.dialogue.gift,
      friendshipGain: gain,
      isLikedItem: isLiked
    };
  }

  /**
   * アイテムが好きかどうか
   * @param {string} itemType - アイテムのタイプ
   * @returns {boolean}
   */
  likesItem(itemType) {
    return this.typeInfo.likes.includes(itemType);
  }

  /**
   * 挨拶メッセージを取得
   * @returns {string}
   */
  getGreeting() {
    return this.typeInfo.dialogue.greeting;
  }

  /**
   * 毎日のリセット（新しい日になったら呼ぶ）
   */
  resetDaily() {
    this.todayPetCount = 0;
    this.todayGiftReceived = false;
    this.schedule = this.generateSchedule();
  }

  /**
   * 位置を更新
   * @param {number} x - 新しいX座標
   * @param {number} y - 新しいY座標
   */
  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * 家を設定
   * @param {string} buildingId - 建物のID
   */
  setHome(buildingId) {
    this.homeId = buildingId;
  }

  /**
   * セーブ用データを取得
   * @returns {Object}
   */
  toSaveData() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      x: this.x,
      y: this.y,
      friendship: this.friendship,
      mood: this.mood,
      arrivedAt: this.arrivedAt,
      lastInteraction: this.lastInteraction,
      homeId: this.homeId,
      todayPetCount: this.todayPetCount,
      todayGiftReceived: this.todayGiftReceived
    };
  }

  /**
   * セーブデータから復元
   * @param {Object} data - セーブデータ
   * @returns {Resident}
   */
  static fromSaveData(data) {
    const resident = new Resident(data.type, data.x, data.y);
    resident.id = data.id;
    resident.name = data.name;
    resident.friendship = data.friendship;
    resident.mood = data.mood;
    resident.arrivedAt = data.arrivedAt;
    resident.lastInteraction = data.lastInteraction;
    resident.homeId = data.homeId;
    resident.todayPetCount = data.todayPetCount || 0;
    resident.todayGiftReceived = data.todayGiftReceived || false;
    return resident;
  }
}
