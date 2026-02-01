# ✨ 爽快感演出詳細設計書

**バージョン:** 1.0  
**設計思想:** 「気持ちいい！」を科学的に設計する  
**参考:** パズドラ、ツムツム、太鼓の達人の演出分析

---

## 🧠 爽快感の正体：なぜ「気持ちいい」のか

### 心理学的メカニズム

1. **即時報酬** - 操作した瞬間にフィードバック（50ms以内）
2. **予測と一致** - 期待通りの結果が気持ちいい
3. **予測以上** - 期待以上だともっと気持ちいい
4. **マルチモーダル** - 視覚×聴覚×触覚の同時刺激
5. **連続性** - 連続で成功すると快感が増幅

### 6歳児の感覚特性

| 特性 | 設計への反映 |
|------|-------------|
| 反応速度がやや遅い | フィードバック許容範囲を広く |
| 大げさな演出が好き | 派手に、大きく |
| 繰り返しが好き | 何度やっても飽きない仕組み |
| 音に敏感 | SE を心地よく重ねる |
| 動くものに注目 | アニメーションは大きく、速く |

---

## 🎯 基本フィードバックシステム

### タップフィードバック（全ゲーム共通）

**「触ったら必ず反応する」が鉄則**

```javascript
const TAP_FEEDBACK = {
  // 視覚
  visual: {
    ripple: true,           // 波紋エフェクト
    ripple_color: '#FFB6C1', // ピンク
    ripple_size: 60,         // px
    ripple_duration: 300,    // ms
    scale_press: 0.95,       // 押した時の縮小
    scale_release: 1.05,     // 離した時の拡大（バウンス）
  },
  
  // 聴覚
  audio: {
    se: 'tap_soft',
    volume: 0.7,
    pitch_variation: 0.1    // 毎回少し音程が変わる
  },
  
  // 触覚
  haptic: {
    pattern: [10],          // ms
    enabled: true
  }
};
```

### 波紋エフェクト実装

```css
.tap-ripple {
  position: fixed;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 182, 193, 0.8) 0%,
    rgba(255, 182, 193, 0) 70%
  );
  pointer-events: none;
  animation: ripple-expand 0.3s ease-out forwards;
}

@keyframes ripple-expand {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}
```

---

## 🔥 コンボシステム

### コンボ定義

**連続成功でコンボが発生 → 演出がエスカレート**

```javascript
const COMBO_CONFIG = {
  // コンボ判定時間（この間に次のアクションで継続）
  timeout: 2000,  // ms
  
  // コンボ段階
  stages: [
    { count: 1,  name: 'たっち！',        color: '#FFB6C1', multiplier: 1.0 },
    { count: 3,  name: 'いいね！',        color: '#FFD700', multiplier: 1.2 },
    { count: 5,  name: 'すごい！',        color: '#FF69B4', multiplier: 1.5 },
    { count: 10, name: 'すごーい！！',    color: '#FF1493', multiplier: 2.0 },
    { count: 20, name: 'てんさい！！！',  color: '#FFD700', multiplier: 3.0, rainbow: true },
    { count: 50, name: 'かみさま！！！！', color: 'rainbow', multiplier: 5.0, explosion: true }
  ]
};
```

### コンボ演出詳細

#### 1〜2コンボ（たっち！）

```javascript
{
  text: {
    content: 'たっち！',
    size: 24,           // px
    font: 'bold',
    color: '#FFB6C1',
    animation: 'pop',   // ポンと出る
    duration: 400       // ms
  },
  particle: {
    count: 3,
    type: 'star',
    colors: ['#FFB6C1', '#FFF0F5'],
    size: { min: 8, max: 12 }
  },
  se: 'combo_1',
  haptic: [10]
}
```

#### 3〜4コンボ（いいね！）

```javascript
{
  text: {
    content: 'いいね！',
    size: 32,
    font: 'bold',
    color: '#FFD700',
    animation: 'bounce',
    duration: 500,
    glow: true
  },
  particle: {
    count: 8,
    type: 'star',
    colors: ['#FFD700', '#FFA500', '#FFFF00'],
    size: { min: 10, max: 16 }
  },
  screen_flash: {
    color: 'rgba(255, 215, 0, 0.2)',
    duration: 100
  },
  se: 'combo_2',
  haptic: [15, 30, 15]
}
```

#### 5〜9コンボ（すごい！）

```javascript
{
  text: {
    content: 'すごい！',
    size: 40,
    font: 'bold',
    color: '#FF69B4',
    animation: 'shake-bounce',
    duration: 600,
    glow: true,
    shadow: true
  },
  particle: {
    count: 15,
    type: ['star', 'heart'],
    colors: ['#FF69B4', '#FFB6C1', '#FF1493'],
    size: { min: 12, max: 20 },
    trail: true
  },
  screen_shake: {
    intensity: 3,
    duration: 150
  },
  screen_flash: {
    color: 'rgba(255, 105, 180, 0.3)',
    duration: 150
  },
  se: 'combo_3',
  haptic: [20, 40, 20, 40, 20]
}
```

#### 10〜19コンボ（すごーい！！）

```javascript
{
  text: {
    content: 'すごーい！！',
    size: 48,
    font: 'bold',
    color: '#FF1493',
    animation: 'mega-bounce',
    duration: 800,
    glow: true,
    shadow: true,
    outline: '#FFFFFF'
  },
  particle: {
    count: 25,
    type: ['star', 'heart', 'sparkle'],
    colors: ['#FF1493', '#FF69B4', '#FFD700', '#FFFFFF'],
    size: { min: 14, max: 24 },
    trail: true,
    explosion: true
  },
  screen_shake: {
    intensity: 5,
    duration: 200
  },
  background_pulse: {
    color: '#FF69B4',
    duration: 300
  },
  se: ['combo_4', 'sparkle'],
  haptic: [30, 50, 30, 50, 30]
}
```

#### 20〜49コンボ（てんさい！！！）

```javascript
{
  text: {
    content: 'てんさい！！！',
    size: 56,
    font: 'bold',
    animation: 'rainbow-shake',
    duration: 1000,
    rainbow: true,        // 虹色に変化
    glow_pulse: true
  },
  particle: {
    count: 40,
    type: ['star', 'heart', 'sparkle', 'confetti'],
    colors: 'rainbow',
    size: { min: 16, max: 28 },
    trail: true,
    explosion: true,
    spiral: true
  },
  screen_shake: {
    intensity: 8,
    duration: 300
  },
  rainbow_border: true,
  se: ['combo_5', 'fanfare_short'],
  haptic: [50, 30, 50, 30, 50, 30, 50]
}
```

#### 50+コンボ（かみさま！！！！）

```javascript
{
  text: {
    content: 'かみさま！！！！',
    size: 64,
    font: 'bold',
    animation: 'super-rainbow-explosion',
    duration: 1500
  },
  particle: {
    count: 100,
    full_screen: true,
    firework: true
  },
  screen_effect: {
    zoom_punch: true,      // 画面がズームイン→アウト
    rainbow_overlay: true,
    star_burst: true
  },
  se: ['combo_max', 'firework', 'crowd_cheer'],
  haptic: 'continuous_1000ms'
}
```

---

## 📳 振動設計（Vibration API）

### 振動パターン一覧

```javascript
const VIBRATION_PATTERNS = {
  // 基本操作
  tap: [10],                          // 軽いタップ
  tap_success: [15],                  // 成功タップ
  tap_special: [20, 30, 20],          // 特別なタップ
  
  // コンボ段階別
  combo_1: [10],
  combo_2: [15, 30, 15],
  combo_3: [20, 40, 20, 40, 20],
  combo_4: [30, 50, 30, 50, 30],
  combo_5: [50, 30, 50, 30, 50, 30, 50],
  combo_max: [100, 50, 100, 50, 100],
  
  // 特殊演出
  success: [30, 50, 30],              // 成功時
  level_up: [50, 30, 50, 30, 100],    // レベルアップ
  reward: [20, 30, 20, 30, 20, 30, 20], // 報酬獲得
  
  // 連続振動（ms間隔で繰り返し）
  heartbeat: [100, 200, 50, 200],     // ドキドキ
  purr: [10, 20, 10, 20, 10, 20],     // 連続で気持ちいい
  
  // クリア演出用
  clear_normal: [50, 100, 50],
  clear_perfect: [30, 50, 30, 50, 30, 50, 100, 50, 100]
};
```

### 振動のタイミング原則

```
📌 タップ時: 即座（0ms遅延）
📌 視覚と同期: ±20ms以内
📌 音と同期: 音の立ち上がりと合わせる
📌 連打時: 重ならないよう間引き（50ms間隔以上）
```

---

## ✨ パーティクルエフェクト

### パーティクル種類

#### 1. 星（star）
```css
.particle-star {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 16px solid currentColor;
  /* 回転で星形に */
}
```

#### 2. ハート（heart）
```css
.particle-heart {
  width: 16px;
  height: 16px;
  background: currentColor;
  transform: rotate(45deg);
}
.particle-heart::before,
.particle-heart::after {
  content: '';
  width: 16px;
  height: 16px;
  background: currentColor;
  border-radius: 50%;
  position: absolute;
}
```

#### 3. キラキラ（sparkle）
```css
.particle-sparkle {
  width: 12px;
  height: 12px;
  background: radial-gradient(
    circle,
    currentColor 0%,
    transparent 70%
  );
  animation: twinkle 0.5s ease-in-out infinite alternate;
}

@keyframes twinkle {
  0% { opacity: 0.3; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1.2); }
}
```

#### 4. 紙吹雪（confetti）
```css
.particle-confetti {
  width: 8px;
  height: 12px;
  background: currentColor;
  animation: confetti-fall 1s ease-in forwards;
}

@keyframes confetti-fall {
  0% { 
    transform: translateY(0) rotateX(0) rotateZ(0);
  }
  100% { 
    transform: translateY(200px) rotateX(720deg) rotateZ(360deg);
    opacity: 0;
  }
}
```

### パーティクル物理エンジン

```javascript
class Particle {
  constructor(x, y, config) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * config.speed;
    this.vy = -Math.random() * config.speed;
    this.gravity = config.gravity || 200;  // px/秒²
    this.lifetime = config.lifetime || 1000;
    this.age = 0;
    this.size = config.size.min + Math.random() * (config.size.max - config.size.min);
    this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 720;  // 度/秒
  }
  
  update(dt) {
    this.age += dt;
    this.vy += this.gravity * (dt / 1000);
    this.x += this.vx * (dt / 1000);
    this.y += this.vy * (dt / 1000);
    this.rotation += this.rotationSpeed * (dt / 1000);
    
    // フェードアウト
    this.opacity = 1 - (this.age / this.lifetime);
    
    return this.age < this.lifetime;
  }
}
```

### パーティクル設定例

```javascript
const PARTICLE_PRESETS = {
  // タップ時
  tap_burst: {
    count: 5,
    speed: 150,
    gravity: 100,
    lifetime: 400,
    size: { min: 6, max: 10 },
    colors: ['#FFB6C1', '#FF69B4', '#FFF0F5']
  },
  
  // 成功時
  success_explosion: {
    count: 20,
    speed: 300,
    gravity: 50,
    lifetime: 800,
    size: { min: 10, max: 18 },
    colors: ['#FFD700', '#FFA500', '#FFFF00', '#FF69B4']
  },
  
  // クリア時
  clear_firework: {
    count: 50,
    speed: 400,
    gravity: 30,
    lifetime: 1200,
    size: { min: 12, max: 24 },
    colors: ['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#96E6A1', '#DDA0DD'],
    trail: true
  },
  
  // 連続キラキラ
  sparkle_trail: {
    count: 3,
    speed: 50,
    gravity: -20,  // 上に浮く
    lifetime: 600,
    size: { min: 4, max: 8 },
    colors: ['#FFFFFF', '#FFFACD', '#FFD700']
  }
};
```

---

## 🔊 SE（効果音）設計

### SE一覧

| カテゴリ | SE名 | 用途 | 長さ | 音色 |
|---------|------|------|------|------|
| 基本操作 | tap_soft | タップ | 0.08秒 | マリンバ |
| 基本操作 | tap_success | 成功タップ | 0.12秒 | ベル |
| 基本操作 | tap_special | 特別タップ | 0.2秒 | キラキラ |
| コンボ | combo_1 | 1-2コンボ | 0.15秒 | ポップ |
| コンボ | combo_2 | 3-4コンボ | 0.2秒 | キラン |
| コンボ | combo_3 | 5-9コンボ | 0.3秒 | シャラン |
| コンボ | combo_4 | 10-19コンボ | 0.4秒 | ファンファーレ小 |
| コンボ | combo_5 | 20-49コンボ | 0.5秒 | ファンファーレ中 |
| コンボ | combo_max | 50+コンボ | 0.8秒 | ファンファーレ大 |
| 成功 | success_ding | 成功 | 0.3秒 | ベルチャイム |
| 成功 | success_sparkle | 成功+キラキラ | 0.5秒 | ベル+シャラン |
| クリア | clear_normal | 通常クリア | 1.0秒 | 達成音 |
| クリア | clear_perfect | パーフェクト | 1.5秒 | 豪華達成音 |
| 報酬 | kirakira_get | キラキラ獲得 | 0.4秒 | コイン+キラキラ |
| 報酬 | level_up | レベルアップ | 1.2秒 | ファンファーレ |

### 音の重ね方ルール

```javascript
const AUDIO_LAYERING = {
  // 同時再生上限
  max_simultaneous: 8,
  
  // 優先度（高いほど優先）
  priority: {
    clear: 10,
    combo_max: 9,
    combo_5: 8,
    level_up: 8,
    combo_4: 7,
    combo_3: 6,
    success: 5,
    combo_2: 4,
    combo_1: 3,
    tap: 1
  },
  
  // 同じSEの連続再生間隔（これ以下だとピッチをずらして再生）
  repeat_threshold: 50,  // ms
  
  // 連続再生時のピッチ変化
  pitch_variation: {
    min: 0.95,
    max: 1.05
  }
};
```

### 音のタイミング

```
📌 タップ音: タッチ検知と同フレーム（16ms以内）
📌 成功音: 成功判定と同時
📌 コンボ音: テキスト表示と同時
📌 パーティクル音: 爆発の瞬間
```

---

## 🎬 クリア演出

### 通常クリア

**演出時間:** 2.0秒

```javascript
const CLEAR_NORMAL = {
  timeline: [
    // 0.0秒：画面がパッと明るく
    { time: 0, action: 'flash', color: '#FFFFFF', duration: 100 },
    { time: 0, action: 'haptic', pattern: [30] },
    
    // 0.1秒：「クリア！」テキスト
    { time: 100, action: 'text', content: 'クリア！', style: 'bounce', size: 56 },
    { time: 100, action: 'se', name: 'clear_normal' },
    
    // 0.3秒：パーティクル爆発
    { time: 300, action: 'particle', preset: 'success_explosion', x: 'center', y: 'center' },
    { time: 300, action: 'haptic', pattern: [50, 30, 50] },
    
    // 0.8秒：キラキラ表示
    { time: 800, action: 'kirakira_count', amount: 15, x: 'center', y: 200 },
    { time: 800, action: 'se', name: 'kirakira_get' },
    
    // 1.5秒：ボタン表示
    { time: 1500, action: 'show_buttons', buttons: ['home', 'retry'] }
  ]
};
```

### パーフェクトクリア

**演出時間:** 4.0秒

```javascript
const CLEAR_PERFECT = {
  timeline: [
    // 0.0秒：画面が暗くなる（期待感）
    { time: 0, action: 'dim', duration: 200 },
    
    // 0.2秒：画面中央から光が広がる
    { time: 200, action: 'radial_light', color: '#FFD700', duration: 500 },
    { time: 200, action: 'haptic', pattern: [20, 30, 20] },
    
    // 0.5秒：「パーフェクト！！」（虹色）
    { time: 500, action: 'text', content: 'パーフェクト！！', style: 'rainbow-bounce', size: 64 },
    { time: 500, action: 'se', name: 'clear_perfect' },
    { time: 500, action: 'haptic', pattern: [50, 30, 50, 30, 50] },
    
    // 0.8秒：花火パーティクル（左右から）
    { time: 800, action: 'firework', x: 80, y: 300 },
    { time: 1000, action: 'firework', x: 295, y: 300 },
    { time: 1200, action: 'firework', x: 187, y: 200 },
    
    // 1.5秒：紙吹雪が降る
    { time: 1500, action: 'confetti', count: 50, duration: 2000 },
    
    // 2.0秒：スター取得演出
    { time: 2000, action: 'star_collect', count: 3, x: 'center', y: 300 },
    { time: 2000, action: 'se', name: 'star_get' },
    
    // 2.5秒：キラキラ表示（増量）
    { time: 2500, action: 'kirakira_count', amount: 30, x: 'center', y: 200, bonus: true },
    { time: 2500, action: 'se', name: 'kirakira_get' },
    { time: 2500, action: 'haptic', pattern: [30, 50, 30, 50, 100] },
    
    // 3.5秒：ボタン表示
    { time: 3500, action: 'show_buttons', buttons: ['home', 'retry', 'share'] }
  ]
};
```

### 花火エフェクト実装

```javascript
class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.particles = [];
    this.exploded = false;
  }
  
  explode() {
    const colors = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#DDA0DD'];
    const count = 30;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 150 + Math.random() * 100;
      
      this.particles.push({
        x: this.x,
        y: this.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 4,
        life: 1.0,
        trail: []
      });
    }
    
    audio.playSE('firework_pop');
    Haptics.medium();
    this.exploded = true;
  }
  
  update(dt) {
    this.particles.forEach(p => {
      // 軌跡を保存
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 5) p.trail.shift();
      
      // 物理更新
      p.vy += 100 * (dt / 1000);  // 重力
      p.x += p.vx * (dt / 1000);
      p.y += p.vy * (dt / 1000);
      p.life -= dt / 1000;
    });
    
    this.particles = this.particles.filter(p => p.life > 0);
    return this.particles.length > 0;
  }
}
```

---

## 🎮 ゲーム別演出設定

### おはなばたけ

```javascript
const FLOWER_EFFECTS = {
  // 水やり
  watering: {
    particle: { type: 'water_drop', count: 8, color: '#87CEEB' },
    se: 'water_splash',
    haptic: [10, 20, 10]
  },
  
  // 成長
  growth: {
    particle: { type: 'sparkle', count: 5, color: '#98FB98' },
    se: 'grow_pop',
    haptic: [15],
    scale_animation: { from: 1.0, to: 1.1, duration: 200 }
  },
  
  // 開花
  bloom: {
    particle: { type: ['petal', 'sparkle'], count: 20, colors: 'flower_color' },
    se: 'bloom_fanfare',
    haptic: [30, 50, 30],
    screen_flash: { color: 'rgba(255, 182, 193, 0.4)', duration: 200 }
  },
  
  // レア花開花
  rare_bloom: {
    particle: { type: ['petal', 'sparkle', 'star'], count: 40, colors: 'rainbow' },
    se: ['bloom_fanfare', 'sparkle_long'],
    haptic: [50, 30, 50, 30, 100],
    screen_effect: 'rainbow_flash'
  }
};
```

### おかしやさん

```javascript
const SWEETS_EFFECTS = {
  // トッピング配置
  topping: {
    particle: { type: 'sparkle', count: 3 },
    se: 'plop',
    haptic: [10],
    bounce_animation: true
  },
  
  // デコレーション完成
  decoration_complete: {
    particle: { type: ['star', 'heart'], count: 15 },
    se: 'complete_chime',
    haptic: [20, 30, 20]
  },
  
  // お客さん満足
  customer_happy: {
    particle: { type: 'heart', count: 10, float_up: true },
    se: 'happy_jingle',
    haptic: [30, 50, 30],
    character_animation: 'jump_happy'
  },
  
  // VIPお客さん満足
  vip_happy: {
    particle: { type: ['heart', 'star', 'sparkle'], count: 30 },
    se: ['happy_jingle', 'fanfare'],
    haptic: [50, 30, 50, 30, 50],
    screen_effect: 'golden_flash'
  }
};
```

### おんがくひろば

```javascript
const MUSIC_EFFECTS = {
  // ノート判定
  note_perfect: {
    particle: { type: 'note', count: 5, colors: ['#FFD700'] },
    se: 'note_perfect',
    haptic: [20],
    flash: { color: '#FFD700', duration: 50 }
  },
  
  note_great: {
    particle: { type: 'note', count: 3, colors: ['#98FB98'] },
    se: 'note_great',
    haptic: [15]
  },
  
  note_good: {
    particle: { type: 'note', count: 2, colors: ['#87CEEB'] },
    se: 'note_good',
    haptic: [10]
  },
  
  // フルコンボ
  full_combo: {
    particle: { type: ['note', 'star', 'sparkle'], count: 50, explosion: true },
    se: ['full_combo_fanfare', 'crowd_cheer'],
    haptic: 'celebration',
    screen_effect: 'rainbow_pulse'
  }
};
```

---

## 📐 数値パラメータまとめ

### タイミング

| 項目 | 値 | 単位 |
|------|-----|------|
| タップ反応最大遅延 | 16 | ms |
| 視覚・聴覚同期許容誤差 | 20 | ms |
| コンボ継続判定時間 | 2000 | ms |
| 波紋アニメーション | 300 | ms |
| 成功バウンス | 400 | ms |
| クリア演出（通常） | 2000 | ms |
| クリア演出（パーフェクト） | 4000 | ms |

### サイズ

| 項目 | 値 | 単位 |
|------|-----|------|
| 波紋直径 | 60 | px |
| 最小パーティクル | 4 | px |
| 最大パーティクル | 28 | px |
| コンボテキスト（小） | 24 | px |
| コンボテキスト（大） | 64 | px |
| クリアテキスト | 56-64 | px |

### 物理

| 項目 | 値 | 単位 |
|------|-----|------|
| パーティクル初速（弱） | 100 | px/秒 |
| パーティクル初速（強） | 400 | px/秒 |
| 重力（通常） | 200 | px/秒² |
| 重力（花火） | 100 | px/秒² |
| 画面揺れ（弱） | 3 | px |
| 画面揺れ（強） | 10 | px |

### 振動

| 項目 | 値 | 単位 |
|------|-----|------|
| タップ | 10 | ms |
| 成功 | 30 | ms |
| 強調 | 50 | ms |
| 最大 | 100 | ms |
| パターン間隔（最小） | 20 | ms |

---

## ✅ 実装チェックリスト

### Phase 1: 基本フィードバック
- [ ] タップ波紋エフェクト
- [ ] タップSE（ピッチ変化あり）
- [ ] タップ振動
- [ ] ボタン押下アニメーション

### Phase 2: パーティクルシステム
- [ ] パーティクルエンジン実装
- [ ] 星・ハート・キラキラの描画
- [ ] 物理演算（重力・速度減衰）
- [ ] 軌跡（trail）エフェクト

### Phase 3: コンボシステム
- [ ] コンボカウンター
- [ ] 段階別テキスト表示
- [ ] 段階別パーティクル
- [ ] 段階別SE/振動

### Phase 4: クリア演出
- [ ] 通常クリア演出
- [ ] パーフェクトクリア演出
- [ ] 花火エフェクト
- [ ] 紙吹雪エフェクト

### Phase 5: ゲーム別調整
- [ ] おはなばたけ演出
- [ ] おえかき演出
- [ ] おかしやさん演出
- [ ] きせかえ演出
- [ ] おんがく演出
- [ ] どうぶつえん演出

---

## 🎯 成功指標

| 指標 | 目標 | 計測方法 |
|------|------|---------|
| タップ連打 | 遊び始めて30秒以内に10連打 | 観察 |
| 笑顔 | 演出中に笑顔率80%以上 | 観察 |
| 「もういっかい！」 | クリア後80%が再プレイ | ログ |
| 親に見せる | 派手な演出で50%が親を呼ぶ | 観察 |

---

**この演出で、このみちゃんは画面をバンバン叩いて笑うはず ✨🎉**
