# 🔧 まほうのにわ - 技術設計書 v3.1

**バージョン:** 3.1（全面改訂）  
**アーキテクチャ:** 箱庭シミュレーション + リアルタイム連動

---

## 📁 プロジェクト構成

```
konomi-app-v3/
├── index.html
├── manifest.json
├── sw.js
├── css/
│   ├── base.css           # 変数、リセット
│   ├── garden.css         # 庭の表示
│   ├── ui.css             # UIコンポーネント
│   └── animations.css     # アニメーション
├── js/
│   ├── app.js             # エントリポイント
│   ├── core/
│   │   ├── engine.js      # ゲームエンジン
│   │   ├── world.js       # 世界管理
│   │   ├── time.js        # 時間管理（リアル連動）
│   │   ├── storage.js     # データ永続化
│   │   ├── audio.js       # 環境音・SE
│   │   └── haptics.js     # 触覚フィードバック
│   ├── entities/
│   │   ├── seed.js        # たね
│   │   ├── plant.js       # 植物
│   │   ├── resident.js    # 住人
│   │   └── building.js    # 建物
│   ├── systems/
│   │   ├── growth.js      # 成長システム
│   │   ├── watering.js    # 水やりシステム
│   │   ├── friendship.js  # なかよし度
│   │   ├── quest.js       # おつかい
│   │   ├── discovery.js   # 発見システム
│   │   └── daily.js       # デイリーボーナス
│   ├── ui/
│   │   ├── garden-view.js # 庭表示
│   │   ├── modal.js       # モーダル
│   │   ├── toast.js       # トースト
│   │   ├── nav.js         # ナビゲーション
│   │   └── collection.js  # 図鑑
│   └── data/
│       ├── seeds.js       # たねマスターデータ
│       ├── plants.js      # 植物マスターデータ
│       ├── residents.js   # 住人マスターデータ
│       └── quests.js      # クエストマスターデータ
├── assets/
│   ├── images/
│   │   ├── garden/        # 庭の背景
│   │   ├── plants/        # 植物画像
│   │   ├── residents/     # 住人画像
│   │   ├── buildings/     # 建物画像
│   │   ├── ui/            # UIアイコン
│   │   └── effects/       # エフェクト
│   └── audio/
│       ├── ambient/       # 環境音
│       └── se/            # 効果音
└── docs/
```

---

## 🎮 ゲームエンジン設計

### アーキテクチャ概要

```
┌─────────────────────────────────────────────────────────┐
│                      App (app.js)                       │
│  - 初期化、ライフサイクル管理                            │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Engine    │   │    World    │   │     UI      │
│ (engine.js) │   │ (world.js)  │   │ (ui/*.js)   │
│             │   │             │   │             │
│ - ゲームループ │   │ - エンティティ │   │ - 表示      │
│ - 更新処理   │   │ - 空間管理   │   │ - 入力受付  │
└─────────────┘   └─────────────┘   └─────────────┘
        │                  │                  │
        ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                   Systems (systems/*.js)                │
│  - growth.js: 成長計算                                  │
│  - watering.js: 水やり処理                              │
│  - friendship.js: なかよし度                            │
│  - quest.js: クエスト管理                               │
│  - discovery.js: 発見判定                               │
│  - daily.js: デイリーボーナス                           │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Core (core/*.js)                      │
│  - storage.js: データ保存                               │
│  - time.js: 時間管理                                    │
│  - audio.js: 音声                                       │
└─────────────────────────────────────────────────────────┘
```

### ゲームループ

```javascript
// js/core/engine.js
class Engine {
  constructor() {
    this.lastUpdate = Date.now();
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    this.lastUpdate = Date.now();
    this.loop();
  }

  stop() {
    this.isRunning = false;
  }

  loop() {
    if (!this.isRunning) return;

    const now = Date.now();
    const deltaTime = now - this.lastUpdate;
    this.lastUpdate = now;

    // システム更新（1秒ごとで十分）
    if (deltaTime >= 1000) {
      this.update(deltaTime);
    }

    // アニメーション用（60fps）
    this.render();

    requestAnimationFrame(() => this.loop());
  }

  update(deltaTime) {
    // 成長システム更新
    GrowthSystem.update(deltaTime);
    
    // 住人行動更新
    ResidentSystem.update(deltaTime);
    
    // クエスト確認
    QuestSystem.update();
  }

  render() {
    // 庭の描画更新
    GardenView.render();
  }
}
```

---

## 💾 データモデル

### ゲームセーブデータ

```javascript
// 全セーブデータの構造
const SaveData = {
  version: 1,
  
  // プレイヤー情報
  player: {
    name: "このみ",
    level: 1,                    // にわしレベル
    totalSeeds: 0,               // 累計たね数
    createdAt: null,             // 開始日
  },
  
  // 所持品
  inventory: {
    seeds: {
      green: 5,                  // みどりのたね
      brown: 3,                  // ちゃいろのたね
      pink: 0,                   // ピンクのたね
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
    // 配置されたオブジェクト
    objects: [
      // { id: 'plant_001', type: 'plant', x: 100, y: 200, data: {...} }
    ]
  },
  
  // 住人
  residents: [
    // { id: 'rabbit_01', type: 'rabbit', name: null, friendship: 0, ... }
  ],
  
  // デイリー
  daily: {
    lastLogin: null,
    streak: 0,
    todayWatered: false,
    bonusClaimed: false
  },
  
  // 図鑑
  collection: {
    plants: [],                  // 発見した植物ID
    residents: [],               // 出会った住人ID
    buildings: [],               // 作った建物ID
    discoveries: []              // 発見した組み合わせ
  },
  
  // 進行中クエスト
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
```

### エンティティ定義

```javascript
// js/entities/seed.js
class Seed {
  constructor(type) {
    this.id = generateId();
    this.type = type;            // 'green', 'brown', 'pink', etc.
    this.createdAt = Date.now();
  }
  
  // たねから生まれるもののリスト
  static outcomes = {
    green: ['flower_red', 'flower_blue', 'grass', 'vegetable'],
    brown: ['tree_small', 'tree_large', 'mushroom'],
    pink: ['bunny_house', 'flower_special', 'butterfly'],
    blue: ['pond', 'fountain', 'frog_house'],
    yellow: ['house_small', 'shop', 'windmill'],
    purple: ['rainbow', 'cloud_path', 'fairy_house'],
    gold: ['castle', 'dragon', 'unicorn']
  };
  
  getRandomOutcome() {
    const outcomes = Seed.outcomes[this.type];
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  }
}
```

```javascript
// js/entities/plant.js
class Plant {
  constructor(seedType, x, y) {
    this.id = generateId();
    this.type = Seed.getRandomOutcome(seedType);
    this.x = x;
    this.y = y;
    this.plantedAt = Date.now();
    this.lastWatered = Date.now();
    this.stage = 0;              // 0:種 1:芽 2:つぼみ 3:完成
    this.stageProgress = 0;      // 0-100
  }
  
  // 成長に必要な時間（ステージごと、時間単位）
  static growthTime = {
    0: 1,  // 種→芽: 1時間
    1: 2,  // 芽→つぼみ: 2時間
    2: 3,  // つぼみ→完成: 3時間
  };
  
  // 水やり済みかどうか
  needsWater() {
    const hoursSinceWater = (Date.now() - this.lastWatered) / (1000 * 60 * 60);
    return hoursSinceWater >= 12;  // 12時間で水が必要
  }
  
  // 成長可能かどうか
  canGrow() {
    return !this.needsWater() && this.stage < 3;
  }
  
  water() {
    this.lastWatered = Date.now();
  }
  
  // 成長処理（毎秒呼ばれる）
  updateGrowth(deltaMs) {
    if (!this.canGrow()) return false;
    
    const hoursElapsed = deltaMs / (1000 * 60 * 60);
    const requiredHours = Plant.growthTime[this.stage];
    const progressPerHour = 100 / requiredHours;
    
    this.stageProgress += progressPerHour * hoursElapsed;
    
    if (this.stageProgress >= 100) {
      this.stage++;
      this.stageProgress = 0;
      return true;  // ステージアップ
    }
    return false;
  }
}
```

```javascript
// js/entities/resident.js
class Resident {
  constructor(type) {
    this.id = generateId();
    this.type = type;            // 'rabbit', 'squirrel', 'fairy', etc.
    this.name = null;            // プレイヤーが命名可能
    this.friendship = 0;         // 0-100
    this.arrivedAt = Date.now();
    this.lastInteraction = null;
    this.mood = 'happy';
    this.position = { x: 0, y: 0 };
    this.schedule = this.generateSchedule();
  }
  
  // なかよし度レベル
  getFriendshipLevel() {
    if (this.friendship >= 100) return 'family';
    if (this.friendship >= 75) return 'bestfriend';
    if (this.friendship >= 50) return 'friend';
    if (this.friendship >= 25) return 'acquaintance';
    return 'stranger';
  }
  
  // 1日のスケジュール生成
  generateSchedule() {
    return {
      morning: this.randomActivity(['walk', 'garden', 'home']),
      afternoon: this.randomActivity(['work', 'play', 'visit']),
      evening: this.randomActivity(['shop', 'chat', 'home']),
      night: 'sleep'
    };
  }
  
  // 今の時間の行動
  getCurrentActivity(hour) {
    if (hour >= 6 && hour < 10) return this.schedule.morning;
    if (hour >= 10 && hour < 16) return this.schedule.afternoon;
    if (hour >= 16 && hour < 20) return this.schedule.evening;
    return this.schedule.night;
  }
  
  // なでる
  pet() {
    this.friendship = Math.min(100, this.friendship + 5);
    this.lastInteraction = Date.now();
    this.mood = 'happy';
  }
  
  // プレゼントをあげる
  giveGift(item) {
    const bonus = this.likesItem(item) ? 15 : 10;
    this.friendship = Math.min(100, this.friendship + bonus);
    this.lastInteraction = Date.now();
    this.mood = 'excited';
  }
}
```

---

## ⏰ 時間管理システム

### リアルタイム連動

```javascript
// js/core/time.js
class TimeManager {
  // アプリ復帰時の経過時間計算
  static calculateOfflineProgress() {
    const lastAccess = Storage.get('lastAccess');
    if (!lastAccess) return { hours: 0, isNewDay: true };
    
    const now = Date.now();
    const elapsed = now - lastAccess;
    const hours = elapsed / (1000 * 60 * 60);
    
    // 日付が変わったか
    const lastDate = new Date(lastAccess).toDateString();
    const today = new Date().toDateString();
    const isNewDay = lastDate !== today;
    
    return { hours, isNewDay };
  }
  
  // 現在の時間帯
  static getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 16) return 'afternoon';
    if (hour >= 16 && hour < 20) return 'evening';
    return 'night';
  }
  
  // 現在の季節
  static getSeason() {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }
  
  // アクセス時刻を保存
  static saveAccess() {
    Storage.set('lastAccess', Date.now());
  }
}
```

### オフライン成長処理

```javascript
// js/systems/growth.js
class GrowthSystem {
  // アプリ起動時のオフライン成長を適用
  static applyOfflineGrowth() {
    const { hours } = TimeManager.calculateOfflineProgress();
    if (hours <= 0) return [];
    
    const grownPlants = [];
    const plants = World.getAllPlants();
    
    for (const plant of plants) {
      if (plant.canGrow()) {
        const didGrow = plant.updateGrowth(hours * 60 * 60 * 1000);
        if (didGrow) {
          grownPlants.push(plant);
        }
      }
    }
    
    return grownPlants;  // 成長した植物のリスト（演出用）
  }
  
  // リアルタイム更新（ゲーム中）
  static update(deltaMs) {
    const plants = World.getAllPlants();
    
    for (const plant of plants) {
      plant.updateGrowth(deltaMs);
    }
  }
}
```

---

## 🌍 世界管理

### 空間グリッドシステム

```javascript
// js/core/world.js
class World {
  constructor() {
    this.areas = new Map();
    this.currentArea = 'garden';
    
    // エリア初期化
    this.initArea('garden', { width: 1000, height: 800 });
  }
  
  initArea(name, size) {
    this.areas.set(name, {
      width: size.width,
      height: size.height,
      objects: [],
      grid: new SpatialGrid(size.width, size.height, 50)  // 50pxグリッド
    });
  }
  
  // オブジェクト追加
  addObject(areaName, object) {
    const area = this.areas.get(areaName);
    area.objects.push(object);
    area.grid.insert(object);
  }
  
  // 位置からオブジェクト検索
  getObjectAt(x, y) {
    const area = this.areas.get(this.currentArea);
    return area.grid.query(x, y, 30);  // 30px半径で検索
  }
  
  // 近くのオブジェクト取得（組み合わせ判定用）
  getNearbyObjects(object, radius = 100) {
    const area = this.areas.get(this.currentArea);
    return area.grid.queryRadius(object.x, object.y, radius)
      .filter(o => o.id !== object.id);
  }
}

// 空間グリッド（効率的な位置検索）
class SpatialGrid {
  constructor(width, height, cellSize) {
    this.cellSize = cellSize;
    this.cols = Math.ceil(width / cellSize);
    this.rows = Math.ceil(height / cellSize);
    this.cells = new Map();
  }
  
  getCellKey(x, y) {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);
    return `${col},${row}`;
  }
  
  insert(object) {
    const key = this.getCellKey(object.x, object.y);
    if (!this.cells.has(key)) {
      this.cells.set(key, []);
    }
    this.cells.get(key).push(object);
  }
  
  query(x, y, radius) {
    const results = [];
    const minCol = Math.floor((x - radius) / this.cellSize);
    const maxCol = Math.floor((x + radius) / this.cellSize);
    const minRow = Math.floor((y - radius) / this.cellSize);
    const maxRow = Math.floor((y + radius) / this.cellSize);
    
    for (let col = minCol; col <= maxCol; col++) {
      for (let row = minRow; row <= maxRow; row++) {
        const key = `${col},${row}`;
        const cell = this.cells.get(key);
        if (cell) {
          for (const obj of cell) {
            const dist = Math.hypot(obj.x - x, obj.y - y);
            if (dist <= radius) {
              results.push(obj);
            }
          }
        }
      }
    }
    return results;
  }
}
```

---

## 🎨 描画システム

### Canvas vs DOM

**DOM採用の理由：**
- タップイベント処理が容易
- CSSアニメーションが使える
- デバッグしやすい
- 6歳向けゲームにはパフォーマンス十分

```javascript
// js/ui/garden-view.js
class GardenView {
  constructor(container) {
    this.container = container;
    this.viewport = { x: 0, y: 0, scale: 1 };
    this.objectElements = new Map();
  }
  
  // オブジェクトのDOM要素作成
  createObjectElement(object) {
    const el = document.createElement('div');
    el.className = `garden-object ${object.type}`;
    el.style.cssText = `
      position: absolute;
      left: ${object.x}px;
      top: ${object.y}px;
      transform: translate(-50%, -100%);
    `;
    
    // 画像
    const img = document.createElement('img');
    img.src = this.getObjectImage(object);
    el.appendChild(img);
    
    // タップイベント
    el.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleObjectTap(object);
    });
    
    this.container.appendChild(el);
    this.objectElements.set(object.id, el);
    
    return el;
  }
  
  // 画像パス取得
  getObjectImage(object) {
    if (object instanceof Plant) {
      return `/assets/images/plants/${object.type}_stage${object.stage}.png`;
    }
    if (object instanceof Resident) {
      return `/assets/images/residents/${object.type}.png`;
    }
    return `/assets/images/objects/${object.type}.png`;
  }
  
  // 描画更新
  render() {
    for (const [id, el] of this.objectElements) {
      const object = World.getObject(id);
      if (!object) continue;
      
      // 位置更新
      el.style.left = `${object.x}px`;
      el.style.top = `${object.y}px`;
      
      // 植物の成長ステージ更新
      if (object instanceof Plant) {
        const img = el.querySelector('img');
        img.src = this.getObjectImage(object);
      }
    }
  }
  
  // スクロール・ズーム
  setViewport(x, y, scale) {
    this.viewport = { x, y, scale };
    this.container.style.transform = 
      `translate(${-x}px, ${-y}px) scale(${scale})`;
  }
}
```

---

## 🔊 環境音システム

```javascript
// js/core/audio.js
class AudioManager {
  constructor() {
    this.context = null;
    this.ambientSource = null;
    this.ambientGain = null;
  }
  
  async init() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    
    this.ambientGain = this.context.createGain();
    this.ambientGain.gain.value = 0.3;
    this.ambientGain.connect(this.context.destination);
  }
  
  // 時間帯に応じた環境音
  async playAmbient(timeOfDay) {
    const ambientFiles = {
      morning: '/assets/audio/ambient/morning_birds.mp3',
      afternoon: '/assets/audio/ambient/afternoon_wind.mp3',
      evening: '/assets/audio/ambient/evening_cicadas.mp3',
      night: '/assets/audio/ambient/night_crickets.mp3'
    };
    
    await this.crossfadeAmbient(ambientFiles[timeOfDay]);
  }
  
  // クロスフェード
  async crossfadeAmbient(url) {
    const buffer = await this.loadAudio(url);
    const newSource = this.context.createBufferSource();
    newSource.buffer = buffer;
    newSource.loop = true;
    
    // 古い環境音をフェードアウト
    if (this.ambientSource) {
      this.fadeOut(this.ambientGain, 2000);
    }
    
    // 新しい環境音をフェードイン
    newSource.connect(this.ambientGain);
    newSource.start();
    this.fadeIn(this.ambientGain, 2000);
    
    this.ambientSource = newSource;
  }
  
  // 効果音再生（短い音）
  async playSE(name) {
    const seFiles = {
      tap: '/assets/audio/se/tap.mp3',
      water: '/assets/audio/se/water.mp3',
      plant: '/assets/audio/se/plant.mp3',
      grow: '/assets/audio/se/grow.mp3',
      discover: '/assets/audio/se/discover.mp3',
      bonus: '/assets/audio/se/bonus.mp3'
    };
    
    const buffer = await this.loadAudio(seFiles[name]);
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    source.start();
  }
}
```

---

## 📱 PWA設定

### manifest.json

```json
{
  "name": "まほうのにわ",
  "short_name": "にわ",
  "description": "ふしぎなたねで世界を作ろう",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#F5F0E6",
  "theme_color": "#7BC47F",
  "icons": [
    {
      "src": "/assets/images/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/images/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker

```javascript
// sw.js
const CACHE_NAME = 'mahounoniwa-v1';

// キャッシュするファイル
const PRECACHE = [
  '/',
  '/index.html',
  '/css/base.css',
  '/css/garden.css',
  '/css/ui.css',
  '/js/app.js',
  // ... 全JSファイル
  // ... 全画像
  // ... 全音声
];

// インストール時に全ファイルをキャッシュ
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// キャッシュ優先
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
  );
});
```

---

## 📱 iOS Safari & iPhone SE2 対応

<!-- 2025-01-20 追加: iPhone SE2特化対応 -->

### iPhone SE2 デバイス特性

| 項目 | iPhone SE2 | Face ID搭載機（参考） |
|------|-----------|---------------------|
| 画面サイズ | 375×667pt | 390×844pt等 |
| ステータスバー | **20pt** | 47pt |
| ホームインジケータ | **なし（物理ボタン）** | 34pt |
| ノッチ | **なし** | あり |
| 使用可能高さ | **647pt（PWA時667pt）** | 約763pt |

**重要:** iPhone SE2は物理ホームボタン搭載のため、`safe-area-inset-bottom` は常に0です。

### 既知の問題と対策

| 問題 | 対策 |
|------|------|
| 音が出ない | ユーザーインタラクション後に AudioContext 初期化 |
| 300msタップ遅延 | `touch-action: manipulation` 設定 |
| バウンススクロール | `overscroll-behavior: none` |
| ズーム | `user-scalable=no` + `touch-action` |
| セーフエリア | SE2では基本不要だが、将来対応で`env()`記述 |

### 必須のCSS

```css
/* iOS Safari 対応 */
html, body {
  overscroll-behavior: none;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
}

/* セーフエリア（SE2では0だが他機種対応） */
.app-container {
  padding-top: env(safe-area-inset-top, 0);
  padding-bottom: env(safe-area-inset-bottom, 0);
}

/* iPhone SE2 小画面最適化（375×667） */
@media screen and (max-width: 375px) and (max-height: 667px) {
  .nav-item {
    /* 5アイコン配置: (375 - 48*5) / 6 ≈ 22px 余白 */
    width: 48px;
    height: 48px;
  }
  
  .garden-view {
    /* 庭エリア最大化: 667 - 66(ナビ) = 601pt */
    height: calc(100dvh - 66px);
  }
}

/* PWAスタンドアロンモード */
@media all and (display-mode: standalone) {
  .app-container {
    height: 100vh;
    height: 100dvh; /* iOS 15.4+ 対応 */
  }
}
```

### 必須のメタタグ

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="apple-touch-icon" href="/assets/images/icons/icon-180.png">
```

### 375px幅でのボタン配置計算

```
横並びボタン数と余白:

5個: 48px × 5 = 240px → 余白 135px → 各隙間 22.5px ✓
4個: 56px × 4 = 224px → 余白 151px → 各隙間 30px ✓
3個: 64px × 3 = 192px → 余白 183px → 各隙間 45px ✓
2個: 80px × 2 = 160px → 余白 215px → 各隙間 71px ✓

推奨: ナビは5個まで、アクションは3個まで
```

---

## 🧪 実装チェックリスト

### Phase 1: 基盤（1週間）
- [ ] プロジェクト構造
- [ ] PWA設定（オフライン動作）
- [ ] Storage（セーブ/ロード）
- [ ] TimeManager（時間連動）
- [ ] 基本CSS

### Phase 2: 庭の基本（1週間）
- [ ] World / SpatialGrid
- [ ] GardenView（表示）
- [ ] タップ検出
- [ ] スクロール/ズーム

### Phase 3: たねシステム（1週間）
- [ ] Seed / Plant エンティティ
- [ ] 植える操作
- [ ] 成長システム
- [ ] 水やり

### Phase 4: 住人（1週間）
- [ ] Resident エンティティ
- [ ] 住人の表示・移動
- [ ] なかよし度
- [ ] 会話UI

### Phase 5: システム（1週間）
- [ ] デイリーボーナス
- [ ] クエスト
- [ ] 図鑑
- [ ] エリア解放

### Phase 6: 仕上げ（1週間）
- [ ] 環境音
- [ ] 効果音
- [ ] アニメーション調整
- [ ] 実機テスト

**総計: 6週間**

---

## 🚀 最小動作版（3日で作る版）

最低限これだけあれば「動くゲーム」になる：

1. **庭の表示** - 背景 + グリッド
2. **たね植え** - タップで植える
3. **水やり** - タップで水やり
4. **成長** - 時間で育つ
5. **デイリーボーナス** - ログインでたねもらえる

これを3日で作り、このみちゃんに触らせてフィードバック→改善のサイクル。

---

**設計完了。実装開始可能。🌱**


---

## 📝 変更履歴

### 2025-01-20 iPhone SE2対応追加
- **追加:** 「iOS Safari & iPhone SE2 対応」セクション全体
- **追加:** iPhone SE2 デバイス特性表（ステータスバー20pt、ホームインジケータなし）
- **追加:** 既知の問題と対策表
- **追加:** 必須のCSS（セーフエリア、小画面最適化、PWAスタンドアロン）
- **追加:** 必須のメタタグ
- **追加:** 375px幅でのボタン配置計算
