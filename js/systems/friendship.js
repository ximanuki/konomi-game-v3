/**
 * まほうのにわ - なかよし度システム
 *
 * 住人とのなかよし度を管理
 * GDD.md の「なかよし度システム」に基づく実装
 */

import { Storage } from '../core/storage.js';

/**
 * なかよし度のレベル定義
 * 0-100% を5段階で表現
 */
const FRIENDSHIP_LEVELS = {
  stranger: { min: 0, max: 24, name: 'はじめまして' },
  acquaintance: { min: 25, max: 49, name: 'しりあい' },
  friend: { min: 50, max: 74, name: 'ともだち' },
  bestfriend: { min: 75, max: 99, name: 'しんゆう' },
  family: { min: 100, max: 100, name: 'かぞく' }
};

/**
 * アクション別のなかよし度変化量
 */
const FRIENDSHIP_ACTIONS = {
  visit: 5,        // 毎日会いに行く
  gift: 10,        // プレゼントをあげる
  quest: 15,       // お願いを聞いてあげる（クエスト完了）
  play: 10,        // 一緒にあそぶ
  pet: 5,          // なでる
  talk: 3,         // 話しかける
  special: 20      // 特別なイベント
};

/**
 * マイルストーン定義
 * 特定のなかよし度到達時に解放される機能
 */
const MILESTONES = [
  { level: 25, reward: 'greeting_unlock', description: 'あいさつができるようになった' },
  { level: 50, reward: 'gift_unlock', description: 'プレゼントを喜んでもらえる' },
  { level: 75, reward: 'play_unlock', description: '一緒にあそべるようになった' },
  { level: 100, reward: 'naming_unlock', description: '名前をつけられるようになった' }
];

/**
 * なかよし度管理システム
 */
export class FriendshipSystem {
  /**
   * なかよし度を更新
   * @param {Object} resident - 住人オブジェクト
   * @param {string} action - アクション名（visit, gift, quest, play, pet, talk, special）
   * @returns {Object} { newFriendship, delta, levelUp, milestone }
   */
  static updateFriendship(resident, action) {
    if (!resident || !action) {
      console.warn('[FriendshipSystem] 無効な引数');
      return null;
    }

    const delta = FRIENDSHIP_ACTIONS[action] || 0;
    if (delta === 0) {
      console.warn(`[FriendshipSystem] 不明なアクション: ${action}`);
      return null;
    }

    const oldFriendship = resident.friendship || 0;
    const oldLevel = FriendshipSystem.getFriendshipLevel(resident);

    // なかよし度を更新（最大100）
    const newFriendship = Math.min(100, oldFriendship + delta);
    resident.friendship = newFriendship;
    resident.lastInteraction = Date.now();

    // レベルアップ判定
    const newLevel = FriendshipSystem.getFriendshipLevel(resident);
    const levelUp = oldLevel.key !== newLevel.key;

    // マイルストーン確認
    const milestone = FriendshipSystem.checkMilestone(oldFriendship, newFriendship);

    // セーブデータ更新
    FriendshipSystem.saveResidentData(resident);

    console.log(`[FriendshipSystem] ${resident.type}: ${oldFriendship} → ${newFriendship} (+${delta})`);

    return {
      newFriendship,
      delta,
      levelUp,
      oldLevel: oldLevel.name,
      newLevel: newLevel.name,
      milestone
    };
  }

  /**
   * なかよし度レベルを取得
   * @param {Object} resident - 住人オブジェクト
   * @returns {Object} { key, name, min, max }
   */
  static getFriendshipLevel(resident) {
    const friendship = resident?.friendship || 0;

    for (const [key, level] of Object.entries(FRIENDSHIP_LEVELS)) {
      if (friendship >= level.min && friendship <= level.max) {
        return { key, ...level };
      }
    }

    // フォールバック
    return { key: 'stranger', ...FRIENDSHIP_LEVELS.stranger };
  }

  /**
   * 毎日会いに行くボーナスを計算
   * 連続訪問日数に応じてボーナスが増加
   * @param {Object} resident - 住人オブジェクト
   * @returns {Object} { bonus, streak, isFirstToday }
   */
  static getDailyInteractionBonus(resident) {
    if (!resident) {
      return { bonus: 0, streak: 0, isFirstToday: false };
    }

    const now = Date.now();
    const lastInteraction = resident.lastInteraction || 0;
    const today = new Date().toDateString();
    const lastDate = new Date(lastInteraction).toDateString();

    // 今日すでに会っているか
    const isFirstToday = today !== lastDate;

    if (!isFirstToday) {
      // 今日はすでにボーナス取得済み
      return { bonus: 0, streak: resident.visitStreak || 0, isFirstToday: false };
    }

    // 連続訪問判定
    const yesterday = new Date(now - 24 * 60 * 60 * 1000).toDateString();
    const isConsecutive = lastDate === yesterday;

    // 連続日数を更新
    let streak = isConsecutive ? (resident.visitStreak || 0) + 1 : 1;
    resident.visitStreak = streak;

    // ボーナス計算（基本5% + 連続ボーナス）
    // 7日連続で最大 +3% ボーナス
    const streakBonus = Math.min(3, Math.floor(streak / 7) * 1);
    const bonus = FRIENDSHIP_ACTIONS.visit + streakBonus;

    return { bonus, streak, isFirstToday: true };
  }

  /**
   * マイルストーン到達を確認
   * @param {number} oldValue - 変更前のなかよし度
   * @param {number} newValue - 変更後のなかよし度
   * @returns {Object|null} 到達したマイルストーン、またはnull
   */
  static checkMilestone(oldValue, newValue) {
    for (const milestone of MILESTONES) {
      if (oldValue < milestone.level && newValue >= milestone.level) {
        return milestone;
      }
    }
    return null;
  }

  /**
   * 関係のマイルストーン一覧を確認
   * @param {Object} resident - 住人オブジェクト
   * @returns {Array} 達成済み・未達成のマイルストーン一覧
   */
  static checkRelationshipMilestones(resident) {
    const friendship = resident?.friendship || 0;

    return MILESTONES.map(milestone => ({
      ...milestone,
      achieved: friendship >= milestone.level
    }));
  }

  /**
   * 住人に名前をつけられるか
   * @param {Object} resident - 住人オブジェクト
   * @returns {boolean}
   */
  static canNameResident(resident) {
    return (resident?.friendship || 0) >= 100;
  }

  /**
   * 住人に名前をつける
   * @param {Object} resident - 住人オブジェクト
   * @param {string} name - 新しい名前
   * @returns {boolean} 成功したかどうか
   */
  static setResidentName(resident, name) {
    if (!FriendshipSystem.canNameResident(resident)) {
      console.warn('[FriendshipSystem] まだ名前をつけられません');
      return false;
    }

    if (!name || name.trim().length === 0) {
      console.warn('[FriendshipSystem] 名前が空です');
      return false;
    }

    resident.name = name.trim();
    FriendshipSystem.saveResidentData(resident);

    console.log(`[FriendshipSystem] ${resident.type}に「${name}」と名付けました`);
    return true;
  }

  /**
   * 住人データをセーブに保存
   * @param {Object} resident - 住人オブジェクト
   */
  static saveResidentData(resident) {
    try {
      const saveData = Storage.load();
      const index = saveData.residents.findIndex(r => r.id === resident.id);

      if (index >= 0) {
        saveData.residents[index] = resident;
      } else {
        saveData.residents.push(resident);
      }

      Storage.save(saveData);
    } catch (error) {
      console.error('[FriendshipSystem] セーブエラー:', error);
    }
  }

  /**
   * 全住人のなかよし度統計を取得
   * @returns {Object} { total, average, maxLevel, familyCount }
   */
  static getStatistics() {
    try {
      const saveData = Storage.load();
      const residents = saveData.residents || [];

      if (residents.length === 0) {
        return { total: 0, average: 0, maxLevel: 'stranger', familyCount: 0 };
      }

      const total = residents.reduce((sum, r) => sum + (r.friendship || 0), 0);
      const average = Math.round(total / residents.length);
      const familyCount = residents.filter(r => (r.friendship || 0) >= 100).length;

      // 最高レベルの住人
      const maxFriendship = Math.max(...residents.map(r => r.friendship || 0));
      const maxLevel = FriendshipSystem.getFriendshipLevel({ friendship: maxFriendship });

      return {
        total,
        average,
        maxLevel: maxLevel.name,
        familyCount,
        residentCount: residents.length
      };
    } catch (error) {
      console.error('[FriendshipSystem] 統計取得エラー:', error);
      return { total: 0, average: 0, maxLevel: 'stranger', familyCount: 0 };
    }
  }
}

// 定数をエクスポート（テスト・デバッグ用）
export { FRIENDSHIP_LEVELS, FRIENDSHIP_ACTIONS, MILESTONES };
