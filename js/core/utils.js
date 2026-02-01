/**
 * まほうのにわ - ユーティリティ関数
 *
 * 汎用的なヘルパー関数を提供
 */

// ユニークID生成用カウンター
let idCounter = 0;

/**
 * ユニークIDを生成する
 * @param {string} [prefix='id'] - IDのプレフィックス
 * @returns {string} ユニークID
 */
export function generateId(prefix = 'id') {
  const timestamp = Date.now().toString(36);
  const counter = (idCounter++).toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}_${timestamp}_${counter}_${random}`;
}

/**
 * 配列からランダムに1つ選ぶ
 * @param {Array} array - 配列
 * @returns {*} ランダムに選ばれた要素
 */
export function randomChoice(array) {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 数値を指定範囲内に収める
 * @param {number} value - 値
 * @param {number} min - 最小値
 * @param {number} max - 最大値
 * @returns {number} クランプされた値
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * 2点間の距離を計算
 * @param {number} x1 - 点1のX座標
 * @param {number} y1 - 点1のY座標
 * @param {number} x2 - 点2のX座標
 * @param {number} y2 - 点2のY座標
 * @returns {number} 距離
 */
export function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * ミリ秒を読みやすい形式に変換
 * @param {number} ms - ミリ秒
 * @returns {string} 読みやすい形式（例: "5分", "2時間"）
 */
export function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}時間${minutes % 60}分`;
  } else if (minutes > 0) {
    return `${minutes}分`;
  } else {
    return `${seconds}秒`;
  }
}

/**
 * オブジェクトを深くコピー
 * @param {Object} obj - コピー元オブジェクト
 * @returns {Object} コピーされたオブジェクト
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
