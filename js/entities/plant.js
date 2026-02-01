/**
 * まほうのにわ - 植物エンティティ
 *
 * 植物（Plant）クラス
 * - 成長段階: 0(種) → 1(芽) → 2(つぼみ) → 3(完成)
 * - 成長時間: stage 0→1: 1h, 1→2: 2h, 2→3: 3h
 * - 水やりシステム: 12時間で水が必要、枯れない設計
 */

import { Seed, generateId } from './seed.js';

// ユニークID生成（植物用）
let plantIdCounter = 0;

/**
 * 植物用ユニークIDを生成する
 * @returns {string} ユニークID
 */
function generatePlantId() {
  const timestamp = Date.now().toString(36);
  const counter = (plantIdCounter++).toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `plant_${timestamp}_${counter}_${random}`;
}

/**
 * 成長段階
 * @typedef {0 | 1 | 2 | 3} GrowthStage
 * 0: 種（たね）
 * 1: 芽（め）
 * 2: つぼみ
 * 3: 完成（かんせい）
 */

/**
 * 植物クラス
 */
export class Plant {
  /**
   * @param {string} seedType - たねの種類
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @param {string} [specificType] - 特定のタイプを指定（省略時はランダム）
   */
  constructor(seedType, x, y, specificType = null) {
    /** @type {string} ユニークID */
    this.id = generatePlantId();

    /** @type {string} 植物のタイプ（花、木など） */
    this.type = specificType || this._getRandomOutcome(seedType);

    /** @type {string} 元のたねの種類 */
    this.seedType = seedType;

    /** @type {number} X座標 */
    this.x = x;

    /** @type {number} Y座標 */
    this.y = y;

    /** @type {number} 植えた日時（ミリ秒） */
    this.plantedAt = Date.now();

    /** @type {number} 最後に水をあげた日時（ミリ秒） */
    this.lastWatered = Date.now();

    /** @type {GrowthStage} 成長段階 0-3 */
    this.stage = 0;

    /** @type {number} 現在のステージの進捗 0-100 */
    this.stageProgress = 0;
  }

  /**
   * 成長に必要な時間（ステージごと、時間単位）
   * GDD.md: たね(0h) → 芽(1h) → つぼみ(3h) → 完成(6h)
   * 累計: 0→1: 1h, 1→2: 2h, 2→3: 3h
   */
  static growthTime = {
    0: 1,  // 種→芽: 1時間
    1: 2,  // 芽→つぼみ: 2時間
    2: 3   // つぼみ→完成: 3時間
  };

  /**
   * 成長段階の表示名
   */
  static stageNames = {
    0: 'たね',
    1: 'め',
    2: 'つぼみ',
    3: 'かんせい'
  };

  /**
   * 水やりが必要になるまでの時間（時間単位）
   */
  static WATER_INTERVAL_HOURS = 12;

  /**
   * たねの種類からランダムな結果を取得
   * @private
   * @param {string} seedType - たねの種類
   * @returns {string} 植物のタイプ
   */
  _getRandomOutcome(seedType) {
    const outcomes = Seed.outcomes[seedType];
    if (!outcomes || outcomes.length === 0) {
      console.warn(`Unknown seed type: ${seedType}`);
      return 'unknown_plant';
    }
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  }

  /**
   * 水やりが必要かどうか
   * 12時間経過で水が必要になる
   * @returns {boolean} 水やりが必要か
   */
  needsWater() {
    const hoursSinceWater = (Date.now() - this.lastWatered) / (1000 * 60 * 60);
    return hoursSinceWater >= Plant.WATER_INTERVAL_HOURS;
  }

  /**
   * 成長可能かどうか
   * 水やりが済んでいて、まだ完成していない場合に成長可能
   * @returns {boolean} 成長可能か
   */
  canGrow() {
    return !this.needsWater() && this.stage < 3;
  }

  /**
   * 完成しているかどうか
   * @returns {boolean} 完成しているか
   */
  isComplete() {
    return this.stage >= 3;
  }

  /**
   * 水をあげる
   * @returns {boolean} 水やりが必要だったか（実際に水をあげたか）
   */
  water() {
    const neededWater = this.needsWater();
    this.lastWatered = Date.now();
    return neededWater;
  }

  /**
   * 成長処理
   * 経過時間に応じて成長を進める
   *
   * 重要: GDD.md の設計により「枯れない」
   * - 水やりを忘れても成長が止まるだけ
   * - 次に水をあげれば続きから成長
   *
   * @param {number} deltaMs - 経過時間（ミリ秒）
   * @returns {boolean} ステージアップしたか
   */
  updateGrowth(deltaMs) {
    // 成長できない場合はスキップ
    if (!this.canGrow()) {
      return false;
    }

    // 経過時間を時間単位に変換
    const hoursElapsed = deltaMs / (1000 * 60 * 60);

    // 現在のステージに必要な時間
    const requiredHours = Plant.growthTime[this.stage];
    if (requiredHours === undefined) {
      // 完成済み
      return false;
    }

    // 1時間あたりの進捗（0-100）
    const progressPerHour = 100 / requiredHours;

    // 進捗を加算
    this.stageProgress += progressPerHour * hoursElapsed;

    // ステージアップ判定
    if (this.stageProgress >= 100) {
      this.stage++;
      this.stageProgress = 0;
      return true; // ステージアップした
    }

    return false;
  }

  /**
   * オフライン時間分の成長を適用
   * アプリ復帰時に呼び出す
   * @param {number} offlineMs - オフラインだった時間（ミリ秒）
   * @returns {number} ステージアップした回数
   */
  applyOfflineGrowth(offlineMs) {
    let stageUps = 0;

    // 水やりが必要な場合は成長しない
    if (this.needsWater()) {
      return 0;
    }

    // 最大成長可能時間を計算（水やり間隔まで）
    const hoursSinceWater = (Date.now() - this.lastWatered) / (1000 * 60 * 60);
    const maxGrowthHours = Plant.WATER_INTERVAL_HOURS - hoursSinceWater;

    if (maxGrowthHours <= 0) {
      return 0;
    }

    // オフライン時間と最大成長時間の小さい方を適用
    const offlineHours = offlineMs / (1000 * 60 * 60);
    const growthHours = Math.min(offlineHours, maxGrowthHours);

    // 残り時間を使って成長処理を繰り返す
    let remainingMs = growthHours * 1000 * 60 * 60;

    while (remainingMs > 0 && this.stage < 3) {
      const requiredHours = Plant.growthTime[this.stage];
      if (requiredHours === undefined) break;

      const remainingProgress = 100 - this.stageProgress;
      const progressPerHour = 100 / requiredHours;
      const hoursToComplete = remainingProgress / progressPerHour;
      const msToComplete = hoursToComplete * 1000 * 60 * 60;

      if (remainingMs >= msToComplete) {
        // このステージを完了
        this.stage++;
        this.stageProgress = 0;
        remainingMs -= msToComplete;
        stageUps++;
      } else {
        // 途中まで進める
        const hoursElapsed = remainingMs / (1000 * 60 * 60);
        this.stageProgress += progressPerHour * hoursElapsed;
        remainingMs = 0;
      }
    }

    return stageUps;
  }

  /**
   * 完成までの残り時間を取得
   * @returns {number} 残り時間（ミリ秒）、完成済みの場合は0
   */
  getTimeToComplete() {
    if (this.isComplete()) {
      return 0;
    }

    let totalRemainingMs = 0;

    // 現在のステージの残り時間
    const currentRequired = Plant.growthTime[this.stage];
    if (currentRequired !== undefined) {
      const remainingProgress = 100 - this.stageProgress;
      const progressPerHour = 100 / currentRequired;
      const hoursRemaining = remainingProgress / progressPerHour;
      totalRemainingMs += hoursRemaining * 1000 * 60 * 60;
    }

    // 残りのステージの時間
    for (let s = this.stage + 1; s < 3; s++) {
      const required = Plant.growthTime[s];
      if (required !== undefined) {
        totalRemainingMs += required * 1000 * 60 * 60;
      }
    }

    return totalRemainingMs;
  }

  /**
   * 成長段階の表示名を取得
   * @returns {string} 表示名
   */
  getStageName() {
    return Plant.stageNames[this.stage] || 'unknown';
  }

  /**
   * 成長進捗のパーセンテージを取得（全体）
   * @returns {number} 0-100
   */
  getTotalProgress() {
    if (this.isComplete()) {
      return 100;
    }

    // 各ステージの時間
    const stage0Time = Plant.growthTime[0]; // 1h
    const stage1Time = Plant.growthTime[1]; // 2h
    const stage2Time = Plant.growthTime[2]; // 3h
    const totalTime = stage0Time + stage1Time + stage2Time; // 6h

    // 完了したステージの時間
    let completedTime = 0;
    for (let s = 0; s < this.stage; s++) {
      completedTime += Plant.growthTime[s] || 0;
    }

    // 現在のステージの進捗時間
    const currentRequired = Plant.growthTime[this.stage] || 0;
    const currentProgress = (this.stageProgress / 100) * currentRequired;

    const totalCompleted = completedTime + currentProgress;
    return Math.round((totalCompleted / totalTime) * 100);
  }

  /**
   * シリアライズ（保存用）
   * @returns {object} シリアライズされたデータ
   */
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      seedType: this.seedType,
      x: this.x,
      y: this.y,
      plantedAt: this.plantedAt,
      lastWatered: this.lastWatered,
      stage: this.stage,
      stageProgress: this.stageProgress
    };
  }

  /**
   * デシリアライズ（復元用）
   * @param {object} data - シリアライズされたデータ
   * @returns {Plant} 復元されたPlantインスタンス
   */
  static fromJSON(data) {
    const plant = new Plant(data.seedType, data.x, data.y, data.type);
    plant.id = data.id;
    plant.plantedAt = data.plantedAt;
    plant.lastWatered = data.lastWatered;
    plant.stage = data.stage;
    plant.stageProgress = data.stageProgress;
    return plant;
  }
}

export default Plant;
