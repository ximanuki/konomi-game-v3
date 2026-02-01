/**
 * HapticsManager
 * 触覚フィードバックを管理するクラス
 *
 * Vibration APIを使用してデバイスに振動フィードバックを提供します。
 * ユーザー設定で有効/無効を切り替え可能。
 */
export class HapticsManager {
  // 内部状態
  static #enabled = true;

  /**
   * プリセット振動パターン
   * 配列形式: [振動ms, 休止ms, 振動ms, ...]
   */
  static PATTERNS = {
    TAP: [10],
    SUCCESS: [30, 50, 30],
    WARNING: [20, 30, 20],
    PLANT: [15, 20, 15, 20, 30],
    DISCOVER: [50, 30, 50, 30, 100]
  };

  /**
   * デバイスが触覚フィードバックに対応しているかチェック
   * @returns {boolean} 対応している場合true
   */
  static isSupported() {
    return 'vibrate' in navigator;
  }

  /**
   * 触覚フィードバックを有効化
   */
  static enable() {
    this.#enabled = true;
  }

  /**
   * 触覚フィードバックを無効化
   */
  static disable() {
    this.#enabled = false;

    // 実行中の振動を停止
    if (this.isSupported()) {
      navigator.vibrate(0);
    }
  }

  /**
   * 現在の有効/無効状態を取得
   * @returns {boolean} 有効な場合true
   */
  static isEnabled() {
    return this.#enabled;
  }

  /**
   * 振動を実行する内部メソッド
   * @private
   * @param {number|number[]} pattern - 振動パターン
   */
  static #vibrate(pattern) {
    // 無効化されている場合は何もしない
    if (!this.#enabled) return;

    // Vibration API未対応の場合は何もしない
    if (!this.isSupported()) return;

    navigator.vibrate(pattern);
  }

  /**
   * 軽いタップフィードバック（10ms）
   * ボタンタップなど、軽い操作に使用
   */
  static tap() {
    this.#vibrate(this.PATTERNS.TAP);
  }

  /**
   * 成功時のフィードバック
   * たねの植え付け成功、アイテム獲得などに使用
   */
  static success() {
    this.#vibrate(this.PATTERNS.SUCCESS);
  }

  /**
   * 警告フィードバック
   * 操作が無効、エラー発生時などに使用
   */
  static warning() {
    this.#vibrate(this.PATTERNS.WARNING);
  }

  /**
   * 植物に関するフィードバック
   * たねを植える、水やりなどに使用
   */
  static plant() {
    this.#vibrate(this.PATTERNS.PLANT);
  }

  /**
   * 発見時のフィードバック
   * 新しい植物、住人の発見などに使用
   */
  static discover() {
    this.#vibrate(this.PATTERNS.DISCOVER);
  }

  /**
   * 強さを指定した振動
   * @param {number} intensity - 振動の強さ（10-100ms推奨）
   */
  static impact(intensity) {
    // 強さを10-200msの範囲にクランプ
    const clampedIntensity = Math.max(10, Math.min(200, intensity));
    this.#vibrate(clampedIntensity);
  }

  /**
   * カスタムパターンで振動
   * @param {number[]} pattern - 振動パターン [振動ms, 休止ms, 振動ms, ...]
   *
   * @example
   * // 短い2回振動
   * HapticsManager.pattern([50, 100, 50]);
   *
   * @example
   * // 長い1回振動
   * HapticsManager.pattern([200]);
   */
  static pattern(pattern) {
    if (!Array.isArray(pattern)) {
      console.warn('HapticsManager.pattern: パターンは配列で指定してください');
      return;
    }

    // 最大持続時間チェック（合計5秒まで）
    const totalDuration = pattern.reduce((sum, val) => sum + val, 0);
    if (totalDuration > 5000) {
      console.warn('HapticsManager.pattern: パターンの合計時間が5秒を超えています');
      return;
    }

    this.#vibrate(pattern);
  }
}
