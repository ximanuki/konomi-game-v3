/**
 * まほうのにわ - おつかい（クエスト）システム
 *
 * 住人からのお願いを管理
 * GDD.md の「おつかい（クエストシステム）」に基づく実装
 */

import { Storage } from '../core/storage.js';
import { FriendshipSystem } from './friendship.js';

/**
 * クエストタイプ定義
 */
const QUEST_TYPES = {
  grow: 'grow',         // 植物を育てる
  collect: 'collect',   // アイテムを集める
  build: 'build',       // 建物を建てる
  visit: 'visit',       // 場所を訪れる
  gift: 'gift',         // プレゼントを渡す
  discover: 'discover'  // 組み合わせを発見する
};

/**
 * クエストテンプレート
 * 住人タイプごとのクエスト候補
 */
const QUEST_TEMPLATES = {
  rabbit: [
    { type: 'grow', target: 'carrot', count: 1, reward: { seeds: { green: 2 } }, text: 'にんじんをそだてて！' },
    { type: 'collect', target: 'flower', count: 3, reward: { seeds: { pink: 1 } }, text: 'おはなを3つあつめて！' },
    { type: 'gift', target: 'vegetable', count: 1, reward: { seeds: { brown: 2 } }, text: 'やさいをプレゼントして！' }
  ],
  squirrel: [
    { type: 'grow', target: 'tree', count: 1, reward: { seeds: { brown: 2 } }, text: 'きをそだてて！' },
    { type: 'collect', target: 'nut', count: 5, reward: { seeds: { brown: 1 } }, text: 'きのみを5こあつめて！' },
    { type: 'build', target: 'treehouse', count: 1, reward: { seeds: { yellow: 1 } }, text: 'ツリーハウスをつくって！' }
  ],
  bear: [
    { type: 'grow', target: 'tree', count: 3, reward: { seeds: { brown: 3 } }, text: 'きを3ぼんそだてて！' },
    { type: 'collect', target: 'honey', count: 1, reward: { seeds: { yellow: 1 } }, text: 'はちみつがほしいな' },
    { type: 'gift', target: 'fish', count: 1, reward: { seeds: { blue: 1 } }, text: 'おさかなをちょうだい！' }
  ],
  frog: [
    { type: 'build', target: 'pond', count: 1, reward: { seeds: { blue: 2 } }, text: 'いけをつくって！' },
    { type: 'grow', target: 'lotus', count: 1, reward: { seeds: { pink: 1 } }, text: 'はすのはなをさかせて！' },
    { type: 'collect', target: 'bug', count: 3, reward: { seeds: { green: 2 } }, text: 'むしを3びきつかまえて！' }
  ],
  fairy: [
    { type: 'discover', target: 'rainbow_flower', count: 1, reward: { seeds: { purple: 1 } }, text: 'レインボーフラワーをみせて！' },
    { type: 'grow', target: 'magic_plant', count: 1, reward: { seeds: { purple: 2 } }, text: 'まほうのはなをさかせて！' },
    { type: 'build', target: 'rainbow', count: 1, reward: { seeds: { gold: 1 } }, text: 'にじをつくって！' }
  ],
  // デフォルト（汎用）
  default: [
    { type: 'grow', target: 'any_plant', count: 1, reward: { seeds: { green: 1 } }, text: 'なにかをそだてて！' },
    { type: 'visit', target: 'garden', count: 1, reward: { seeds: { green: 1 } }, text: 'にわにあそびにきて！' },
    { type: 'gift', target: 'any', count: 1, reward: { seeds: { green: 1 } }, text: 'なにかプレゼントして！' }
  ]
};

/**
 * クエスト管理システム
 */
export class QuestSystem {
  /**
   * 進行中のクエストを取得
   * @returns {Array} アクティブなクエストの配列
   */
  static getActiveQuests() {
    try {
      const saveData = Storage.load();
      return saveData.quests?.active || [];
    } catch (error) {
      console.error('[QuestSystem] アクティブクエスト取得エラー:', error);
      return [];
    }
  }

  /**
   * 完了済みクエストを取得
   * @returns {Array} 完了済みクエストの配列
   */
  static getCompletedQuests() {
    try {
      const saveData = Storage.load();
      return saveData.quests?.completed || [];
    } catch (error) {
      console.error('[QuestSystem] 完了クエスト取得エラー:', error);
      return [];
    }
  }

  /**
   * 住人のクエストを取得
   * @param {string} residentId - 住人ID
   * @returns {Object|null} クエスト、またはnull
   */
  static getQuestByResident(residentId) {
    const activeQuests = QuestSystem.getActiveQuests();
    return activeQuests.find(q => q.residentId === residentId) || null;
  }

  /**
   * クエスト完了判定
   * @param {Object} quest - クエストオブジェクト
   * @returns {boolean} 完了条件を満たしているか
   */
  static checkQuestCompletion(quest) {
    if (!quest) return false;

    try {
      const saveData = Storage.load();

      switch (quest.type) {
        case QUEST_TYPES.grow:
          // 指定の植物が育っているか
          return QuestSystem.checkGrowCompletion(quest, saveData);

        case QUEST_TYPES.collect:
          // 指定アイテムを持っているか
          return QuestSystem.checkCollectCompletion(quest, saveData);

        case QUEST_TYPES.build:
          // 指定の建物があるか
          return QuestSystem.checkBuildCompletion(quest, saveData);

        case QUEST_TYPES.visit:
          // 指定エリアを訪れたか
          return QuestSystem.checkVisitCompletion(quest, saveData);

        case QUEST_TYPES.gift:
          // プレゼントを渡せるか（アイテム所持）
          return QuestSystem.checkGiftCompletion(quest, saveData);

        case QUEST_TYPES.discover:
          // 組み合わせを発見したか
          return QuestSystem.checkDiscoverCompletion(quest, saveData);

        default:
          return false;
      }
    } catch (error) {
      console.error('[QuestSystem] 完了判定エラー:', error);
      return false;
    }
  }

  /**
   * 成長クエストの完了判定
   */
  static checkGrowCompletion(quest, saveData) {
    const plants = saveData.world?.objects?.filter(obj =>
      obj.type === 'plant' && obj.data?.plantType === quest.target && obj.data?.stage >= 3
    ) || [];
    return plants.length >= quest.count;
  }

  /**
   * 収集クエストの完了判定
   */
  static checkCollectCompletion(quest, saveData) {
    // インベントリからアイテム数を確認
    const inventory = saveData.inventory || {};
    const count = inventory[quest.target] || 0;
    return count >= quest.count;
  }

  /**
   * 建設クエストの完了判定
   */
  static checkBuildCompletion(quest, saveData) {
    const buildings = saveData.world?.objects?.filter(obj =>
      obj.type === 'building' && obj.data?.buildingType === quest.target
    ) || [];
    return buildings.length >= quest.count;
  }

  /**
   * 訪問クエストの完了判定
   */
  static checkVisitCompletion(quest, saveData) {
    const area = saveData.world?.areas?.[quest.target];
    return area?.visited === true;
  }

  /**
   * プレゼントクエストの完了判定
   */
  static checkGiftCompletion(quest, saveData) {
    // any の場合は何かアイテムがあればOK
    if (quest.target === 'any') {
      const inventory = saveData.inventory || {};
      return Object.values(inventory).some(count => count > 0);
    }
    const inventory = saveData.inventory || {};
    return (inventory[quest.target] || 0) >= quest.count;
  }

  /**
   * 発見クエストの完了判定
   */
  static checkDiscoverCompletion(quest, saveData) {
    const discoveries = saveData.collection?.discoveries || [];
    return discoveries.includes(quest.target);
  }

  /**
   * クエスト完了処理
   * @param {Object} quest - 完了するクエスト
   * @returns {Object} { success, reward, friendshipGain }
   */
  static completeQuest(quest) {
    if (!quest) {
      return { success: false, reward: null, friendshipGain: 0 };
    }

    // 完了条件を満たしているか確認
    if (!QuestSystem.checkQuestCompletion(quest)) {
      console.warn('[QuestSystem] クエスト未完了');
      return { success: false, reward: null, friendshipGain: 0 };
    }

    try {
      const saveData = Storage.load();

      // アクティブから完了へ移動
      const activeIndex = saveData.quests.active.findIndex(q => q.id === quest.id);
      if (activeIndex >= 0) {
        saveData.quests.active.splice(activeIndex, 1);
      }

      // 完了時刻を記録
      const completedQuest = {
        ...quest,
        completedAt: Date.now()
      };
      saveData.quests.completed.push(completedQuest);

      // 報酬を付与
      if (quest.reward?.seeds) {
        for (const [seedType, count] of Object.entries(quest.reward.seeds)) {
          saveData.inventory.seeds[seedType] =
            (saveData.inventory.seeds[seedType] || 0) + count;
        }
      }

      // セーブ
      Storage.save(saveData);

      // なかよし度を上げる
      let friendshipGain = 0;
      const resident = saveData.residents.find(r => r.id === quest.residentId);
      if (resident) {
        const result = FriendshipSystem.updateFriendship(resident, 'quest');
        friendshipGain = result?.delta || 0;
      }

      console.log(`[QuestSystem] クエスト完了: ${quest.text}`);

      return {
        success: true,
        reward: quest.reward,
        friendshipGain
      };
    } catch (error) {
      console.error('[QuestSystem] クエスト完了エラー:', error);
      return { success: false, reward: null, friendshipGain: 0 };
    }
  }

  /**
   * 新規クエストを生成
   * @param {Object} resident - 住人オブジェクト
   * @returns {Object|null} 生成されたクエスト、またはnull
   */
  static generateNewQuest(resident) {
    if (!resident) {
      console.warn('[QuestSystem] 住人が指定されていません');
      return null;
    }

    // すでにこの住人のクエストがあれば生成しない
    const existingQuest = QuestSystem.getQuestByResident(resident.id);
    if (existingQuest) {
      console.log('[QuestSystem] この住人にはすでにクエストがあります');
      return existingQuest;
    }

    try {
      // 住人タイプに応じたテンプレートを取得
      const templates = QUEST_TEMPLATES[resident.type] || QUEST_TEMPLATES.default;

      // ランダムに1つ選択
      const template = templates[Math.floor(Math.random() * templates.length)];

      // クエストオブジェクトを生成
      const quest = {
        id: `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        residentId: resident.id,
        residentType: resident.type,
        type: template.type,
        target: template.target,
        count: template.count,
        reward: template.reward,
        text: template.text,
        createdAt: Date.now(),
        expiresAt: null  // 期限なし（失敗体験を排除）
      };

      // セーブデータに追加
      const saveData = Storage.load();
      saveData.quests.active.push(quest);
      Storage.save(saveData);

      console.log(`[QuestSystem] 新規クエスト生成: ${quest.text}`);

      return quest;
    } catch (error) {
      console.error('[QuestSystem] クエスト生成エラー:', error);
      return null;
    }
  }

  /**
   * クエスト状況を更新（ゲームループから呼ばれる）
   * - 完了可能なクエストの通知
   * - 新規クエストの自動生成（条件付き）
   */
  static update() {
    try {
      const activeQuests = QuestSystem.getActiveQuests();

      // 完了可能なクエストをチェック
      const completableQuests = activeQuests.filter(quest =>
        QuestSystem.checkQuestCompletion(quest)
      );

      if (completableQuests.length > 0) {
        console.log(`[QuestSystem] ${completableQuests.length}件のクエストが完了可能`);
      }

      // クエストを持っていない住人に新規クエストを生成（確率で）
      const saveData = Storage.load();
      const residents = saveData.residents || [];

      for (const resident of residents) {
        // すでにクエストがある場合はスキップ
        if (QuestSystem.getQuestByResident(resident.id)) {
          continue;
        }

        // なかよし度が25以上の住人のみクエストを発行
        if ((resident.friendship || 0) < 25) {
          continue;
        }

        // 10%の確率で新規クエスト生成
        if (Math.random() < 0.1) {
          QuestSystem.generateNewQuest(resident);
        }
      }

      return {
        activeCount: activeQuests.length,
        completableCount: completableQuests.length
      };
    } catch (error) {
      console.error('[QuestSystem] 更新エラー:', error);
      return { activeCount: 0, completableCount: 0 };
    }
  }

  /**
   * クエストをキャンセル
   * ※失敗体験を排除するため、ペナルティなし
   * @param {string} questId - クエストID
   * @returns {boolean} 成功したかどうか
   */
  static cancelQuest(questId) {
    try {
      const saveData = Storage.load();
      const index = saveData.quests.active.findIndex(q => q.id === questId);

      if (index >= 0) {
        saveData.quests.active.splice(index, 1);
        Storage.save(saveData);
        console.log(`[QuestSystem] クエストキャンセル: ${questId}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('[QuestSystem] キャンセルエラー:', error);
      return false;
    }
  }

  /**
   * 統計情報を取得
   * @returns {Object} { activeCount, completedCount, totalRewards }
   */
  static getStatistics() {
    try {
      const saveData = Storage.load();
      const active = saveData.quests?.active || [];
      const completed = saveData.quests?.completed || [];

      // 獲得報酬の合計
      const totalRewards = { seeds: {} };
      for (const quest of completed) {
        if (quest.reward?.seeds) {
          for (const [type, count] of Object.entries(quest.reward.seeds)) {
            totalRewards.seeds[type] = (totalRewards.seeds[type] || 0) + count;
          }
        }
      }

      return {
        activeCount: active.length,
        completedCount: completed.length,
        totalRewards
      };
    } catch (error) {
      console.error('[QuestSystem] 統計取得エラー:', error);
      return { activeCount: 0, completedCount: 0, totalRewards: {} };
    }
  }
}

// 定数をエクスポート（テスト・デバッグ用）
export { QUEST_TYPES, QUEST_TEMPLATES };
