/**
 * watering.js - 水やりシステム
 *
 * 植物への水やりを管理するシステム。
 * 水やり状況の確認、個別・一括水やりを担当。
 */

// TODO: 実装後にコメント解除
// import { World } from '../core/world.js';
// import { AudioManager } from '../core/audio.js';
// import { HapticsManager } from '../core/haptics.js';

/**
 * 水やりシステム
 * 植物の水やり処理を一元管理
 */
export class WateringSystem {
  constructor() {
    // 最後に水やりした植物（演出用）
    this.lastWateredPlant = null;

    // 水やりクールダウン（連続タップ防止）
    this.cooldownMs = 500;
    this.lastWaterTime = 0;
  }

  /**
   * 水が必要な植物のリストを取得
   * @param {Object} world - ワールドインスタンス
   * @returns {Array} 水が必要な植物の配列
   */
  getPlantsNeedingWater(world) {
    const plants = world.getAllPlants();
    return plants.filter(plant => {
      // needsWater メソッドがあれば使用
      if (typeof plant.needsWater === 'function') {
        return plant.needsWater();
      }
      // なければ lastWatered から計算（12時間で水が必要）
      const hoursSinceWater = (Date.now() - plant.lastWatered) / (1000 * 60 * 60);
      return hoursSinceWater >= 12;
    });
  }

  /**
   * 特定の植物に水やり
   * @param {Object} plant - 植物インスタンス
   * @param {Object} options - オプション
   * @returns {Object} 水やり結果
   */
  waterPlant(plant, options = {}) {
    const now = Date.now();

    // クールダウンチェック
    if (!options.skipCooldown && (now - this.lastWaterTime) < this.cooldownMs) {
      return {
        success: false,
        reason: 'cooldown',
        remainingMs: this.cooldownMs - (now - this.lastWaterTime)
      };
    }

    // 既に水やり済みかチェック
    const needsWater = typeof plant.needsWater === 'function'
      ? plant.needsWater()
      : (now - plant.lastWatered) / (1000 * 60 * 60) >= 12;

    if (!needsWater) {
      return {
        success: false,
        reason: 'not_needed',
        message: 'この植物はまだ水を必要としていません'
      };
    }

    // 完成した植物は水やり不要
    if (plant.stage >= 3) {
      return {
        success: false,
        reason: 'fully_grown',
        message: 'この植物は完成しています'
      };
    }

    // 水やり実行
    if (typeof plant.water === 'function') {
      plant.water();
    } else {
      plant.lastWatered = now;
    }

    // 記録更新
    this.lastWaterTime = now;
    this.lastWateredPlant = plant;

    return {
      success: true,
      plant,
      wateredAt: now
    };
  }

  /**
   * 全植物に水やり（一括水やり機能）
   * @param {Object} world - ワールドインスタンス
   * @returns {Object} 水やり結果
   */
  waterAll(world) {
    const plantsNeedingWater = this.getPlantsNeedingWater(world);

    if (plantsNeedingWater.length === 0) {
      return {
        success: true,
        wateredCount: 0,
        message: '水を必要としている植物はありません'
      };
    }

    const results = [];

    for (const plant of plantsNeedingWater) {
      const result = this.waterPlant(plant, { skipCooldown: true });
      if (result.success) {
        results.push(result);
      }
    }

    return {
      success: true,
      wateredCount: results.length,
      wateredPlants: results.map(r => r.plant),
      message: `${results.length}本の植物に水やりしました`
    };
  }

  /**
   * 水やり状況を確認
   * @param {Object} world - ワールドインスタンス
   * @returns {Object} 水やり状況
   */
  checkWateringStatus(world) {
    const plants = world.getAllPlants();
    const plantsNeedingWater = this.getPlantsNeedingWater(world);

    // 次に水やりが必要になる時間を計算
    let nextWateringTime = null;
    for (const plant of plants) {
      if (plant.stage >= 3) continue; // 完成した植物はスキップ

      const needsWater = typeof plant.needsWater === 'function'
        ? plant.needsWater()
        : false;

      if (!needsWater && plant.lastWatered) {
        const waterNeededAt = plant.lastWatered + (12 * 60 * 60 * 1000);
        if (!nextWateringTime || waterNeededAt < nextWateringTime) {
          nextWateringTime = waterNeededAt;
        }
      }
    }

    return {
      totalPlants: plants.length,
      needsWater: plantsNeedingWater.length,
      allWatered: plantsNeedingWater.length === 0,
      plantsNeedingWater,
      nextWateringTime,
      nextWateringIn: nextWateringTime ? nextWateringTime - Date.now() : null
    };
  }

  /**
   * 植物の水やり詳細情報を取得
   * @param {Object} plant - 植物インスタンス
   * @returns {Object} 水やり情報
   */
  getWateringInfo(plant) {
    const now = Date.now();
    const lastWatered = plant.lastWatered || now;
    const hoursSinceWater = (now - lastWatered) / (1000 * 60 * 60);
    const needsWater = typeof plant.needsWater === 'function'
      ? plant.needsWater()
      : hoursSinceWater >= 12;

    // 次に水やりが必要になる時間
    const waterNeededAt = lastWatered + (12 * 60 * 60 * 1000);
    const hoursUntilNeeded = Math.max(0, (waterNeededAt - now) / (1000 * 60 * 60));

    return {
      lastWatered,
      hoursSinceWater,
      needsWater,
      hoursUntilNeeded: needsWater ? 0 : hoursUntilNeeded,
      isFullyGrown: plant.stage >= 3,
      canBeWatered: needsWater && plant.stage < 3
    };
  }

  /**
   * 最後に水やりした植物を取得（演出用）
   * @returns {Object|null} 植物インスタンス
   */
  getLastWateredPlant() {
    return this.lastWateredPlant;
  }

  /**
   * 最後に水やりした植物をクリア
   * 演出完了後に呼び出す
   */
  clearLastWateredPlant() {
    this.lastWateredPlant = null;
  }
}

// シングルトンインスタンスをエクスポート
export const wateringSystem = new WateringSystem();

export default WateringSystem;
