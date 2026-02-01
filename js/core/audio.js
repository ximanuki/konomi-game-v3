/**
 * AudioManager - 環境音・効果音管理システム
 *
 * Web Audio APIを使用した音声管理クラス。
 * iOS Safari対応のため、ユーザー操作後にAudioContextを初期化する。
 *
 * @class AudioManager
 */
export class AudioManager {
  constructor() {
    // Audio Context（iOS対応のため初期化はinit()で行う）
    this.context = null;

    // 環境音（BGM）用
    this.ambientSource = null;
    this.ambientGain = null;

    // 効果音（SE）用
    this.seGain = null;

    // ミュート状態
    this.isMuted = {
      ambient: false,
      se: false
    };

    // ボリューム（0.0 - 1.0）
    this.volume = {
      ambient: 0.3,
      se: 0.5
    };

    // 初期化済みフラグ
    this.initialized = false;

    // オーディオバッファキャッシュ
    this.bufferCache = new Map();
  }

  /**
   * AudioContextを初期化
   *
   * iOS Safariでは、ユーザー操作（タップ等）後に呼ぶ必要がある。
   *
   * @async
   * @returns {Promise<void>}
   */
  async init() {
    if (this.initialized) return;

    try {
      // AudioContext作成（iOS対応）
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.context = new AudioContext();

      // 環境音用のゲインノード
      this.ambientGain = this.context.createGain();
      this.ambientGain.gain.value = this.volume.ambient;
      this.ambientGain.connect(this.context.destination);

      // 効果音用のゲインノード
      this.seGain = this.context.createGain();
      this.seGain.gain.value = this.volume.se;
      this.seGain.connect(this.context.destination);

      this.initialized = true;
      console.log('AudioManager initialized');
    } catch (error) {
      console.error('AudioManager initialization failed:', error);
    }
  }

  /**
   * 時間帯に応じた環境音を再生
   *
   * @async
   * @param {string} timeOfDay - 時間帯（'morning', 'afternoon', 'evening', 'night'）
   * @returns {Promise<void>}
   */
  async playAmbient(timeOfDay) {
    if (!this.initialized) {
      console.warn('AudioManager not initialized. Call init() first.');
      return;
    }

    const ambientFiles = {
      morning: '/assets/audio/ambient/morning_birds.mp3',
      afternoon: '/assets/audio/ambient/afternoon_wind.mp3',
      evening: '/assets/audio/ambient/evening_cicadas.mp3',
      night: '/assets/audio/ambient/night_crickets.mp3'
    };

    const url = ambientFiles[timeOfDay];
    if (!url) {
      console.warn(`Unknown time of day: ${timeOfDay}`);
      return;
    }

    await this.crossfadeAmbient(url);
  }

  /**
   * 環境音をクロスフェードで切り替え
   *
   * 古い環境音をフェードアウトしながら、新しい環境音をフェードインする。
   *
   * @async
   * @param {string} url - 音声ファイルのURL
   * @returns {Promise<void>}
   */
  async crossfadeAmbient(url) {
    if (!this.initialized) return;

    try {
      // 新しい音声をロード
      const buffer = await this.loadAudio(url);
      if (!buffer) return; // ロード失敗時は何もしない

      // 新しいソースノード作成
      const newSource = this.context.createBufferSource();
      newSource.buffer = buffer;
      newSource.loop = true;

      // 古い環境音をフェードアウト
      if (this.ambientSource) {
        await this.fadeOut(this.ambientGain, 2000);
        this.ambientSource.stop();
        this.ambientSource.disconnect();
      }

      // 新しい環境音をフェードイン
      newSource.connect(this.ambientGain);
      newSource.start();
      await this.fadeIn(this.ambientGain, 2000);

      this.ambientSource = newSource;
    } catch (error) {
      console.error('Crossfade ambient failed:', error);
    }
  }

  /**
   * 効果音（SE）を再生
   *
   * @async
   * @param {string} name - 効果音名（'tap', 'water', 'plant', 'grow', 'discover', 'bonus'）
   * @returns {Promise<void>}
   */
  async playSE(name) {
    if (!this.initialized) return;
    if (this.isMuted.se) return;

    const seFiles = {
      tap: '/assets/audio/se/tap.mp3',
      water: '/assets/audio/se/water.mp3',
      plant: '/assets/audio/se/plant.mp3',
      grow: '/assets/audio/se/grow.mp3',
      discover: '/assets/audio/se/discover.mp3',
      bonus: '/assets/audio/se/bonus.mp3'
    };

    const url = seFiles[name];
    if (!url) {
      console.warn(`Unknown SE name: ${name}`);
      return;
    }

    try {
      const buffer = await this.loadAudio(url);
      if (!buffer) return; // ロード失敗時は何もしない

      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.seGain);
      source.start();
    } catch (error) {
      console.error(`Failed to play SE: ${name}`, error);
    }
  }

  /**
   * ボリューム設定
   *
   * @param {string} type - 'ambient' または 'se'
   * @param {number} value - ボリューム（0.0 - 1.0）
   */
  setVolume(type, value) {
    if (!this.initialized) return;

    // 値を0-1にクランプ
    value = Math.max(0, Math.min(1, value));

    if (type === 'ambient' && this.ambientGain) {
      this.volume.ambient = value;
      this.ambientGain.gain.value = this.isMuted.ambient ? 0 : value;
    } else if (type === 'se' && this.seGain) {
      this.volume.se = value;
      this.seGain.gain.value = this.isMuted.se ? 0 : value;
    } else {
      console.warn(`Unknown audio type: ${type}`);
    }
  }

  /**
   * ミュート
   *
   * @param {string} type - 'ambient' または 'se'
   */
  mute(type) {
    if (!this.initialized) return;

    if (type === 'ambient' && this.ambientGain) {
      this.isMuted.ambient = true;
      this.ambientGain.gain.value = 0;
    } else if (type === 'se' && this.seGain) {
      this.isMuted.se = true;
      this.seGain.gain.value = 0;
    } else {
      console.warn(`Unknown audio type: ${type}`);
    }
  }

  /**
   * ミュート解除
   *
   * @param {string} type - 'ambient' または 'se'
   */
  unmute(type) {
    if (!this.initialized) return;

    if (type === 'ambient' && this.ambientGain) {
      this.isMuted.ambient = false;
      this.ambientGain.gain.value = this.volume.ambient;
    } else if (type === 'se' && this.seGain) {
      this.isMuted.se = false;
      this.seGain.gain.value = this.volume.se;
    } else {
      console.warn(`Unknown audio type: ${type}`);
    }
  }

  /**
   * 音声ファイルをロード
   *
   * ファイルが存在しない場合でもエラーを投げず、nullを返す。
   * キャッシュ機能付き。
   *
   * @async
   * @param {string} url - 音声ファイルのURL
   * @returns {Promise<AudioBuffer|null>}
   */
  async loadAudio(url) {
    if (!this.initialized) return null;

    // キャッシュチェック
    if (this.bufferCache.has(url)) {
      return this.bufferCache.get(url);
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Audio file not found: ${url}`);
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

      // キャッシュに保存
      this.bufferCache.set(url, audioBuffer);

      return audioBuffer;
    } catch (error) {
      console.warn(`Failed to load audio: ${url}`, error);
      return null;
    }
  }

  /**
   * フェードイン
   *
   * @async
   * @param {GainNode} gainNode - ゲインノード
   * @param {number} duration - フェード時間（ミリ秒）
   * @returns {Promise<void>}
   */
  async fadeIn(gainNode, duration) {
    if (!this.initialized) return;

    const currentTime = this.context.currentTime;
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(
      this.volume.ambient,
      currentTime + duration / 1000
    );

    // フェード完了まで待機
    return new Promise(resolve => setTimeout(resolve, duration));
  }

  /**
   * フェードアウト
   *
   * @async
   * @param {GainNode} gainNode - ゲインノード
   * @param {number} duration - フェード時間（ミリ秒）
   * @returns {Promise<void>}
   */
  async fadeOut(gainNode, duration) {
    if (!this.initialized) return;

    const currentTime = this.context.currentTime;
    gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
    gainNode.gain.linearRampToValueAtTime(0, currentTime + duration / 1000);

    // フェード完了まで待機
    return new Promise(resolve => setTimeout(resolve, duration));
  }

  /**
   * 全音声を停止
   */
  stopAll() {
    if (this.ambientSource) {
      this.ambientSource.stop();
      this.ambientSource.disconnect();
      this.ambientSource = null;
    }
  }

  /**
   * AudioContextのサスペンド（省電力のため）
   */
  suspend() {
    if (this.initialized && this.context.state === 'running') {
      this.context.suspend();
    }
  }

  /**
   * AudioContextの再開
   */
  resume() {
    if (this.initialized && this.context.state === 'suspended') {
      this.context.resume();
    }
  }
}

// シングルトンインスタンスをエクスポート
export const audioManager = new AudioManager();
