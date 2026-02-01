/**
 * growth.js - 成長システム
 *
 * 植物の成長を管理するシステム。
 * オフライン成長とリアルタイム更新を担当。
 */

// TODO: 実装後にコメント解除
// import { TimeManager } from '../core/time.js';
// import { World } from '../core/world.js';

/**
 * 成長システム
 * 植物の成長計算を一元管理
 */
export class GrowthSystem {
  constructor() {
    // 成長した植物を追跡（演出用）
    this.recentlyGrownPlants = [];
  }

  /**
   * オフライン成長を適用
   * アプリ起動時に呼び出し、離れていた間の成長を反映
   * @param {Object} world - ワールドインスタンス
   * @param {Object} timeManager - タイムマネージャーインスタンス
   * @returns {Array} 成長した植物のリスト（演出用）
   */
  applyOfflineGrowth(world, timeManager) {
    const { hours } = timeManager.calculateOfflineProgress();

    if (hours <= 0) {
      return [];
    }

    const grownPlants = [];
    const plants = world.getAllPlants();
    const deltaMs = hours * 60 * 60 * 1000;

    for (const plant of plants) {
      if (plant.canGrow()) {
        const previousStage = plant.stage;
        const didGrow = plant.updateGrowth(deltaMs);

        if (didGrow) {
          grownPlants.push({
            plant,
            previousStage,
            newStage: plant.stage,
            grewDuringOffline: true
          });
        }
      }
    }

    // 演出用に記録
    this.recentlyGrownPlants = grownPlants;

    console.log(`[GrowthSystem] オフライン成長適用: ${hours.toFixed(1)}時間経過, ${grownPlants.length}本が成長`);

    return grownPlants;
  }

  /**
   * リアルタイム更新
   * ゲームループから毎フレーム呼び出される
   * @param {Object} world - ワールドインスタンス
   * @param {number} deltaMs - 前回更新からの経過時間（ミリ秒）
   * @returns {Array} このフレームで成長した植物のリスト
   */
  update(world, deltaMs) {
    const grownPlants = [];
    const plants = world.getAllPlants();

    for (const plant of plants) {
      if (plant.canGrow()) {
        const previousStage = plant.stage;
        const didGrow = plant.updateGrowth(deltaMs);

        if (didGrow) {
          grownPlants.push({
            plant,
            previousStage,
            newStage: plant.stage,
            grewDuringOffline: false
          });
        }
      }
    }

    // 成長した植物があれば記録
    if (grownPlants.length > 0) {
      this.recentlyGrownPlants = grownPlants;
    }

    return grownPlants;
  }

  /**
   * 最近成長した植物を取得（演出用）
   * @returns {Array} 成長した植物のリスト
   */
  getRecentlyGrownPlants() {
    return this.recentlyGrownPlants;
  }

  /**
   * 最近成長した植物リストをクリア
   * 演出完了後に呼び出す
   */
  clearRecentlyGrownPlants() {
    this.recentlyGrownPlants = [];
  }

  /**
   * 植物の成長進捗を取得
   * @param {Object} plant - 植物インスタンス
   * @returns {Object} 成長情報
   */
  getGrowthInfo(plant) {
    // 成長に必要な時間（時間単位）
    const growthTime = {
      0: 1,  // 種→芽: 1時間
      1: 2,  // 芽→つぼみ: 2時間
      2: 3   // つぼみ→完成: 3時間
    };

    const requiredHours = growthTime[plant.stage] || 0;
    const progressPercent = plant.stageProgress || 0;
    const remainingPercent = 100 - progressPercent;
    const remainingHours = (remainingPercent / 100) * requiredHours;

    return {
      currentStage: plant.stage,
      stageProgress: progressPercent,
      requiredHours,
      remainingHours,
      isFullyGrown: plant.stage >= 3,
      canGrow: plant.canGrow(),
      needsWater: plant.needsWater ? plant.needsWater() : false
    };
  }

  /**
   * 全植物の成長状況サマリを取得
   * @param {Object} world - ワールドインスタンス
   * @returns {Object} サマリ情報
   */
  getGrowthSummary(world) {
    const plants = world.getAllPlants();

    const summary = {
      total: plants.length,
      byStage: {
        seed: 0,      // ステージ0: 種
        sprout: 0,    // ステージ1: 芽
        bud: 0,       // ステージ2: つぼみ
        complete: 0   // ステージ3: 完成
      },
      needsWater: 0,
      growing: 0
    };

    for (const plant of plants) {
      // ステージ別カウント
      switch (plant.stage) {
        case 0: summary.byStage.seed++; break;
        case 1: summary.byStage.sprout++; break;
        case 2: summary.byStage.bud++; break;
        case 3: summary.byStage.complete++; break;
      }

      // 水が必要なもの
      if (plant.needsWater && plant.needsWater()) {
        summary.needsWater++;
      }

      // 成長中のもの
      if (plant.canGrow && plant.canGrow()) {
        summary.growing++;
      }
    }

    return summary;
  }
}

// シングルトンインスタンスをエクスポート
export const growthSystem = new GrowthSystem();

export default GrowthSystem;
