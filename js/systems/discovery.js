/**
 * DiscoverySystem - 発見システム
 * たねの組み合わせ発見、レシピ管理、図鑑記録
 */

import { Storage } from '../core/storage.js';

export class DiscoverySystem {
  /**
   * 組み合わせレシピの定義
   * @returns {Array<{id: string, ingredients: Array, result: string, description: string}>}
   */
  static getCombinationRecipes() {
    return [
      {
        id: 'rainbow_flower',
        ingredients: [
          { type: 'flower', color: 'same', count: 2, distance: 100 }
        ],
        result: 'rainbow_flower',
        description: '同じ色の花を2つ近くに植えると、レインボーフラワーが咲く'
      },
      {
        id: 'forest',
        ingredients: [
          { type: 'tree', count: 3, distance: 150 }
        ],
        result: 'forest',
        description: '木を3本近くに植えると、森ができて動物が住み着く'
      },
      {
        id: 'lotus',
        ingredients: [
          { type: 'pond', count: 1 },
          { type: 'flower', count: 1, distance: 100 }
        ],
        result: 'lotus',
        description: '池の近くに花を植えると、蓮の花が咲き、かえるが来る'
      },
      {
        id: 'village',
        ingredients: [
          { type: 'house', count: 3, distance: 200 }
        ],
        result: 'village',
        description: '家を3軒近くに建てると、村になって住人が増える'
      },
      {
        id: 'sky_path',
        ingredients: [
          { type: 'rainbow', count: 1 },
          { type: 'cloud', count: 1, distance: 150 }
        ],
        result: 'sky_path',
        description: '虹と雲を近くに配置すると、空の世界への道が開く'
      },
      {
        id: 'butterfly_garden',
        ingredients: [
          { type: 'flower', count: 5, distance: 200 }
        ],
        result: 'butterfly_garden',
        description: '花を5本近くに植えると、蝶々の庭ができる'
      },
      {
        id: 'mushroom_ring',
        ingredients: [
          { type: 'mushroom', count: 4, distance: 80 }
        ],
        result: 'mushroom_ring',
        description: 'きのこを4つ円形に配置すると、妖精の輪ができる'
      }
    ];
  }

  /**
   * 組み合わせの判定
   * @param {Array} objects - 庭に配置されているオブジェクト配列
   * @returns {Array<{recipe: Object, triggered: boolean}>} 発見された組み合わせ
   */
  static checkCombinations(objects) {
    const recipes = this.getCombinationRecipes();
    const discoveries = [];

    for (const recipe of recipes) {
      const result = this.checkRecipe(recipe, objects);
      if (result.triggered) {
        discoveries.push({
          recipe,
          triggered: true,
          objects: result.matchedObjects
        });
      }
    }

    return discoveries;
  }

  /**
   * 特定のレシピが成立しているか判定
   * @param {Object} recipe - レシピ定義
   * @param {Array} objects - オブジェクト配列
   * @returns {{triggered: boolean, matchedObjects: Array}}
   */
  static checkRecipe(recipe, objects) {
    const { ingredients } = recipe;
    const matchedObjects = [];

    for (const ingredient of ingredients) {
      const { type, color, count, distance } = ingredient;

      // 該当するタイプのオブジェクトを抽出
      let candidates = objects.filter(obj => obj.type === type);

      // 色指定がある場合
      if (color === 'same') {
        // 同じ色のものを探す
        const colorGroups = this.groupByColor(candidates);
        for (const [colorValue, group] of Object.entries(colorGroups)) {
          if (group.length >= count) {
            const nearby = this.findNearbyObjects(group, count, distance || 100);
            if (nearby.length >= count) {
              matchedObjects.push(...nearby);
              break;
            }
          }
        }
      } else {
        // 距離判定
        if (count > 1 && distance) {
          const nearby = this.findNearbyObjects(candidates, count, distance);
          if (nearby.length >= count) {
            matchedObjects.push(...nearby);
          }
        } else if (candidates.length >= count) {
          matchedObjects.push(...candidates.slice(0, count));
        }
      }
    }

    // 全ての材料が揃っているか
    const requiredCount = ingredients.reduce((sum, ing) => sum + ing.count, 0);
    const triggered = matchedObjects.length >= requiredCount;

    return { triggered, matchedObjects };
  }

  /**
   * 色でグループ化
   * @param {Array} objects - オブジェクト配列
   * @returns {Object} 色ごとにグループ化されたオブジェクト
   */
  static groupByColor(objects) {
    const groups = {};
    for (const obj of objects) {
      const color = obj.color || 'default';
      if (!groups[color]) {
        groups[color] = [];
      }
      groups[color].push(obj);
    }
    return groups;
  }

  /**
   * 近くにあるオブジェクトを探す
   * @param {Array} objects - オブジェクト配列
   * @param {number} count - 必要な数
   * @param {number} maxDistance - 最大距離
   * @returns {Array} 近くにあるオブジェクト
   */
  static findNearbyObjects(objects, count, maxDistance) {
    if (objects.length < count) return [];

    // 最初のオブジェクトを基準に、近くのものを探す
    const result = [objects[0]];

    for (let i = 1; i < objects.length; i++) {
      const obj = objects[i];
      const distance = this.calculateDistance(objects[0], obj);

      if (distance <= maxDistance) {
        result.push(obj);
        if (result.length >= count) {
          return result;
        }
      }
    }

    return result.length >= count ? result : [];
  }

  /**
   * 2つのオブジェクト間の距離を計算
   * @param {Object} obj1 - オブジェクト1
   * @param {Object} obj2 - オブジェクト2
   * @returns {number} 距離（ピクセル）
   */
  static calculateDistance(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 発見を記録
   * @param {Object} discovery - 発見内容 {id, name, description, timestamp}
   */
  static recordDiscovery(discovery) {
    const discoveries = this.getDiscoveries();

    // 既に発見済みかチェック
    const exists = discoveries.some(d => d.id === discovery.id);
    if (exists) {
      return false; // 既に発見済み
    }

    // 新規発見を追加
    discoveries.push({
      ...discovery,
      timestamp: Date.now(),
      isNew: true // 未読フラグ
    });

    Storage.set('discoveries', discoveries);
    return true; // 新規発見
  }

  /**
   * 発見済みリストを取得
   * @returns {Array<Object>} 発見済みの組み合わせ配列
   */
  static getDiscoveries() {
    return Storage.get('discoveries', []);
  }

  /**
   * 発見の既読化
   * @param {string} discoveryId - 発見ID
   */
  static markAsRead(discoveryId) {
    const discoveries = this.getDiscoveries();
    const discovery = discoveries.find(d => d.id === discoveryId);
    if (discovery) {
      discovery.isNew = false;
      Storage.set('discoveries', discoveries);
    }
  }

  /**
   * 発見図鑑の達成率を取得
   * @returns {number} 達成率（0-100）
   */
  static getCompletionRate() {
    const totalRecipes = this.getCombinationRecipes().length;
    const discovered = this.getDiscoveries().length;
    return Math.floor((discovered / totalRecipes) * 100);
  }

  /**
   * 未発見のレシピを取得（ヒント用）
   * @returns {Array<Object>} 未発見レシピの配列
   */
  static getUndiscoveredRecipes() {
    const recipes = this.getCombinationRecipes();
    const discoveries = this.getDiscoveries();
    const discoveredIds = discoveries.map(d => d.id);

    return recipes.filter(recipe => !discoveredIds.includes(recipe.id));
  }
}
