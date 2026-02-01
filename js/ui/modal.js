/**
 * Modal - モーダルダイアログ管理クラス
 *
 * 6歳児にも使いやすいシンプルなモーダルダイアログを提供します。
 * 確認ダイアログ、アラート、カスタムコンテンツ表示に対応。
 */
export class Modal {
  /**
   * モーダル要素のキャッシュ
   * @private
   */
  static #overlay = null;
  static #modal = null;
  static #currentResolve = null;

  /**
   * モーダルを初期化（DOMに要素を追加）
   */
  static init() {
    if (this.#overlay) return; // 既に初期化済み

    // オーバーレイ作成
    this.#overlay = document.createElement('div');
    this.#overlay.className = 'modal-overlay';
    this.#overlay.addEventListener('click', () => {
      // オーバーレイクリックで閉じる（確認ダイアログ以外）
      if (!this.#overlay.dataset.preventClose) {
        this.hide();
      }
    });

    // モーダル本体作成
    this.#modal = document.createElement('div');
    this.#modal.className = 'modal';
    this.#modal.addEventListener('click', (e) => {
      // モーダル内のクリックは伝播を止める
      e.stopPropagation();
    });

    // DOMに追加
    document.body.appendChild(this.#overlay);
    document.body.appendChild(this.#modal);
  }

  /**
   * モーダルを表示
   * @param {string|HTMLElement} content - 表示するコンテンツ（HTML文字列またはDOM要素）
   * @param {Object} options - オプション
   * @param {string} [options.title] - タイトル
   * @param {boolean} [options.showClose=true] - 閉じるボタンを表示するか
   * @param {boolean} [options.closeOnOverlay=true] - オーバーレイクリックで閉じるか
   * @param {Array} [options.buttons] - フッターボタン [{text: 'OK', class: 'button--primary', onClick: fn}]
   *
   * @example
   * Modal.show('<p>たねを植えました！</p>', {
   *   title: 'せいこう',
   *   buttons: [{text: 'OK', class: 'button--primary', onClick: () => Modal.hide()}]
   * });
   */
  static show(content, options = {}) {
    this.init();

    const {
      title = null,
      showClose = true,
      closeOnOverlay = true,
      buttons = []
    } = options;

    // モーダル内容をクリア
    this.#modal.innerHTML = '';

    // オーバーレイクリック制御
    if (closeOnOverlay) {
      delete this.#overlay.dataset.preventClose;
    } else {
      this.#overlay.dataset.preventClose = 'true';
    }

    // ヘッダー（タイトル）
    if (title) {
      const header = document.createElement('div');
      header.className = 'modal__header';
      header.innerHTML = `<h2 class="modal__title">${title}</h2>`;
      this.#modal.appendChild(header);
    }

    // 閉じるボタン
    if (showClose) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'modal__close';
      closeBtn.textContent = '×';
      closeBtn.addEventListener('click', () => this.hide());
      this.#modal.appendChild(closeBtn);
    }

    // ボディ
    const body = document.createElement('div');
    body.className = 'modal__body';

    if (typeof content === 'string') {
      body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      body.appendChild(content);
    }

    this.#modal.appendChild(body);

    // フッター（ボタン）
    if (buttons.length > 0) {
      const footer = document.createElement('div');
      footer.className = 'modal__footer';

      buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = `button ${btn.class || 'button--secondary'}`;
        button.textContent = btn.text;
        button.addEventListener('click', () => {
          if (btn.onClick) btn.onClick();
        });
        footer.appendChild(button);
      });

      this.#modal.appendChild(footer);
    }

    // 表示
    requestAnimationFrame(() => {
      this.#overlay.classList.add('active');
      this.#modal.classList.add('active');
    });
  }

  /**
   * モーダルを非表示
   */
  static hide() {
    if (!this.#overlay) return;

    this.#overlay.classList.remove('active');
    this.#modal.classList.remove('active');

    // 保留中のPromiseを解決（キャンセル扱い）
    if (this.#currentResolve) {
      this.#currentResolve(false);
      this.#currentResolve = null;
    }
  }

  /**
   * 確認ダイアログを表示（Promise版）
   * @param {string} message - 確認メッセージ
   * @param {Object} options - オプション
   * @param {string} [options.title='かくにん'] - タイトル
   * @param {string} [options.okText='OK'] - OKボタンのテキスト
   * @param {string} [options.cancelText='キャンセル'] - キャンセルボタンのテキスト
   * @returns {Promise<boolean>} OKならtrue、キャンセルならfalse
   *
   * @example
   * const result = await Modal.confirm('たねを植えますか？');
   * if (result) {
   *   // OK が押された
   * }
   */
  static confirm(message, options = {}) {
    const {
      title = 'かくにん',
      okText = 'OK',
      cancelText = 'キャンセル'
    } = options;

    return new Promise((resolve) => {
      this.#currentResolve = resolve;

      this.show(
        `<p style="text-align: center; font-size: 18px; line-height: 1.6;">${message}</p>`,
        {
          title,
          showClose: false,
          closeOnOverlay: false,
          buttons: [
            {
              text: cancelText,
              class: 'button--secondary button--small',
              onClick: () => {
                this.hide();
                resolve(false);
                this.#currentResolve = null;
              }
            },
            {
              text: okText,
              class: 'button--primary button--small',
              onClick: () => {
                this.hide();
                resolve(true);
                this.#currentResolve = null;
              }
            }
          ]
        }
      );
    });
  }

  /**
   * アラートダイアログを表示（Promise版）
   * @param {string} message - アラートメッセージ
   * @param {Object} options - オプション
   * @param {string} [options.title='おしらせ'] - タイトル
   * @param {string} [options.okText='OK'] - OKボタンのテキスト
   * @returns {Promise<void>}
   *
   * @example
   * await Modal.alert('たねがありません！');
   */
  static alert(message, options = {}) {
    const {
      title = 'おしらせ',
      okText = 'OK'
    } = options;

    return new Promise((resolve) => {
      this.show(
        `<p style="text-align: center; font-size: 18px; line-height: 1.6;">${message}</p>`,
        {
          title,
          showClose: false,
          closeOnOverlay: false,
          buttons: [
            {
              text: okText,
              class: 'button--primary',
              onClick: () => {
                this.hide();
                resolve();
              }
            }
          ]
        }
      );
    });
  }
}
