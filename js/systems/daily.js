/**
 * DailySystem - デイリーシステム
 * ログインボーナス、連続ログイン、ランダム訪問者、日付変更処理
 */

import { Storage } from '../core/storage.js';
import { TimeManager } from '../core/time.js';

export class DailySystem {
  /**
   * デイリーボーナスの定義
   * @returns {Array<{day: number, seeds: number, bonus: string|null}>}
   */
  static getBonusTable() {
    return [
      { day: 1, seeds: 1, bonus: null },
      { day: 2, seeds: 2, bonus: null },
      { day: 3, seeds: 3, bonus: null },
      { day: 4, seeds: 4, bonus: null },
      { day: 5, seeds: 5, bonus: null },
      { day: 6, seeds: 5, bonus: 'rare_seed' },
      { day: 7, seeds: 5, bonus: 'legendary_seed' }
    ];
  }

  /**
   * ランダム訪問者の定義
   * @returns {Array<{id: string, name: string, probability: number, gift: string}>}
   */
  static getVisitorTable() {
    return [
      { id: 'seed_shop', name: 'たねや', probability: 30, gift: 'rare_seeds_sale' },
      { id: 'traveler', name: 'たびびと', probability: 20, gift: 'foreign_seed' },
      { id: 'wizard', name: 'まほうつかい', probability: 10, gift: 'magic_seed' },
      { id: 'fairy_king', name: 'ようせいのおうさま', probability: 5, gift: 'legendary_seed' },
      { id: 'mystery', name: '？？？', probability: 1, gift: 'mystery_gift' }
    ];
  }

  /**
   * ログインボーナスを確認
   * @returns {{available: boolean, streak: number, bonus: Object|null, claimed: boolean}}
   */
  static checkLoginBonus() {
    const dailyData = this.getDailyData();
    const { isNewDay } = TimeManager.calculateOfflineProgress();

    // 日付変更があった場合、リセット処理
    if (isNewDay && dailyData.lastLogin) {
      this.checkDailyReset();
    }

    const streak = this.getStreak();
    const bonusTable = this.getBonusTable();
    const bonusDay = ((streak - 1) % 7) + 1; // 1-7の循環
    const bonus = bonusTable.find(b => b.day === bonusDay);

    return {
      available: !dailyData.bonusClaimed,
      streak,
      bonus,
      claimed: dailyData.bonusClaimed
    };
  }

  /**
   * ボーナスを受け取る
   * @returns {{success: boolean, seeds: number, bonus: string|null}}
   */
  static claimBonus() {
    const dailyData = this.getDailyData();

    // 既に受け取り済み
    if (dailyData.bonusClaimed) {
      return { success: false, seeds: 0, bonus: null };
    }

    const bonusInfo = this.checkLoginBonus();
    if (!bonusInfo.available || !bonusInfo.bonus) {
      return { success: false, seeds: 0, bonus: null };
    }

    // ボーナス受け取り処理
    dailyData.bonusClaimed = true;
    dailyData.lastClaimed = Date.now();
    this.saveDailyData(dailyData);

    return {
      success: true,
      seeds: bonusInfo.bonus.seeds,
      bonus: bonusInfo.bonus.bonus
    };
  }

  /**
   * 連続ログイン日数を取得
   * @returns {number} 連続ログイン日数
   */
  static getStreak() {
    const dailyData = this.getDailyData();
    return dailyData.streak || 1;
  }

  /**
   * ランダム訪問者を取得（1日1回）
   * @returns {Object|null} 訪問者情報 {id, name, gift}
   */
  static getRandomVisitor() {
    const dailyData = this.getDailyData();
    const today = new Date().toDateString();

    // 今日の訪問者が既に決定済み
    if (dailyData.todayVisitor && dailyData.visitorDate === today) {
      return dailyData.todayVisitor;
    }

    // 新しい訪問者を抽選
    const visitor = this.rollVisitor();

    // 保存
    dailyData.todayVisitor = visitor;
    dailyData.visitorDate = today;
    this.saveDailyData(dailyData);

    return visitor;
  }

  /**
   * 訪問者を抽選
   * @returns {Object|null} 訪問者情報、または null（訪問者なし）
   */
  static rollVisitor() {
    const visitorTable = this.getVisitorTable();
    const roll = Math.random() * 100;

    let cumulative = 0;
    for (const visitor of visitorTable) {
      cumulative += visitor.probability;
      if (roll < cumulative) {
        return {
          id: visitor.id,
          name: visitor.name,
          gift: visitor.gift
        };
      }
    }

    // 訪問者なし（確率的に34%）
    return null;
  }

  /**
   * 日付変更処理
   * 連続ログイン判定、デイリーリセット
   */
  static checkDailyReset() {
    const dailyData = this.getDailyData();
    const lastLogin = dailyData.lastLogin;

    if (!lastLogin) {
      // 初回ログイン
      dailyData.streak = 1;
      dailyData.lastLogin = Date.now();
      dailyData.bonusClaimed = false;
      this.saveDailyData(dailyData);
      return;
    }

    const { isNewDay } = TimeManager.calculateOfflineProgress();

    if (isNewDay) {
      // 日付が変わった
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      const lastLoginStr = new Date(lastLogin).toDateString();

      // 昨日ログインしていた場合、連続ログイン継続
      if (lastLoginStr === yesterdayStr) {
        dailyData.streak = (dailyData.streak || 0) + 1;
      } else {
        // 途切れた場合、1からやり直し
        dailyData.streak = 1;
      }

      // デイリーリセット
      dailyData.lastLogin = Date.now();
      dailyData.bonusClaimed = false;
      dailyData.todayWatered = false;

      this.saveDailyData(dailyData);
    }
  }

  /**
   * デイリーデータを取得
   * @returns {Object} デイリーデータ
   */
  static getDailyData() {
    return Storage.get('daily', {
      lastLogin: null,
      streak: 1,
      bonusClaimed: false,
      lastClaimed: null,
      todayWatered: false,
      todayVisitor: null,
      visitorDate: null
    });
  }

  /**
   * デイリーデータを保存
   * @param {Object} data - デイリーデータ
   */
  static saveDailyData(data) {
    Storage.set('daily', data);
  }

  /**
   * 水やり完了フラグを設定
   */
  static markWatered() {
    const dailyData = this.getDailyData();
    dailyData.todayWatered = true;
    this.saveDailyData(dailyData);
  }

  /**
   * 今日水やりをしたかどうか
   * @returns {boolean}
   */
  static isWateredToday() {
    const dailyData = this.getDailyData();
    return dailyData.todayWatered || false;
  }

  /**
   * デイリーデータをリセット（デバッグ用）
   */
  static resetDailyData() {
    Storage.remove('daily');
  }
}
