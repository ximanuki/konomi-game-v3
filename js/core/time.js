/**
 * TimeManager - 時間管理クラス
 * リアルタイム連動、オフライン経過時間計算、時間帯・季節判定
 */

import { Storage } from './storage.js';

export class TimeManager {
  /**
   * アプリ復帰時の経過時間計算
   * @returns {{hours: number, isNewDay: boolean}} オフライン経過時間と日付変更フラグ
   */
  static calculateOfflineProgress() {
    const lastAccess = Storage.get('lastAccess');
    if (!lastAccess) {
      return { hours: 0, isNewDay: true };
    }

    const now = Date.now();
    const elapsed = now - lastAccess;
    const hours = elapsed / (1000 * 60 * 60);

    // 日付が変わったか判定
    const lastDate = new Date(lastAccess).toDateString();
    const today = new Date().toDateString();
    const isNewDay = lastDate !== today;

    return { hours, isNewDay };
  }

  /**
   * 現在の時間帯を取得
   * @returns {'morning'|'afternoon'|'evening'|'night'} 時間帯
   */
  static getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 16) return 'afternoon';
    if (hour >= 16 && hour < 20) return 'evening';
    return 'night';
  }

  /**
   * 現在の季節を取得
   * @returns {'spring'|'summer'|'autumn'|'winter'} 季節
   */
  static getSeason() {
    const month = new Date().getMonth() + 1; // 0-11 → 1-12
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  /**
   * 現在時刻（24時間形式）を取得
   * @returns {number} 現在の時刻（0-23）
   */
  static getHour() {
    return new Date().getHours();
  }

  /**
   * 日付が変わったかどうかを判定
   * @param {number} lastAccess - 最終アクセス時刻（タイムスタンプ）
   * @returns {boolean} 日付が変わった場合 true
   */
  static isNewDay(lastAccess) {
    if (!lastAccess) return true;

    const lastDate = new Date(lastAccess).toDateString();
    const today = new Date().toDateString();
    return lastDate !== today;
  }

  /**
   * アクセス時刻を保存
   */
  static saveAccess() {
    Storage.set('lastAccess', Date.now());
  }

  /**
   * 最終アクセス時刻を取得
   * @returns {number|null} 最終アクセス時刻（タイムスタンプ）、未保存の場合 null
   */
  static getLastAccess() {
    return Storage.get('lastAccess', null);
  }
}
