/**
 * 図鑑UI管理 - まほうのにわ
 * たねずかん、おはなずかん、どうぶつずかん、たてものずかん
 */

import { SEEDS, getAllSeedIds } from '../data/seeds.js';
import { PLANTS, getAllPlantIds } from '../data/plants.js';
import { RESIDENTS, getAllResidentIds } from '../data/residents.js';

export class Collection {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentTab = 'plants'; // デフォルトは植物図鑑
    this.discoveredData = null; // プレイヤーの発見データ
  }

  /**
   * 図鑑を初期化
   * @param {Object} saveData - セーブデータ
   */
  init(saveData) {
    if (!saveData || !saveData.collection) {
      console.warn('[Collection] No save data provided');
      return;
    }

    this.discoveredData = saveData.collection;
    this.render();
  }

  /**
   * 図鑑全体を描画
   */
  render() {
    if (!this.container) {
      console.error('[Collection] Container element not found');
      return;
    }

    this.container.innerHTML = `
      <div class="collection-ui">
        ${this.renderHeader()}
        ${this.renderTabs()}
        ${this.renderContent()}
      </div>
    `;

    this.attachEventListeners();
  }

  /**
   * ヘッダー部分を描画（発見率）
   * @returns {string} HTML文字列
   */
  renderHeader() {
    const stats = this.calculateStats();

    return `
      <div class="collection-header">
        <h2>📖 ずかん</h2>
        <div class="collection-stats">
          <div class="stat-item">
            <span class="stat-label">たねずかん</span>
            <span class="stat-value">${stats.seeds.discovered}/${stats.seeds.total}</span>
            <span class="stat-percent">${stats.seeds.percentage}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">おはなずかん</span>
            <span class="stat-value">${stats.plants.discovered}/${stats.plants.total}</span>
            <span class="stat-percent">${stats.plants.percentage}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">どうぶつずかん</span>
            <span class="stat-value">${stats.residents.discovered}/${stats.residents.total}</span>
            <span class="stat-percent">${stats.residents.percentage}%</span>
          </div>
        </div>
        <div class="collection-overall">
          <span>全体の発見率: ${stats.overall.percentage}%</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${stats.overall.percentage}%"></div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * タブ部分を描画
   * @returns {string} HTML文字列
   */
  renderTabs() {
    const tabs = [
      { id: 'seeds', label: '🌱 たね', emoji: '🌱' },
      { id: 'plants', label: '🌸 おはな', emoji: '🌸' },
      { id: 'residents', label: '🐰 どうぶつ', emoji: '🐰' },
      { id: 'buildings', label: '🏠 たてもの', emoji: '🏠' }
    ];

    return `
      <div class="collection-tabs">
        ${tabs.map(tab => `
          <button
            class="tab-button ${this.currentTab === tab.id ? 'active' : ''}"
            data-tab="${tab.id}"
          >
            ${tab.emoji} ${tab.label}
          </button>
        `).join('')}
      </div>
    `;
  }

  /**
   * コンテンツ部分を描画
   * @returns {string} HTML文字列
   */
  renderContent() {
    switch (this.currentTab) {
      case 'seeds':
        return this.renderSeeds();
      case 'plants':
        return this.renderPlants();
      case 'residents':
        return this.renderResidents();
      case 'buildings':
        return this.renderBuildings();
      default:
        return '<div class="collection-content">エラー: タブが見つかりません</div>';
    }
  }

  /**
   * たねずかんを描画
   * @returns {string} HTML文字列
   */
  renderSeeds() {
    const seedIds = getAllSeedIds();
    const discoveredSeeds = this.discoveredData?.seeds || [];

    const seedItems = seedIds.map(seedId => {
      const seed = SEEDS[seedId];
      const discovered = discoveredSeeds.includes(seedId);

      return `
        <div class="collection-item ${discovered ? 'discovered' : 'undiscovered'}">
          <div class="item-image">
            ${discovered ? seed.emoji : '❓'}
          </div>
          <div class="item-info">
            <h3 class="item-name">${discovered ? seed.name : '？？？'}</h3>
            ${discovered ? `
              <p class="item-description">${seed.description}</p>
              <div class="item-rarity">${'★'.repeat(seed.rarity)}${'☆'.repeat(5 - seed.rarity)}</div>
            ` : `
              <p class="item-description">まだ みつけていません</p>
            `}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="collection-content">
        <div class="collection-grid">
          ${seedItems}
        </div>
      </div>
    `;
  }

  /**
   * おはなずかん（植物図鑑）を描画
   * @returns {string} HTML文字列
   */
  renderPlants() {
    const plantIds = getAllPlantIds();
    const discoveredPlants = this.discoveredData?.plants || [];

    const plantItems = plantIds.map(plantId => {
      const plant = PLANTS[plantId];
      const discovered = discoveredPlants.includes(plantId);

      return `
        <div class="collection-item ${discovered ? 'discovered' : 'undiscovered'}">
          <div class="item-image">
            ${discovered ? `
              <img src="${plant.imagePath}_stage3.png" alt="${plant.name}" />
            ` : `
              <div class="unknown-item">？</div>
            `}
          </div>
          <div class="item-info">
            <h3 class="item-name">${discovered ? plant.name : '？？？'}</h3>
            ${discovered ? `
              <p class="item-description">${plant.description}</p>
              <div class="item-meta">
                <span class="item-type">${this.getPlantTypeLabel(plant.type)}</span>
                <span class="item-rarity">${'★'.repeat(plant.rarity)}${'☆'.repeat(5 - plant.rarity)}</span>
              </div>
            ` : `
              <p class="item-description">まだ みつけていません</p>
            `}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="collection-content">
        <div class="collection-grid">
          ${plantItems}
        </div>
      </div>
    `;
  }

  /**
   * どうぶつずかん（住人図鑑）を描画
   * @returns {string} HTML文字列
   */
  renderResidents() {
    const residentIds = getAllResidentIds();
    const discoveredResidents = this.discoveredData?.residents || [];

    const residentItems = residentIds.map(residentId => {
      const resident = RESIDENTS[residentId];
      const discovered = discoveredResidents.includes(residentId);

      return `
        <div class="collection-item ${discovered ? 'discovered' : 'undiscovered'}">
          <div class="item-image">
            ${discovered ? `
              <img src="${resident.imagePath}" alt="${resident.name}" />
            ` : `
              <div class="unknown-item">？</div>
            `}
          </div>
          <div class="item-info">
            <h3 class="item-name">${discovered ? resident.name : '？？？'}</h3>
            ${discovered ? `
              <p class="item-description">${resident.description}</p>
              <div class="item-meta">
                <span class="item-area">📍 ${this.getAreaLabel(resident.area)}</span>
                <span class="item-rarity">${'★'.repeat(resident.rarity)}${'☆'.repeat(5 - resident.rarity)}</span>
              </div>
            ` : `
              <p class="item-description">まだ であっていません</p>
            `}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="collection-content">
        <div class="collection-grid">
          ${residentItems}
        </div>
      </div>
    `;
  }

  /**
   * たてものずかんを描画
   * @returns {string} HTML文字列
   */
  renderBuildings() {
    const buildingPlants = Object.values(PLANTS).filter(
      plant => plant.type === 'building'
    );
    const discoveredBuildings = this.discoveredData?.buildings || [];

    const buildingItems = buildingPlants.map(building => {
      const discovered = discoveredBuildings.includes(building.id);

      return `
        <div class="collection-item ${discovered ? 'discovered' : 'undiscovered'}">
          <div class="item-image">
            ${discovered ? `
              <img src="${building.imagePath}_stage3.png" alt="${building.name}" />
            ` : `
              <div class="unknown-item">？</div>
            `}
          </div>
          <div class="item-info">
            <h3 class="item-name">${discovered ? building.name : '？？？'}</h3>
            ${discovered ? `
              <p class="item-description">${building.description}</p>
              <div class="item-meta">
                <span class="item-rarity">${'★'.repeat(building.rarity)}${'☆'.repeat(5 - building.rarity)}</span>
              </div>
            ` : `
              <p class="item-description">まだ つくっていません</p>
            `}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="collection-content">
        <div class="collection-grid">
          ${buildingItems}
        </div>
      </div>
    `;
  }

  /**
   * 統計情報を計算
   * @returns {Object} 統計データ
   */
  calculateStats() {
    if (!this.discoveredData) {
      return {
        seeds: { discovered: 0, total: 0, percentage: 0 },
        plants: { discovered: 0, total: 0, percentage: 0 },
        residents: { discovered: 0, total: 0, percentage: 0 },
        overall: { discovered: 0, total: 0, percentage: 0 }
      };
    }

    const seedsTotal = getAllSeedIds().length;
    const plantsTotal = getAllPlantIds().length;
    const residentsTotal = getAllResidentIds().length;

    const seedsDiscovered = this.discoveredData.seeds?.length || 0;
    const plantsDiscovered = this.discoveredData.plants?.length || 0;
    const residentsDiscovered = this.discoveredData.residents?.length || 0;

    const overallTotal = seedsTotal + plantsTotal + residentsTotal;
    const overallDiscovered = seedsDiscovered + plantsDiscovered + residentsDiscovered;

    return {
      seeds: {
        discovered: seedsDiscovered,
        total: seedsTotal,
        percentage: Math.floor((seedsDiscovered / seedsTotal) * 100) || 0
      },
      plants: {
        discovered: plantsDiscovered,
        total: plantsTotal,
        percentage: Math.floor((plantsDiscovered / plantsTotal) * 100) || 0
      },
      residents: {
        discovered: residentsDiscovered,
        total: residentsTotal,
        percentage: Math.floor((residentsDiscovered / residentsTotal) * 100) || 0
      },
      overall: {
        discovered: overallDiscovered,
        total: overallTotal,
        percentage: Math.floor((overallDiscovered / overallTotal) * 100) || 0
      }
    };
  }

  /**
   * イベントリスナーを設定
   */
  attachEventListeners() {
    const tabButtons = this.container.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        this.switchTab(tab);
      });
    });
  }

  /**
   * タブを切り替え
   * @param {string} tabId - タブID
   */
  switchTab(tabId) {
    if (this.currentTab === tabId) return;

    this.currentTab = tabId;
    this.render();
  }

  /**
   * たねずかんを表示
   */
  showSeeds() {
    this.switchTab('seeds');
  }

  /**
   * おはなずかんを表示
   */
  showPlants() {
    this.switchTab('plants');
  }

  /**
   * どうぶつずかんを表示
   */
  showResidents() {
    this.switchTab('residents');
  }

  /**
   * たてものずかんを表示
   */
  showBuildings() {
    this.switchTab('buildings');
  }

  /**
   * 植物タイプのラベルを取得
   * @param {string} type - タイプ
   * @returns {string} 日本語ラベル
   */
  getPlantTypeLabel(type) {
    const labels = {
      flower: '🌸 おはな',
      tree: '🌲 き',
      water: '💧 みず',
      building: '🏠 たてもの',
      ground: '🌿 くさ',
      vegetable: '🥕 やさい',
      fungus: '🍄 きのこ',
      shrub: '🌳 しげみ',
      garden: '🌺 にわ',
      magic: '✨ まほう',
      creature: '🐉 いきもの'
    };

    return labels[type] || type;
  }

  /**
   * エリアラベルを取得
   * @param {string} area - エリア名
   * @returns {string} 日本語ラベル
   */
  getAreaLabel(area) {
    const labels = {
      garden: 'はじまりのにわ',
      forest: 'おおきなもり',
      lake: 'みずうみ',
      cave: 'ふしぎなどうくつ',
      sky: 'そらのくに',
      town: 'むら',
      secret: 'ひみつのばしょ'
    };

    return labels[area] || area;
  }

  /**
   * 図鑑データを更新
   * @param {Object} newDiscoveryData - 新しい発見データ
   */
  updateData(newDiscoveryData) {
    this.discoveredData = newDiscoveryData;
    this.render();
  }

  /**
   * 図鑑を閉じる
   */
  close() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// シングルトンインスタンス（必要に応じて使用）
export const collection = new Collection(document.getElementById('collection-container'));
