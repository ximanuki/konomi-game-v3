/**
 * GardenView - 庭の描画管理
 *
 * DOM要素を使用した庭の表示システム。
 * オブジェクトのレンダリング、タップイベント処理、ビューポート管理を行う。
 *
 * @module ui/garden-view
 */

/**
 * GardenView クラス
 *
 * 庭のビジュアル表示を担当する。
 * Canvas ではなく DOM を使用することで、タップイベント処理とCSSアニメーションを活用。
 *
 * @class GardenView
 */
export class GardenView {
  /**
   * @param {HTMLElement} container - 庭を表示するコンテナ要素
   */
  constructor(container) {
    // コンテナ要素
    this.container = container;

    // ビューポート（スクロール・ズーム）
    this.viewport = {
      x: 0,
      y: 0,
      scale: 1
    };

    // オブジェクトID -> DOM要素のマップ
    this.objectElements = new Map();

    // タップコールバック（外部から設定可能）
    this.onObjectTap = null;

    // 初期化
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    // コンテナのスタイル設定
    if (this.container) {
      this.container.style.position = 'relative';
      this.container.style.overflow = 'hidden';
      this.container.style.touchAction = 'none'; // iOS対応
    }
  }

  /**
   * オブジェクトのDOM要素を作成
   *
   * @param {Object} object - ゲームオブジェクト（id, type, x, y プロパティ必須）
   * @returns {HTMLElement} 作成されたDOM要素
   */
  createObjectElement(object) {
    // 既存の要素があれば削除
    if (this.objectElements.has(object.id)) {
      this.removeObjectElement(object.id);
    }

    // div要素作成
    const el = document.createElement('div');
    el.className = `garden-object ${object.type}`;
    el.dataset.objectId = object.id;
    el.style.cssText = `
      position: absolute;
      left: ${object.x}px;
      top: ${object.y}px;
      transform: translate(-50%, -100%);
      cursor: pointer;
    `;

    // 画像要素作成
    const img = document.createElement('img');
    img.src = this.getObjectImage(object);
    img.alt = object.type;
    img.style.cssText = `
      display: block;
      pointer-events: none;
      user-select: none;
    `;

    // 画像が読み込めなかった場合のフォールバック
    img.onerror = () => {
      console.warn(`Image not found: ${img.src}`);
      img.style.display = 'none';
    };

    el.appendChild(img);

    // タップイベント（touchstart と click の両対応）
    el.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleObjectTap(object);
    });

    el.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleObjectTap(object);
    });

    // コンテナに追加
    this.container.appendChild(el);
    this.objectElements.set(object.id, el);

    return el;
  }

  /**
   * オブジェクトのDOM要素を削除
   *
   * @param {string} objectId - オブジェクトID
   * @returns {boolean} 削除成功したか
   */
  removeObjectElement(objectId) {
    const el = this.objectElements.get(objectId);
    if (!el) return false;

    el.remove();
    this.objectElements.delete(objectId);
    return true;
  }

  /**
   * 画像パスを取得
   *
   * オブジェクトの種類に応じて適切な画像パスを返す。
   *
   * @param {Object} object - ゲームオブジェクト
   * @returns {string} 画像パス
   */
  getObjectImage(object) {
    // Plant エンティティの場合（成長ステージ付き）
    if (object.constructor.name === 'Plant' || object.stage !== undefined) {
      const stage = object.stage !== undefined ? object.stage : 0;
      return `/assets/images/plants/${object.type}_stage${stage}.png`;
    }

    // Resident エンティティの場合
    if (object.constructor.name === 'Resident' || object.friendship !== undefined) {
      return `/assets/images/residents/${object.type}.png`;
    }

    // Building エンティティの場合
    if (object.constructor.name === 'Building') {
      return `/assets/images/buildings/${object.type}.png`;
    }

    // その他のオブジェクト
    return `/assets/images/objects/${object.type}.png`;
  }

  /**
   * 描画更新
   *
   * 全オブジェクトの位置と表示を更新する。
   * ゲームループから呼ばれる想定。
   *
   * @param {Array<Object>} objects - 表示するオブジェクト配列
   */
  render(objects = []) {
    // 既存の要素で、objectsに含まれないものを削除
    const currentIds = new Set(objects.map(obj => obj.id));
    for (const [id, el] of this.objectElements) {
      if (!currentIds.has(id)) {
        this.removeObjectElement(id);
      }
    }

    // オブジェクトごとに更新または作成
    for (const object of objects) {
      let el = this.objectElements.get(object.id);

      // 要素が存在しない場合は作成
      if (!el) {
        el = this.createObjectElement(object);
      }

      // 位置更新
      el.style.left = `${object.x}px`;
      el.style.top = `${object.y}px`;

      // 植物の成長ステージ更新
      if (object.constructor.name === 'Plant' || object.stage !== undefined) {
        const img = el.querySelector('img');
        if (img) {
          const newSrc = this.getObjectImage(object);
          if (img.src !== newSrc) {
            img.src = newSrc;
          }
        }
      }

      // z-indexの設定（Y座標が大きいほど手前に表示）
      el.style.zIndex = Math.floor(object.y);
    }
  }

  /**
   * オブジェクトタップ処理
   *
   * @param {Object} object - タップされたオブジェクト
   */
  handleObjectTap(object) {
    if (this.onObjectTap) {
      this.onObjectTap(object);
    }
  }

  /**
   * ビューポート設定（スクロール・ズーム）
   *
   * @param {number} x - スクロールX座標
   * @param {number} y - スクロールY座標
   * @param {number} scale - ズーム倍率（1.0 = 等倍）
   */
  setViewport(x, y, scale) {
    this.viewport = { x, y, scale };

    // transform適用
    this.container.style.transform =
      `translate(${-x}px, ${-y}px) scale(${scale})`;
    this.container.style.transformOrigin = '0 0';
  }

  /**
   * ビューポートをリセット
   */
  resetViewport() {
    this.setViewport(0, 0, 1);
  }

  /**
   * オブジェクトにフォーカス（画面中央に表示）
   *
   * @param {Object} object - フォーカスするオブジェクト
   * @param {number} [scale=1] - ズーム倍率
   */
  focusOnObject(object, scale = 1) {
    const containerRect = this.container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    const x = object.x - centerX / scale;
    const y = object.y - centerY / scale;

    this.setViewport(x, y, scale);
  }

  /**
   * 全オブジェクトのDOM要素をクリア
   */
  clear() {
    for (const [id, el] of this.objectElements) {
      el.remove();
    }
    this.objectElements.clear();
  }

  /**
   * 特定のオブジェクトを強調表示
   *
   * @param {string} objectId - オブジェクトID
   * @param {boolean} highlight - 強調するか
   */
  highlightObject(objectId, highlight = true) {
    const el = this.objectElements.get(objectId);
    if (!el) return;

    if (highlight) {
      el.classList.add('highlighted');
    } else {
      el.classList.remove('highlighted');
    }
  }

  /**
   * タップコールバックを設定
   *
   * @param {Function} callback - コールバック関数 (object) => void
   */
  setTapHandler(callback) {
    this.onObjectTap = callback;
  }

  /**
   * スクリーン座標をワールド座標に変換
   *
   * @param {number} screenX - スクリーンX座標
   * @param {number} screenY - スクリーンY座標
   * @returns {Object} ワールド座標 { x, y }
   */
  screenToWorld(screenX, screenY) {
    const containerRect = this.container.getBoundingClientRect();
    const relativeX = screenX - containerRect.left;
    const relativeY = screenY - containerRect.top;

    return {
      x: (relativeX / this.viewport.scale) + this.viewport.x,
      y: (relativeY / this.viewport.scale) + this.viewport.y
    };
  }

  /**
   * ワールド座標をスクリーン座標に変換
   *
   * @param {number} worldX - ワールドX座標
   * @param {number} worldY - ワールドY座標
   * @returns {Object} スクリーン座標 { x, y }
   */
  worldToScreen(worldX, worldY) {
    const containerRect = this.container.getBoundingClientRect();

    return {
      x: (worldX - this.viewport.x) * this.viewport.scale + containerRect.left,
      y: (worldY - this.viewport.y) * this.viewport.scale + containerRect.top
    };
  }
}
