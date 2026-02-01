/**
 * クエストマスターデータ - まほうのにわ
 * 住人からのお願い（おつかい）の定義
 */

export const QUESTS = {
  // ======================================
  // うさぎのクエスト
  // ======================================
  rabbit_quest_01: {
    id: 'rabbit_quest_01',
    title: 'にんじんが ほしいな',
    giver: 'rabbit',
    description: 'うさぎさんが にんじんを ほしがっているよ',
    condition: {
      type: 'give_item',
      requiredItem: 'vegetable_carrot',
      quantity: 1
    },
    reward: {
      friendship: 15,
      items: ['green', 'green'] // たね2個
    },
    unlockCondition: {
      friendship: 0 // なかよし度0以上（いつでも）
    },
    repeatable: true, // 繰り返し可能
    cooldown: 24 // 24時間ごと
  },

  rabbit_quest_02: {
    id: 'rabbit_quest_02',
    title: 'おはなを みせて',
    giver: 'rabbit',
    description: 'うさぎさんが きれいなはなを みたいって',
    condition: {
      type: 'show_item',
      requiredItem: 'flower_red',
      quantity: 3
    },
    reward: {
      friendship: 10,
      items: ['pink']
    },
    unlockCondition: {
      friendship: 25
    },
    repeatable: false
  },

  // ======================================
  // くまのパンやさんのクエスト
  // ======================================
  bear_quest_01: {
    id: 'bear_quest_01',
    title: 'きのこを さがして',
    giver: 'bear_baker',
    description: 'パンやさんが きのこを さがしているよ',
    condition: {
      type: 'give_item',
      requiredItem: 'mushroom',
      quantity: 2
    },
    reward: {
      friendship: 15,
      items: ['brown', 'brown']
    },
    unlockCondition: {
      friendship: 0
    },
    repeatable: true,
    cooldown: 48
  },

  bear_quest_02: {
    id: 'bear_quest_02',
    title: 'トマトが ほしい',
    giver: 'bear_baker',
    description: 'トマトパンを つくりたいんだって',
    condition: {
      type: 'give_item',
      requiredItem: 'vegetable_tomato',
      quantity: 3
    },
    reward: {
      friendship: 20,
      items: ['yellow']
    },
    unlockCondition: {
      friendship: 25
    },
    repeatable: false
  },

  // ======================================
  // ようせいのクエスト
  // ======================================
  fairy_quest_01: {
    id: 'fairy_quest_01',
    title: 'レインボーフラワーを みせて',
    giver: 'fairy',
    description: 'ようせいさんが レインボーフラワーを みたいって',
    condition: {
      type: 'show_item',
      requiredItem: 'flower_special',
      quantity: 1
    },
    reward: {
      friendship: 20,
      items: ['purple']
    },
    unlockCondition: {
      friendship: 0
    },
    repeatable: false
  },

  fairy_quest_02: {
    id: 'fairy_quest_02',
    title: 'まほうのきを そだてて',
    giver: 'fairy',
    description: 'まほうのきを そだてて ほしいんだって',
    condition: {
      type: 'grow_plant',
      requiredItem: 'magic_tree',
      quantity: 1
    },
    reward: {
      friendship: 30,
      items: ['purple', 'purple']
    },
    unlockCondition: {
      friendship: 50
    },
    repeatable: false
  },

  // ======================================
  // りすのクエスト
  // ======================================
  squirrel_quest_01: {
    id: 'squirrel_quest_01',
    title: 'どんぐりが ほしいな',
    giver: 'squirrel',
    description: 'りすさんが どんぐりを あつめているよ',
    condition: {
      type: 'give_item',
      requiredItem: 'tree_oak',
      quantity: 1
    },
    reward: {
      friendship: 15,
      items: ['brown']
    },
    unlockCondition: {
      friendship: 0
    },
    repeatable: true,
    cooldown: 24
  },

  // ======================================
  // かえるのクエスト
  // ======================================
  frog_quest_01: {
    id: 'frog_quest_01',
    title: 'いけを つくって',
    giver: 'frog',
    description: 'かえるさんが およげる いけが ほしいって',
    condition: {
      type: 'build_item',
      requiredItem: 'pond',
      quantity: 1
    },
    reward: {
      friendship: 20,
      items: ['blue']
    },
    unlockCondition: {
      friendship: 0
    },
    repeatable: false
  },

  frog_quest_02: {
    id: 'frog_quest_02',
    title: 'はすのはなを みせて',
    giver: 'frog',
    description: 'かえるさんが はすのはなを みたいって',
    condition: {
      type: 'show_item',
      requiredItem: 'lily_pond',
      quantity: 1
    },
    reward: {
      friendship: 25,
      items: ['blue', 'blue']
    },
    unlockCondition: {
      friendship: 50
    },
    repeatable: false
  },

  // ======================================
  // ねこのはなやさんのクエスト
  // ======================================
  cat_quest_01: {
    id: 'cat_quest_01',
    title: 'いろんなはなを そだてて',
    giver: 'cat_florist',
    description: 'はなやさんが いろんなはなを みたいって',
    condition: {
      type: 'collect_variety',
      requiredItems: ['flower_red', 'flower_blue', 'flower_yellow'],
      quantity: 1 // 各1個ずつ
    },
    reward: {
      friendship: 20,
      items: ['pink', 'green']
    },
    unlockCondition: {
      friendship: 0
    },
    repeatable: false
  },

  // ======================================
  // ドラゴンのクエスト（伝説級）
  // ======================================
  dragon_quest_01: {
    id: 'dragon_quest_01',
    title: 'たからのきを そだてて',
    giver: 'dragon',
    description: 'ドラゴンが たからのきを みたいって',
    condition: {
      type: 'grow_plant',
      requiredItem: 'treasure_tree',
      quantity: 1
    },
    reward: {
      friendship: 50,
      items: ['gold']
    },
    unlockCondition: {
      friendship: 0
    },
    repeatable: false
  },

  // ======================================
  // チュートリアルクエスト
  // ======================================
  tutorial_01: {
    id: 'tutorial_01',
    title: 'はじめての たね',
    giver: null, // システムクエスト
    description: 'たねを うえてみよう！',
    condition: {
      type: 'plant_seed',
      quantity: 1
    },
    reward: {
      friendship: 0,
      items: ['green', 'green']
    },
    unlockCondition: {
      tutorialStep: 1
    },
    repeatable: false
  },

  tutorial_02: {
    id: 'tutorial_02',
    title: 'はじめての みずやり',
    giver: null,
    description: 'たねに みずを あげてみよう',
    condition: {
      type: 'water_plant',
      quantity: 1
    },
    reward: {
      friendship: 0,
      items: ['green']
    },
    unlockCondition: {
      tutorialStep: 2
    },
    repeatable: false
  },

  tutorial_03: {
    id: 'tutorial_03',
    title: 'はじめての しゅうかく',
    giver: null,
    description: 'そだった はなを みてみよう',
    condition: {
      type: 'harvest_plant',
      quantity: 1
    },
    reward: {
      friendship: 0,
      items: ['brown']
    },
    unlockCondition: {
      tutorialStep: 3
    },
    repeatable: false
  }
};

/**
 * クエストIDから情報を取得
 * @param {string} questId - クエストのID
 * @returns {Object|null} クエストの情報
 */
export function getQuestById(questId) {
  return QUESTS[questId] || null;
}

/**
 * 住人のクエストをすべて取得
 * @param {string} residentId - 住人のID
 * @returns {Array} 該当するクエストのリスト
 */
export function getQuestsByGiver(residentId) {
  return Object.values(QUESTS).filter(quest => quest.giver === residentId);
}

/**
 * 繰り返し可能なクエストをフィルタリング
 * @returns {Array} 繰り返し可能なクエストのリスト
 */
export function getRepeatableQuests() {
  return Object.values(QUESTS).filter(quest => quest.repeatable === true);
}

/**
 * チュートリアルクエストを取得
 * @returns {Array} チュートリアルクエストのリスト
 */
export function getTutorialQuests() {
  return Object.values(QUESTS).filter(quest => quest.giver === null);
}

/**
 * クエストが受諾可能かチェック
 * @param {string} questId - クエストのID
 * @param {Object} playerData - プレイヤーデータ
 * @returns {boolean} 受諾可能ならtrue
 */
export function canAcceptQuest(questId, playerData) {
  const quest = getQuestById(questId);
  if (!quest) return false;

  const { unlockCondition } = quest;

  // なかよし度条件
  if (unlockCondition.friendship !== undefined) {
    const residentFriendship = playerData.residents
      .find(r => r.id === quest.giver)?.friendship || 0;

    if (residentFriendship < unlockCondition.friendship) {
      return false;
    }
  }

  // チュートリアル条件
  if (unlockCondition.tutorialStep !== undefined) {
    if (playerData.tutorialStep < unlockCondition.tutorialStep) {
      return false;
    }
  }

  return true;
}

/**
 * クエスト条件が達成されているかチェック
 * @param {string} questId - クエストのID
 * @param {Object} playerData - プレイヤーデータ
 * @returns {boolean} 達成済みならtrue
 */
export function isQuestCompleted(questId, playerData) {
  const quest = getQuestById(questId);
  if (!quest) return false;

  const { condition } = quest;

  switch (condition.type) {
    case 'give_item':
    case 'show_item':
      // インベントリに必要なアイテムがあるか
      const itemCount = playerData.inventory[condition.requiredItem] || 0;
      return itemCount >= condition.quantity;

    case 'grow_plant':
    case 'build_item':
      // 世界に必要な植物があるか
      const plantCount = playerData.world.objects.filter(
        obj => obj.type === condition.requiredItem && obj.stage === 3
      ).length;
      return plantCount >= condition.quantity;

    case 'collect_variety':
      // 複数種類のアイテムがあるか
      return condition.requiredItems.every(item => {
        const count = playerData.inventory[item] || 0;
        return count >= (condition.quantity || 1);
      });

    case 'plant_seed':
      return playerData.stats?.totalPlanted >= condition.quantity;

    case 'water_plant':
      return playerData.stats?.totalWatered >= condition.quantity;

    case 'harvest_plant':
      return playerData.stats?.totalHarvested >= condition.quantity;

    default:
      return false;
  }
}

/**
 * クエスト報酬を取得
 * @param {string} questId - クエストのID
 * @returns {Object} 報酬内容
 */
export function getQuestReward(questId) {
  const quest = getQuestById(questId);
  return quest ? quest.reward : null;
}

/**
 * すべてのクエストIDリストを取得
 * @returns {Array} クエストIDの配列
 */
export function getAllQuestIds() {
  return Object.keys(QUESTS);
}
