/**
 * まほうのにわ - 建物エンティティ
 *
 * 庭に建てられる建物を管理する
 * 住人の住居、お店、施設などを担当
 */

import { generateId } from '../core/utils.js';

/**
 * 建物のタイプ定義
 * @type {Object}
 */
export const BUILDING_TYPES = {
  // 住居系（住人が住む）
  house_small: {
    name: 'ちいさいおうち',
    category: 'house',
    capacity: 1,          // 住める住人の数
    size: { width: 2, height: 2 },
    seedRequired: 'yellow',
    description: 'ちいさくてかわいいおうち'
  },
  house_medium: {
    name: 'おうち',
    category: 'house',
    capacity: 2,
    size: { width: 3, height: 3 },
    seedRequired: 'yellow',
    description: 'ふつうのおおきさのおうち'
  },
  house_large: {
    name: 'おおきいおうち',
    category: 'house',
    capacity: 4,
    size: { width: 4, height: 4 },
    seedRequired: 'yellow',
    description: 'かぞくでくらせるおおきいおうち'
  },

  // うさぎ用
  bunny_house: {
    name: 'うさぎのおうち',
    category: 'house',
    capacity: 2,
    size: { width: 2, height: 2 },
    seedRequired: 'pink',
    residentType: 'rabbit',
    description: 'うさぎがすむかわいいおうち'
  },

  // かえる用
  frog_house: {
    name: 'かえるのおうち',
    category: 'house',
    capacity: 2,
    size: { width: 2, height: 2 },
    seedRequired: 'blue',
    residentType: 'frog',
    description: 'みずべのかえるのおうち'
  },

  // ようせい用
  fairy_house: {
    name: 'ようせいのおうち',
    category: 'house',
    capacity: 1,
    size: { width: 2, height: 2 },
    seedRequired: 'purple',
    residentType: 'fairy',
    description: 'きらきらひかるふしぎなおうち'
  },

  // 施設系（特別な機能がある）
  shop: {
    name: 'おみせ',
    category: 'facility',
    capacity: 1,
    size: { width: 3, height: 3 },
    seedRequired: 'yellow',
    function: 'trading',
    description: 'たねやアイテムをかえるおみせ'
  },
  windmill: {
    name: 'ふうしゃ',
    category: 'facility',
    capacity: 0,
    size: { width: 3, height: 3 },
    seedRequired: 'yellow',
    function: 'decoration',
    description: 'くるくるまわるふうしゃ'
  },
  well: {
    name: 'いど',
    category: 'facility',
    capacity: 0,
    size: { width: 1, height: 1 },
    seedRequired: 'blue',
    function: 'watering',
    description: 'みずをくめるいど'
  },

  // 特別な建物
  castle: {
    name: 'おしろ',
    category: 'special',
    capacity: 10,
    size: { width: 5, height: 5 },
    seedRequired: 'gold',
    description: 'でんせつのおしろ！',
    rarity: 'legendary'
  },
  tower: {
    name: 'まほうのとう',
    category: 'special',
    capacity: 1,
    size: { width: 2, height: 4 },
    seedRequired: 'purple',
    description: 'まほうつかいがすむとう',
    rarity: 'rare'
  }
};

/**
 * 建物クラス
 */
export default class Building {
  /**
   * 建物を作成する
   * @param {string} type - 建物のタイプ（house_small, shop等）
   * @param {number} x - X座標
   * @param {number} y - Y座標
   */
  constructor(type, x = 0, y = 0) {
    // 基本情報
    this.id = generateId();
    this.type = type;
    this.typeInfo = BUILDING_TYPES[type] || BUILDING_TYPES.house_small;

    // 位置情報
    this.x = x;
    this.y = y;

    // 建設状態
    this.isBuilt = false;      // 建設完了フラグ
    this.buildProgress = 0;    // 建設進捗（0-100）
    this.builtAt = null;       // 建設完了日時

    // 住人管理
    this.residents = [];       // 住んでいる住人のIDリスト

    // カスタマイズ
    this.color = null;         // 外壁の色（将来機能）
    this.decoration = null;    // 飾り（将来機能）
  }

  /**
   * 表示名を取得
   * @returns {string}
   */
  getDisplayName() {
    return this.typeInfo.name;
  }

  /**
   * サイズを取得
   * @returns {Object} - { width, height }
   */
  getSize() {
    return this.typeInfo.size;
  }

  /**
   * 住人を受け入れられるか
   * @returns {boolean}
   */
  canAcceptResident() {
    if (!this.isBuilt) return false;
    if (this.typeInfo.category !== 'house') return false;
    return this.residents.length < this.typeInfo.capacity;
  }

  /**
   * 空き部屋の数を取得
   * @returns {number}
   */
  getVacancy() {
    if (this.typeInfo.category !== 'house') return 0;
    return this.typeInfo.capacity - this.residents.length;
  }

  /**
   * 特定タイプの住人専用かチェック
   * @returns {string|null} - 専用住人タイプ、または null
   */
  getResidentTypeRestriction() {
    return this.typeInfo.residentType || null;
  }

  /**
   * 住人が入居可能かチェック
   * @param {string} residentType - 住人のタイプ
   * @returns {boolean}
   */
  canResidentMoveIn(residentType) {
    if (!this.canAcceptResident()) return false;

    const restriction = this.getResidentTypeRestriction();
    if (restriction && restriction !== residentType) {
      return false;
    }

    return true;
  }

  /**
   * 住人を追加
   * @param {string} residentId - 住人のID
   * @returns {boolean} - 成功したらtrue
   */
  addResident(residentId) {
    if (!this.canAcceptResident()) return false;
    if (this.residents.includes(residentId)) return false;

    this.residents.push(residentId);
    return true;
  }

  /**
   * 住人を削除
   * @param {string} residentId - 住人のID
   * @returns {boolean} - 成功したらtrue
   */
  removeResident(residentId) {
    const index = this.residents.indexOf(residentId);
    if (index === -1) return false;

    this.residents.splice(index, 1);
    return true;
  }

  /**
   * 建設を開始
   */
  startBuilding() {
    this.isBuilt = false;
    this.buildProgress = 0;
  }

  /**
   * 建設を進める
   * @param {number} progress - 追加する進捗（0-100）
   * @returns {boolean} - 完成したらtrue
   */
  addBuildProgress(progress) {
    this.buildProgress = Math.min(100, this.buildProgress + progress);

    if (this.buildProgress >= 100) {
      this.completeBuilding();
      return true;
    }
    return false;
  }

  /**
   * 建設を完了
   */
  completeBuilding() {
    this.isBuilt = true;
    this.buildProgress = 100;
    this.builtAt = Date.now();
  }

  /**
   * 即時建設（たねから直接生まれた場合）
   */
  instantBuild() {
    this.completeBuilding();
  }

  /**
   * 施設の機能を取得
   * @returns {string|null}
   */
  getFunction() {
    return this.typeInfo.function || null;
  }

  /**
   * レア度を取得
   * @returns {string}
   */
  getRarity() {
    return this.typeInfo.rarity || 'common';
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
   * 建物の占有範囲を取得
   * @returns {Object} - { x1, y1, x2, y2 }
   */
  getBounds() {
    const size = this.getSize();
    return {
      x1: this.x,
      y1: this.y,
      x2: this.x + size.width,
      y2: this.y + size.height
    };
  }

  /**
   * 指定座標が建物の範囲内かチェック
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @returns {boolean}
   */
  containsPoint(x, y) {
    const bounds = this.getBounds();
    return x >= bounds.x1 && x < bounds.x2 &&
           y >= bounds.y1 && y < bounds.y2;
  }

  /**
   * 他の建物と重なっているかチェック
   * @param {Building} other - 他の建物
   * @returns {boolean}
   */
  overlaps(other) {
    const a = this.getBounds();
    const b = other.getBounds();

    return !(a.x2 <= b.x1 || b.x2 <= a.x1 ||
             a.y2 <= b.y1 || b.y2 <= a.y1);
  }

  /**
   * セーブ用データを取得
   * @returns {Object}
   */
  toSaveData() {
    return {
      id: this.id,
      type: this.type,
      x: this.x,
      y: this.y,
      isBuilt: this.isBuilt,
      buildProgress: this.buildProgress,
      builtAt: this.builtAt,
      residents: [...this.residents],
      color: this.color,
      decoration: this.decoration
    };
  }

  /**
   * セーブデータから復元
   * @param {Object} data - セーブデータ
   * @returns {Building}
   */
  static fromSaveData(data) {
    const building = new Building(data.type, data.x, data.y);
    building.id = data.id;
    building.isBuilt = data.isBuilt;
    building.buildProgress = data.buildProgress;
    building.builtAt = data.builtAt;
    building.residents = data.residents || [];
    building.color = data.color;
    building.decoration = data.decoration;
    return building;
  }
}

/**
 * 建物タイプ一覧を取得（カテゴリ別）
 * @param {string} category - カテゴリ（house, facility, special）
 * @returns {string[]} - 建物タイプのリスト
 */
export function getBuildingTypesByCategory(category) {
  return Object.keys(BUILDING_TYPES).filter(
    type => BUILDING_TYPES[type].category === category
  );
}

/**
 * たねから作れる建物タイプを取得
 * @param {string} seedType - たねのタイプ
 * @returns {string[]} - 建物タイプのリスト
 */
export function getBuildingTypesBySeed(seedType) {
  return Object.keys(BUILDING_TYPES).filter(
    type => BUILDING_TYPES[type].seedRequired === seedType
  );
}
