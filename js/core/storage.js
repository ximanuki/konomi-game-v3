/**
 * まほうのにわ - ストレージ管理
 *
 * localStorage を使ったゲームデータの永続化
 * セーブ/ロード、バックアップ/リストア機能を提供
 */

// ストレージキー定数
const STORAGE_KEY = 'mahounoniwa_save';
const VERSION_KEY = 'mahounoniwa_version';

// 現在のセーブデータバージョン
const CURRENT_VERSION = 1;

/**
 * 初期セーブデータ構造
 * 新規ゲーム開始時に使用
 */
const DEFAULT_SAVE_DATA = {
  version: CURRENT_VERSION,

  // プレイヤー情報
  player: {
    name: 'このみ',
    level: 1,
    totalSeeds: 0,
    createdAt: null
  },

  // 所持品
  inventory: {
    seeds: {
      green: 5,   // みどりのたね（初期支給）
      brown: 3,   // ちゃいろのたね（初期支給）
      pink: 0,
      blue: 0,
      yellow: 0,
      purple: 0,
      gold: 0
    }
  },

  // 世界の状態
  world: {
    areas: {
      garden: { unlocked: true, items: [] },
      forest: { unlocked: false, items: [] },
      lake: { unlocked: false, items: [] },
      cave: { unlocked: false, items: [] },
      sky: { unlocked: false, items: [] },
      secret: { unlocked: false, items: [] }
    },
    objects: []
  },

  // 住人
  residents: [],

  // デイリー
  daily: {
    lastLogin: null,
    streak: 0,
    todayWatered: false,
    bonusClaimed: false
  },

  // 図鑑
  collection: {
    plants: [],
    residents: [],
    buildings: [],
    discoveries: []
  },

  // クエスト
  quests: {
    active: [],
    completed: []
  },

  // 設定
  settings: {
    soundEnabled: true,
    hapticsEnabled: true
  }
};

/**
 * ストレージ管理クラス
 * localStorage のラッパーとして機能
 */
export class Storage {
  /**
   * 値を取得
   * @param {string} key - キー
   * @param {*} defaultValue - デフォルト値
   * @returns {*} 保存されている値、またはデフォルト値
   */
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.warn(`[Storage] 読み込みエラー (${key}):`, error);
      return defaultValue;
    }
  }

  /**
   * 値を保存
   * @param {string} key - キー
   * @param {*} value - 保存する値
   * @returns {boolean} 成功したかどうか
   */
  static set(key, value) {
    try {
      const json = JSON.stringify(value);
      localStorage.setItem(key, json);
      return true;
    } catch (error) {
      // 容量超過などのエラー
      console.error(`[Storage] 保存エラー (${key}):`, error);

      // QuotaExceededError の場合は古いデータを削除して再試行
      if (error.name === 'QuotaExceededError') {
        console.warn('[Storage] 容量超過。古いデータを削除して再試行...');
        Storage.clearOldData();
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (retryError) {
          console.error('[Storage] 再試行も失敗:', retryError);
          return false;
        }
      }
      return false;
    }
  }

  /**
   * 値を削除
   * @param {string} key - キー
   */
  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[Storage] 削除エラー (${key}):`, error);
    }
  }

  /**
   * 全データをクリア
   * ※ゲームリセット用。確認なしで全削除するので注意
   */
  static clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('[Storage] クリアエラー:', error);
    }
  }

  /**
   * キーの存在確認
   * @param {string} key - キー
   * @returns {boolean} 存在するかどうか
   */
  static has(key) {
    return localStorage.getItem(key) !== null;
  }

  /**
   * ゲーム全体のセーブデータを保存
   * @param {Object} gameData - セーブデータ
   * @returns {boolean} 成功したかどうか
   */
  static save(gameData) {
    // バージョン情報を付与
    const dataToSave = {
      ...gameData,
      version: CURRENT_VERSION,
      savedAt: Date.now()
    };

    const success = Storage.set(STORAGE_KEY, dataToSave);
    if (success) {
      Storage.set(VERSION_KEY, CURRENT_VERSION);
      console.log('[Storage] セーブ完了');
    }
    return success;
  }

  /**
   * ゲーム全体のセーブデータを読み込み
   * @returns {Object} セーブデータ（存在しない場合は初期データ）
   */
  static load() {
    try {
      const savedData = Storage.get(STORAGE_KEY);

      // セーブデータが存在しない場合は初期データを返す
      if (!savedData) {
        console.log('[Storage] セーブデータなし。新規ゲーム開始');
        return Storage.createNewSave();
      }

      // バージョンチェックとマイグレーション
      const migratedData = Storage.migrate(savedData);

      console.log('[Storage] ロード完了');
      return migratedData;
    } catch (error) {
      console.error('[Storage] ロードエラー:', error);
      // エラー時は初期データを返す（ゲームを止めない）
      return Storage.createNewSave();
    }
  }

  /**
   * 新規セーブデータを作成
   * @returns {Object} 初期セーブデータ
   */
  static createNewSave() {
    const newSave = {
      ...JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA)), // ディープコピー
      player: {
        ...DEFAULT_SAVE_DATA.player,
        createdAt: Date.now()
      },
      daily: {
        ...DEFAULT_SAVE_DATA.daily,
        lastLogin: Date.now()
      }
    };
    return newSave;
  }

  /**
   * セーブデータのマイグレーション
   * 古いバージョンのデータを最新形式に変換
   * @param {Object} data - 古いセーブデータ
   * @returns {Object} マイグレーション済みデータ
   */
  static migrate(data) {
    let currentData = { ...data };
    const savedVersion = currentData.version || 0;

    // バージョンが同じなら何もしない
    if (savedVersion === CURRENT_VERSION) {
      return currentData;
    }

    console.log(`[Storage] マイグレーション開始: v${savedVersion} → v${CURRENT_VERSION}`);

    // バージョン別のマイグレーション処理
    // 例: v0 → v1
    if (savedVersion < 1) {
      currentData = Storage.migrateToV1(currentData);
    }

    // 将来のバージョンアップ用
    // if (savedVersion < 2) {
    //   currentData = Storage.migrateToV2(currentData);
    // }

    // 最新バージョンを設定
    currentData.version = CURRENT_VERSION;

    // マイグレーション後のデータを保存
    Storage.save(currentData);

    console.log('[Storage] マイグレーション完了');
    return currentData;
  }

  /**
   * v0 → v1 マイグレーション
   * @param {Object} data - 古いデータ
   * @returns {Object} v1形式のデータ
   */
  static migrateToV1(data) {
    // 不足しているフィールドをデフォルト値で補完
    return {
      ...DEFAULT_SAVE_DATA,
      ...data,
      player: {
        ...DEFAULT_SAVE_DATA.player,
        ...(data.player || {})
      },
      inventory: {
        ...DEFAULT_SAVE_DATA.inventory,
        ...(data.inventory || {}),
        seeds: {
          ...DEFAULT_SAVE_DATA.inventory.seeds,
          ...(data.inventory?.seeds || {})
        }
      },
      world: {
        ...DEFAULT_SAVE_DATA.world,
        ...(data.world || {}),
        areas: {
          ...DEFAULT_SAVE_DATA.world.areas,
          ...(data.world?.areas || {})
        }
      },
      daily: {
        ...DEFAULT_SAVE_DATA.daily,
        ...(data.daily || {})
      },
      collection: {
        ...DEFAULT_SAVE_DATA.collection,
        ...(data.collection || {})
      },
      quests: {
        ...DEFAULT_SAVE_DATA.quests,
        ...(data.quests || {})
      },
      settings: {
        ...DEFAULT_SAVE_DATA.settings,
        ...(data.settings || {})
      }
    };
  }

  /**
   * バックアップ用にJSON文字列を出力
   * @returns {string|null} JSON文字列（エラー時はnull）
   */
  static export() {
    try {
      const data = Storage.load();
      const exportData = {
        ...data,
        exportedAt: Date.now(),
        appName: 'mahounoniwa',
        appVersion: CURRENT_VERSION
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('[Storage] エクスポートエラー:', error);
      return null;
    }
  }

  /**
   * JSONからデータをリストア
   * @param {string} json - インポートするJSON文字列
   * @returns {boolean} 成功したかどうか
   */
  static import(json) {
    try {
      const data = JSON.parse(json);

      // 基本的なバリデーション
      if (!data || typeof data !== 'object') {
        throw new Error('無効なデータ形式');
      }

      // アプリ名チェック（他アプリのデータを弾く）
      if (data.appName && data.appName !== 'mahounoniwa') {
        throw new Error('他のアプリのセーブデータです');
      }

      // マイグレーションを適用して保存
      const migratedData = Storage.migrate(data);
      return Storage.save(migratedData);
    } catch (error) {
      console.error('[Storage] インポートエラー:', error);
      return false;
    }
  }

  /**
   * セーブデータが存在するかチェック
   * @returns {boolean}
   */
  static hasSaveData() {
    return Storage.get(STORAGE_KEY) !== null;
  }

  /**
   * 使用中のストレージ容量を取得（概算）
   * @returns {Object} { used: 使用量(bytes), quota: 上限(bytes), percentage: 使用率(%) }
   */
  static getStorageUsage() {
    try {
      let totalSize = 0;
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          totalSize += localStorage[key].length * 2; // UTF-16なので2倍
        }
      }

      // localStorageの一般的な上限は5MB
      const quota = 5 * 1024 * 1024;
      const percentage = Math.round((totalSize / quota) * 100);

      return {
        used: totalSize,
        quota: quota,
        percentage: percentage
      };
    } catch (error) {
      console.warn('[Storage] 使用量取得エラー:', error);
      return { used: 0, quota: 0, percentage: 0 };
    }
  }

  /**
   * 古いデータを削除（容量対策）
   * ※現在は何もしないが、将来的にログ等を削除する用
   */
  static clearOldData() {
    // 将来的に古いログやキャッシュを削除する処理を追加可能
    console.log('[Storage] 古いデータ削除処理（現在は未実装）');
  }
}

// デフォルトセーブデータ構造をエクスポート（テスト・デバッグ用）
export { DEFAULT_SAVE_DATA, CURRENT_VERSION };
