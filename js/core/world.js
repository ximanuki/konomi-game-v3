/**
 * World - 世界管理システム
 *
 * ゲーム世界のエリアとオブジェクトを管理する。
 * 空間グリッドを使用した効率的な位置検索を実装。
 *
 * @module core/world
 */

/**
 * 空間グリッド（効率的な位置検索）
 *
 * 2D空間をセルに分割し、オブジェクトの位置検索を高速化する。
 * O(n)の全探索ではなく、該当セルのみを検索することでパフォーマンスを向上。
 *
 * @class SpatialGrid
 */
export class SpatialGrid {
  /**
   * @param {number} width - エリアの幅（px）
   * @param {number} height - エリアの高さ（px）
   * @param {number} cellSize - セルのサイズ（px）。デフォルト50px
   */
  constructor(width, height, cellSize = 50) {
    this.cellSize = cellSize;
    this.cols = Math.ceil(width / cellSize);
    this.rows = Math.ceil(height / cellSize);
    this.cells = new Map();
  }

  /**
   * 座標からセルのキーを取得
   *
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @returns {string} セルキー（例: "3,5"）
   */
  getCellKey(x, y) {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);
    return `${col},${row}`;
  }

  /**
   * オブジェクトをグリッドに追加
   *
   * @param {Object} object - オブジェクト（x, y プロパティ必須）
   */
  insert(object) {
    const key = this.getCellKey(object.x, object.y);
    if (!this.cells.has(key)) {
      this.cells.set(key, []);
    }
    this.cells.get(key).push(object);
  }

  /**
   * 指定位置からオブジェクトを検索（半径指定）
   *
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @param {number} radius - 検索半径（px）
   * @returns {Array<Object>} 検索範囲内のオブジェクト配列
   */
  query(x, y, radius) {
    const results = [];
    const minCol = Math.floor((x - radius) / this.cellSize);
    const maxCol = Math.floor((x + radius) / this.cellSize);
    const minRow = Math.floor((y - radius) / this.cellSize);
    const maxRow = Math.floor((y + radius) / this.cellSize);

    for (let col = minCol; col <= maxCol; col++) {
      for (let row = minRow; row <= maxRow; row++) {
        const key = `${col},${row}`;
        const cell = this.cells.get(key);
        if (cell) {
          for (const obj of cell) {
            const dist = Math.hypot(obj.x - x, obj.y - y);
            if (dist <= radius) {
              results.push(obj);
            }
          }
        }
      }
    }
    return results;
  }

  /**
   * オブジェクトを削除
   *
   * @param {Object} object - 削除するオブジェクト
   * @returns {boolean} 削除成功したか
   */
  remove(object) {
    const key = this.getCellKey(object.x, object.y);
    const cell = this.cells.get(key);
    if (!cell) return false;

    const index = cell.findIndex(obj => obj.id === object.id);
    if (index === -1) return false;

    cell.splice(index, 1);
    return true;
  }

  /**
   * グリッドをクリア
   */
  clear() {
    this.cells.clear();
  }
}

/**
 * World - ゲーム世界管理
 *
 * エリア、オブジェクト、空間検索を管理する中心クラス。
 *
 * @class World
 */
export class World {
  constructor() {
    // エリアのマップ（key: エリア名, value: エリアデータ）
    this.areas = new Map();

    // 現在のエリア
    this.currentArea = 'garden';

    // オブジェクトIDとオブジェクトのマップ
    this.objectsById = new Map();

    // 初期エリア設定
    this.initArea('garden', { width: 1000, height: 800 });
  }

  /**
   * エリアを初期化
   *
   * @param {string} name - エリア名（'garden', 'forest', 'lake', 'cave', 'sky', 'secret'）
   * @param {Object} size - エリアサイズ { width, height }
   */
  initArea(name, size) {
    this.areas.set(name, {
      name: name,
      width: size.width,
      height: size.height,
      objects: [],
      grid: new SpatialGrid(size.width, size.height, 50), // 50pxグリッド
      unlocked: name === 'garden' // 庭のみ初期解放
    });
  }

  /**
   * エリアを解放
   *
   * @param {string} areaName - エリア名
   * @returns {boolean} 成功したか
   */
  unlockArea(areaName) {
    const area = this.areas.get(areaName);
    if (!area) {
      console.warn(`Area not found: ${areaName}`);
      return false;
    }

    area.unlocked = true;
    return true;
  }

  /**
   * エリアが解放されているか確認
   *
   * @param {string} areaName - エリア名
   * @returns {boolean}
   */
  isAreaUnlocked(areaName) {
    const area = this.areas.get(areaName);
    return area ? area.unlocked : false;
  }

  /**
   * オブジェクトを追加
   *
   * @param {string} areaName - エリア名
   * @param {Object} object - オブジェクト（id, x, y プロパティ必須）
   * @returns {boolean} 成功したか
   */
  addObject(areaName, object) {
    const area = this.areas.get(areaName);
    if (!area) {
      console.warn(`Area not found: ${areaName}`);
      return false;
    }

    // オブジェクトに必須プロパティがあるか確認
    if (!object.id || object.x === undefined || object.y === undefined) {
      console.error('Object must have id, x, and y properties');
      return false;
    }

    area.objects.push(object);
    area.grid.insert(object);
    this.objectsById.set(object.id, { object, areaName });

    return true;
  }

  /**
   * オブジェクトを削除
   *
   * @param {string} objectId - オブジェクトID
   * @returns {boolean} 成功したか
   */
  removeObject(objectId) {
    const entry = this.objectsById.get(objectId);
    if (!entry) return false;

    const { object, areaName } = entry;
    const area = this.areas.get(areaName);
    if (!area) return false;

    // オブジェクト配列から削除
    const index = area.objects.findIndex(obj => obj.id === objectId);
    if (index !== -1) {
      area.objects.splice(index, 1);
    }

    // グリッドから削除
    area.grid.remove(object);

    // マップから削除
    this.objectsById.delete(objectId);

    return true;
  }

  /**
   * 位置からオブジェクトを検索（現在のエリア）
   *
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @param {number} [radius=30] - 検索半径（px）
   * @returns {Array<Object>} 検索範囲内のオブジェクト配列
   */
  getObjectAt(x, y, radius = 30) {
    const area = this.areas.get(this.currentArea);
    if (!area) return [];

    return area.grid.query(x, y, radius);
  }

  /**
   * 近くのオブジェクトを取得（組み合わせ判定用）
   *
   * @param {Object} object - 基準オブジェクト
   * @param {number} [radius=100] - 検索半径（px）
   * @returns {Array<Object>} 周囲のオブジェクト配列（自身を除く）
   */
  getNearbyObjects(object, radius = 100) {
    const entry = this.objectsById.get(object.id);
    if (!entry) return [];

    const area = this.areas.get(entry.areaName);
    if (!area) return [];

    return area.grid.query(object.x, object.y, radius)
      .filter(obj => obj.id !== object.id);
  }

  /**
   * IDからオブジェクトを取得
   *
   * @param {string} objectId - オブジェクトID
   * @returns {Object|null} オブジェクト（存在しない場合null）
   */
  getObject(objectId) {
    const entry = this.objectsById.get(objectId);
    return entry ? entry.object : null;
  }

  /**
   * エリアの全オブジェクトを取得
   *
   * @param {string} [areaName=this.currentArea] - エリア名
   * @returns {Array<Object>} オブジェクト配列
   */
  getObjectsInArea(areaName = this.currentArea) {
    const area = this.areas.get(areaName);
    return area ? area.objects : [];
  }

  /**
   * 全エリアの全オブジェクトを取得
   *
   * @returns {Array<Object>} オブジェクト配列
   */
  getAllObjects() {
    const allObjects = [];
    for (const area of this.areas.values()) {
      allObjects.push(...area.objects);
    }
    return allObjects;
  }

  /**
   * 現在のエリアを変更
   *
   * @param {string} areaName - エリア名
   * @returns {boolean} 成功したか
   */
  setCurrentArea(areaName) {
    if (!this.areas.has(areaName)) {
      console.warn(`Area not found: ${areaName}`);
      return false;
    }

    if (!this.isAreaUnlocked(areaName)) {
      console.warn(`Area is locked: ${areaName}`);
      return false;
    }

    this.currentArea = areaName;
    return true;
  }

  /**
   * 現在のエリアを取得
   *
   * @returns {Object|null} エリアデータ
   */
  getCurrentArea() {
    return this.areas.get(this.currentArea) || null;
  }

  /**
   * オブジェクトの位置を更新（グリッド再配置）
   *
   * @param {string} objectId - オブジェクトID
   * @param {number} newX - 新しいX座標
   * @param {number} newY - 新しいY座標
   * @returns {boolean} 成功したか
   */
  updateObjectPosition(objectId, newX, newY) {
    const entry = this.objectsById.get(objectId);
    if (!entry) return false;

    const { object, areaName } = entry;
    const area = this.areas.get(areaName);
    if (!area) return false;

    // グリッドから一旦削除
    area.grid.remove(object);

    // 位置更新
    object.x = newX;
    object.y = newY;

    // グリッドに再追加
    area.grid.insert(object);

    return true;
  }
}

// シングルトンインスタンスをエクスポート
export const world = new World();
