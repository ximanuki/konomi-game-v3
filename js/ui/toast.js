/**
 * Toast - トースト通知管理クラス
 *
 * 画面下部に一時的な通知を表示します。
 * 複数のトーストをスタック表示可能。
 */
export class Toast {
  /**
   * トーストコンテナ
   * @private
   */
  static #container = null;

  /**
   * アクティブなトーストのリスト
   * @private
   */
  static #activeToasts = [];

  /**
   * トーストコンテナを初期化
   */
  static init() {
    if (this.#container) return; // 既に初期化済み

    this.#container = document.createElement('div');
    this.#container.className = 'toast-container';
    document.body.appendChild(this.#container);
  }

  /**
   * トーストを表示
   * @param {string} message - 表示するメッセージ
   * @param {string} [type='info'] - トーストタイプ ('success', 'warning', 'info')
   * @param {number} [duration=3000] - 表示時間（ミリ秒）
   *
   * @example
   * Toast.show('たねを植えました！', 'success');
   * Toast.show('みずがたりません', 'warning', 2000);
   */
  static show(message, type = 'info', duration = 3000) {
    this.init();

    // トースト要素作成
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    // アイコン追加
    const icon = this.#getIcon(type);
    if (icon) {
      toast.innerHTML = `<span class="toast__icon">${icon}</span>${message}`;
    } else {
      toast.textContent = message;
    }

    // コンテナに追加
    this.#container.appendChild(toast);
    this.#activeToasts.push(toast);

    // 自動消去タイマー設定
    setTimeout(() => {
      this.#removeToast(toast);
    }, duration);
  }

  /**
   * トーストを削除
   * @private
   * @param {HTMLElement} toast - 削除するトースト要素
   */
  static #removeToast(toast) {
    // フェードアウトアニメーション
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease-out';

    // アニメーション完了後に削除
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }

      // リストから削除
      const index = this.#activeToasts.indexOf(toast);
      if (index > -1) {
        this.#activeToasts.splice(index, 1);
      }
    }, 300);
  }

  /**
   * タイプに応じたアイコンを取得
   * @private
   * @param {string} type - トーストタイプ
   * @returns {string} アイコン文字（絵文字）
   */
  static #getIcon(type) {
    const icons = {
      success: '✓',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || null;
  }

  /**
   * 全てのトーストを削除
   */
  static clear() {
    this.#activeToasts.forEach(toast => {
      this.#removeToast(toast);
    });
    this.#activeToasts = [];
  }

  /**
   * 成功トーストを表示（ショートカット）
   * @param {string} message - メッセージ
   * @param {number} [duration=3000] - 表示時間
   */
  static success(message, duration = 3000) {
    this.show(message, 'success', duration);
  }

  /**
   * 警告トーストを表示（ショートカット）
   * @param {string} message - メッセージ
   * @param {number} [duration=3000] - 表示時間
   */
  static warning(message, duration = 3000) {
    this.show(message, 'warning', duration);
  }

  /**
   * 情報トーストを表示（ショートカット）
   * @param {string} message - メッセージ
   * @param {number} [duration=3000] - 表示時間
   */
  static info(message, duration = 3000) {
    this.show(message, 'info', duration);
  }
}
