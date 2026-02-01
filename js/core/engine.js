/**
 * ゲームエンジン - まほうのにわ
 * ゲームループ、システム更新、レンダリングを管理
 */

// 将来実装されるシステムのimport（現時点ではコメントアウト）
// import { GrowthSystem } from '../systems/growth.js';
// import { ResidentSystem } from '../systems/resident.js';
// import { QuestSystem } from '../systems/quest.js';
// import { GardenView } from '../ui/garden-view.js';

export class Engine {
  constructor() {
    this.lastUpdate = Date.now();
    this.lastSystemUpdate = Date.now();
    this.isRunning = false;
    this.isPaused = false;
    this.animationFrameId = null;

    // システムの登録（実装され次第追加）
    this.systems = [];
    this.renderSystems = [];

    // デバッグモード
    this.debug = false;
  }

  /**
   * ゲームエンジンを起動
   */
  start() {
    if (this.isRunning) {
      console.warn('[Engine] Already running');
      return;
    }

    this.isRunning = true;
    this.isPaused = false;
    this.lastUpdate = Date.now();
    this.lastSystemUpdate = Date.now();

    console.log('[Engine] Starting game loop...');
    this.loop();
  }

  /**
   * ゲームエンジンを完全停止
   */
  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    this.isPaused = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    console.log('[Engine] Stopped');
  }

  /**
   * ゲームを一時停止
   */
  pause() {
    if (!this.isRunning || this.isPaused) {
      return;
    }

    this.isPaused = true;
    console.log('[Engine] Paused');
  }

  /**
   * 一時停止から再開
   */
  resume() {
    if (!this.isRunning || !this.isPaused) {
      return;
    }

    this.isPaused = false;
    this.lastUpdate = Date.now();
    this.lastSystemUpdate = Date.now();

    console.log('[Engine] Resumed');
  }

  /**
   * メインゲームループ（requestAnimationFrame）
   */
  loop() {
    if (!this.isRunning) {
      return;
    }

    const now = Date.now();
    const deltaTime = now - this.lastUpdate;
    this.lastUpdate = now;

    // 一時停止中でなければ更新処理
    if (!this.isPaused) {
      // システム更新（1秒ごとで十分）
      const timeSinceLastSystemUpdate = now - this.lastSystemUpdate;
      if (timeSinceLastSystemUpdate >= 1000) {
        this.update(timeSinceLastSystemUpdate);
        this.lastSystemUpdate = now;
      }

      // レンダリング（60fps）
      this.render();
    }

    // 次のフレームをスケジュール
    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  /**
   * ゲームロジック更新（1秒ごと）
   * @param {number} deltaTime - 前回の更新からの経過時間（ミリ秒）
   */
  update(deltaTime) {
    if (this.debug) {
      console.log(`[Engine] Update - deltaTime: ${deltaTime}ms`);
    }

    // 登録されているシステムを更新
    this.systems.forEach(system => {
      if (system && typeof system.update === 'function') {
        try {
          system.update(deltaTime);
        } catch (error) {
          console.error(`[Engine] Error updating system:`, error);
        }
      }
    });

    // 将来の実装例:
    // - GrowthSystem.update(deltaTime) - 植物の成長計算
    // - ResidentSystem.update(deltaTime) - 住人の行動更新
    // - QuestSystem.update() - クエスト状態確認
  }

  /**
   * 描画更新（60fps）
   */
  render() {
    // 登録されているレンダリングシステムを実行
    this.renderSystems.forEach(system => {
      if (system && typeof system.render === 'function') {
        try {
          system.render();
        } catch (error) {
          console.error(`[Engine] Error rendering system:`, error);
        }
      }
    });

    // 将来の実装例:
    // - GardenView.render() - 庭の描画更新
  }

  /**
   * システムを登録（ロジック更新用）
   * @param {Object} system - updateメソッドを持つシステムオブジェクト
   */
  registerSystem(system) {
    if (!system || typeof system.update !== 'function') {
      console.warn('[Engine] Invalid system - must have update() method');
      return;
    }

    this.systems.push(system);
    console.log(`[Engine] System registered:`, system.constructor?.name || 'Unknown');
  }

  /**
   * レンダリングシステムを登録
   * @param {Object} system - renderメソッドを持つシステムオブジェクト
   */
  registerRenderSystem(system) {
    if (!system || typeof system.render !== 'function') {
      console.warn('[Engine] Invalid render system - must have render() method');
      return;
    }

    this.renderSystems.push(system);
    console.log(`[Engine] Render system registered:`, system.constructor?.name || 'Unknown');
  }

  /**
   * デバッグモードを切り替え
   * @param {boolean} enabled - デバッグモードの有効/無効
   */
  setDebug(enabled) {
    this.debug = enabled;
    console.log(`[Engine] Debug mode: ${enabled ? 'ON' : 'OFF'}`);
  }
}

// シングルトンインスタンスをエクスポート
export const engine = new Engine();
