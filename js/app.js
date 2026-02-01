/**
 * まほうのにわ - メインエントリポイント
 * アプリケーションのライフサイクルを管理
 */

// Core モジュール
import { engine } from './core/engine.js';
import { Storage } from './core/storage.js';
import { World, world } from './core/world.js';
import { TimeManager } from './core/time.js';
import { AudioManager, audioManager } from './core/audio.js';
import { HapticsManager } from './core/haptics.js';

// エンティティ
import { Seed } from './entities/seed.js';
import { Plant } from './entities/plant.js';
import Resident, { RESIDENT_TYPES, FRIENDSHIP_LEVELS } from './entities/resident.js';
import Building, { BUILDING_TYPES } from './entities/building.js';

// システム
import { GrowthSystem, growthSystem } from './systems/growth.js';
import { WateringSystem, wateringSystem } from './systems/watering.js';
import { FriendshipSystem } from './systems/friendship.js';
import { QuestSystem } from './systems/quest.js';
import { DiscoverySystem } from './systems/discovery.js';
import { DailySystem } from './systems/daily.js';

// UI
import { GardenView } from './ui/garden-view.js';
import { Modal } from './ui/modal.js';
import { Toast } from './ui/toast.js';
import { Nav } from './ui/nav.js';
import { Collection } from './ui/collection.js';

// データ
import { SEEDS, getSeedById, getRandomOutcome } from './data/seeds.js';
import { PLANTS, getPlantById } from './data/plants.js';
import { RESIDENTS, getResidentById } from './data/residents.js';
import { QUESTS, getQuestById } from './data/quests.js';

// シングルトンインスタンス
const hapticsManager = new HapticsManager();
let gardenView = null;
let collection = null;

/**
 * アプリケーション初期化
 */
async function initApp() {
  console.log('[App] まほうのにわ - Initializing...');

  try {
    // 1. セーブデータのロード（Storageは静的クラス、init不要）
    const saveData = Storage.load();
    if (saveData) {
      console.log('[App] Save data loaded');
    } else {
      console.log('[App] No save data found - new game');
      // 新規セーブデータを作成
      Storage.createNewSave();
    }
    console.log('[App] Storage initialized');

    // 2. ゲーム世界の初期化
    // worldはシングルトンとして既に初期化済み
    console.log('[App] World initialized');

    // 3. タイム管理の初期化
    const offlineProgress = TimeManager.calculateOfflineProgress();
    if (offlineProgress && offlineProgress.hours > 0) {
      console.log(`[App] Offline for ${offlineProgress.hours.toFixed(1)} hours`);
    }
    TimeManager.saveAccess();
    console.log('[App] Time manager initialized');

    // 4. UI の初期化
    const gardenContainer = document.getElementById('garden');
    if (gardenContainer) {
      gardenView = new GardenView(gardenContainer);
      // 初期表示コンテンツを追加
      renderWelcomeScreen(gardenContainer);
    }
    Nav.init('.nav');

    const collectionContainer = document.getElementById('collection-container');
    if (collectionContainer) {
      collection = new Collection(collectionContainer);
    }
    console.log('[App] UI initialized');

    // 5. システムをエンジンに登録
    if (gardenView) {
      // システムはupdateメソッドを持つオブジェクトとして登録
      engine.registerSystem({
        update: (deltaMs) => growthSystem.update(world, deltaMs)
      });
      engine.registerRenderSystem({
        render: () => gardenView.render()
      });
    }
    console.log('[App] Systems registered');

    // 8. オーディオの初期化（ユーザー操作後に有効化）
    console.log('[App] Audio manager ready (waiting for user interaction)');

    // 9. ゲームエンジンを起動
    engine.start();
    console.log('[App] Game engine started');

    // 10. デバッグモード（開発中は有効）
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      engine.setDebug(true);
      // デバッグ用にグローバルに公開
      window.game = {
        engine,
        world,
        TimeManager,
        audioManager,
        hapticsManager,
        growthSystem,
        wateringSystem,
        FriendshipSystem,
        QuestSystem,
        DiscoverySystem,
        DailySystem,
        gardenView,
        collection,
        Modal,
        Toast,
        Nav,
        // データ
        SEEDS,
        PLANTS,
        RESIDENTS,
        QUESTS,
        // エンティティクラス
        Seed,
        Plant,
        Resident,
        Building
      };
      console.log('[App] Debug mode enabled - access via window.game');
    }

    // 11. 初回起動メッセージ
    if (!saveData) {
      Toast.info('まほうのにわへようこそ！');
    }

  } catch (error) {
    console.error('[App] Initialization failed:', error);
    showErrorScreen(error);
  }
}

/**
 * ウェルカム画面を表示
 * @param {HTMLElement} container - コンテナ要素
 */
function renderWelcomeScreen(container) {
  container.innerHTML = `
    <div class="welcome-screen" style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 400px;
      padding: 20px;
      text-align: center;
      background: linear-gradient(180deg, #87CEEB 0%, #98FB98 100%);
      border-radius: 16px;
      margin: 10px;
    ">
      <h1 style="
        font-size: 2em;
        color: #2e7d32;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(255,255,255,0.5);
      ">🌱 まほうのにわ 🌸</h1>
      <p style="
        font-size: 1.2em;
        color: #4a4a4a;
        margin-bottom: 20px;
      ">ふしぎなたねで せかいをつくろう！</p>
      <div style="
        font-size: 4em;
        margin: 20px 0;
        animation: bounce 1s ease infinite;
      ">🌻</div>
      <p style="
        font-size: 1em;
        color: #666;
        margin-top: 20px;
      ">このみちゃん、ようこそ！</p>
      <button id="start-game-btn" style="
        margin-top: 20px;
        padding: 15px 40px;
        background: #7BC47F;
        color: white;
        border: none;
        border-radius: 30px;
        font-size: 1.2em;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        transition: transform 0.2s;
      ">はじめる！</button>
    </div>
    <style>
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      #start-game-btn:hover {
        transform: scale(1.05);
      }
      #start-game-btn:active {
        transform: scale(0.95);
      }
    </style>
  `;

  // スタートボタンのイベント
  const startBtn = document.getElementById('start-game-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      Toast.success('ゲームスタート！');
      container.innerHTML = '<p style="text-align:center;padding:20px;color:#666;">🌱 たねをうえてみよう！</p>';
    });
  }
}

/**
 * エラー画面を表示
 * @param {Error} error - エラーオブジェクト
 */
function showErrorScreen(error) {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        padding: 20px;
        text-align: center;
        font-family: sans-serif;
      ">
        <h1 style="color: #e74c3c;">エラーが発生しました</h1>
        <p style="color: #666; margin: 10px 0;">アプリの起動に失敗しました</p>
        <pre style="
          background: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          max-width: 100%;
          overflow-x: auto;
          font-size: 12px;
          text-align: left;
        ">${error.message}\n\n${error.stack}</pre>
        <button onclick="location.reload()" style="
          margin-top: 20px;
          padding: 10px 20px;
          background: #7BC47F;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        ">再読み込み</button>
      </div>
    `;
  }
}

/**
 * アプリケーション終了時の処理
 */
function cleanupApp() {
  console.log('[App] Cleaning up...');

  // ゲームエンジンを停止
  engine.stop();

  // 現在の状態を保存
  // Storage.save(world.getSaveData());

  console.log('[App] Cleanup complete');
}

// ============================================================
// イベントリスナー
// ============================================================

/**
 * DOM読み込み完了時
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('[App] DOMContentLoaded');
  initApp();
});

/**
 * ページ離脱時（データ保存）
 */
window.addEventListener('beforeunload', () => {
  cleanupApp();
});

/**
 * アプリのvisibility変化（バックグラウンド/フォアグラウンド）
 * タブ切り替え、画面オフ、ホームボタン等で発火
 */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // バックグラウンドに移行 → ゲームを一時停止
    console.log('[App] App went to background - pausing');
    engine.pause();

    // 最終アクセス時刻を保存（オフライン成長計算用）
    // TimeManager.saveAccess();

    // 現在の状態を保存
    // Storage.save(world.getSaveData());

  } else {
    // フォアグラウンドに復帰 → ゲームを再開
    console.log('[App] App returned to foreground - resuming');

    // オフライン時の成長を計算・適用（将来実装）
    // const offlineProgress = TimeManager.calculateOfflineProgress();
    // if (offlineProgress.hours > 0) {
    //   const grownPlants = GrowthSystem.applyOfflineGrowth();
    //   if (grownPlants.length > 0) {
    //     showOfflineGrowthNotification(grownPlants);
    //   }
    // }

    engine.resume();
  }
});

/**
 * グローバルエラーハンドリング
 */
window.addEventListener('error', (event) => {
  console.error('[App] Uncaught error:', event.error);
  // エラー報告（将来実装 - Sentryなど）
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[App] Unhandled promise rejection:', event.reason);
  // エラー報告（将来実装）
});

/**
 * iOS Safari: AudioContext再開
 * iOS Safariでは最初のユーザーインタラクションまでオーディオが再生できない
 */
let audioContextResumed = false;
document.addEventListener('touchstart', async () => {
  if (!audioContextResumed) {
    // AudioManager.resumeContext(); // 将来実装
    audioContextResumed = true;
    console.log('[App] Audio context resumed after user interaction');
  }
}, { once: true });

console.log('[App] Event listeners registered');
