/**
 * Nav - ナビゲーション管理クラス
 *
 * 下部ナビゲーションバーの管理とタブ切替を行います。
 * タブ: home, collection, shop, settings
 */
export class Nav {
  /**
   * ナビゲーション要素
   * @private
   */
  static #nav = null;

  /**
   * タブアイテム要素のマップ
   * @private
   */
  static #tabItems = new Map();

  /**
   * 現在アクティブなタブID
   * @private
   */
  static #activeTab = null;

  /**
   * タブ変更時のコールバック関数
   * @private
   */
  static #onTabChangeCallback = null;

  /**
   * ナビゲーションを初期化
   * @param {string|HTMLElement} selector - ナビゲーション要素のセレクタまたはDOM要素
   */
  static init(selector) {
    // ナビゲーション要素を取得
    if (typeof selector === 'string') {
      this.#nav = document.querySelector(selector);
    } else {
      this.#nav = selector;
    }

    if (!this.#nav) {
      console.error('Nav.init: ナビゲーション要素が見つかりません');
      return;
    }

    // 全てのナビアイテムを取得
    const items = this.#nav.querySelectorAll('.nav-item');
    items.forEach(item => {
      const tabId = item.dataset.tab;
      if (tabId) {
        this.#tabItems.set(tabId, item);

        // クリックイベント設定
        item.addEventListener('click', () => {
          this.setActiveTab(tabId);
        });
      }
    });

    // 初期アクティブタブを設定（既にactiveクラスがあればそれを使用）
    const activeItem = this.#nav.querySelector('.nav-item.active');
    if (activeItem) {
      this.#activeTab = activeItem.dataset.tab;
    }
  }

  /**
   * アクティブタブを設定
   * @param {string} tabId - アクティブにするタブのID
   */
  static setActiveTab(tabId) {
    const newItem = this.#tabItems.get(tabId);
    if (!newItem) {
      console.warn(`Nav.setActiveTab: タブ "${tabId}" が見つかりません`);
      return;
    }

    // 以前のアクティブタブを非アクティブ化
    if (this.#activeTab) {
      const prevItem = this.#tabItems.get(this.#activeTab);
      if (prevItem) {
        prevItem.classList.remove('active');
      }
    }

    // 新しいタブをアクティブ化
    newItem.classList.add('active');
    this.#activeTab = tabId;

    // コールバック実行
    if (this.#onTabChangeCallback) {
      this.#onTabChangeCallback(tabId);
    }
  }

  /**
   * タブ変更時のコールバックを設定
   * @param {Function} callback - コールバック関数 (tabId) => void
   *
   * @example
   * Nav.onTabChange((tabId) => {
   *   console.log('タブ切替:', tabId);
   *   if (tabId === 'home') {
   *     // ホーム画面表示
   *   }
   * });
   */
  static onTabChange(callback) {
    this.#onTabChangeCallback = callback;
  }

  /**
   * 現在のアクティブタブIDを取得
   * @returns {string|null} アクティブタブID
   */
  static getActiveTab() {
    return this.#activeTab;
  }

  /**
   * タブにバッジを表示
   * @param {string} tabId - タブID
   * @param {number} count - バッジに表示する数値（0で非表示）
   *
   * @example
   * Nav.showBadge('collection', 3); // 図鑑に新着3件
   * Nav.showBadge('shop', 0);       // バッジを消す
   */
  static showBadge(tabId, count) {
    const item = this.#tabItems.get(tabId);
    if (!item) {
      console.warn(`Nav.showBadge: タブ "${tabId}" が見つかりません`);
      return;
    }

    // 既存のバッジを削除
    const existingBadge = item.querySelector('.badge--notification');
    if (existingBadge) {
      existingBadge.remove();
    }

    // count が 0 以下なら非表示
    if (count <= 0) return;

    // 新しいバッジを作成
    const badge = document.createElement('span');
    badge.className = 'badge badge--notification';
    badge.textContent = count > 99 ? '99+' : count;

    // アイコンに相対配置するため、親要素をrelativeに
    item.style.position = 'relative';
    item.appendChild(badge);
  }

  /**
   * タブのバッジを非表示
   * @param {string} tabId - タブID
   */
  static hideBadge(tabId) {
    this.showBadge(tabId, 0);
  }

  /**
   * タブを有効化/無効化
   * @param {string} tabId - タブID
   * @param {boolean} enabled - 有効化するか
   */
  static setTabEnabled(tabId, enabled) {
    const item = this.#tabItems.get(tabId);
    if (!item) {
      console.warn(`Nav.setTabEnabled: タブ "${tabId}" が見つかりません`);
      return;
    }

    if (enabled) {
      item.style.opacity = '1';
      item.style.pointerEvents = 'auto';
    } else {
      item.style.opacity = '0.5';
      item.style.pointerEvents = 'none';
    }
  }
}
