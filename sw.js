/**
 * Service Worker for まほうのにわ
 * GitHub Pages対応: 動的ベースパス取得
 */

// 動的ベースパス取得（GitHub Pages 404問題の根本解決）
const BASE_PATH = self.location.pathname.replace(/\/sw\.js$/, '/');

// キャッシュ名（バージョン管理）
const CACHE_NAME = 'mahounoniwa-v3';

// キャッシュ対象（相対パス）- Phase 2 で実際に存在するファイルのみ
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/base.css'
];

/**
 * install イベント
 * - キャッシュにファイルを追加
 * - self.skipWaiting() で即座にアクティベート
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // 相対パスを絶対パスに変換してキャッシュ
        const urlsToCache = PRECACHE.map((path) => {
          return new URL(path, self.location.href).href;
        });
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error('[SW] Install failed:', error);
      })
  );
});

/**
 * activate イベント
 * - 古いキャッシュを削除
 * - clients.claim() で即座に制御を開始
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
      .catch((error) => {
        console.error('[SW] Activate failed:', error);
      })
  );
});

/**
 * fetch イベント
 * - キャッシュファースト戦略
 * - キャッシュになければネットワークから取得
 */
self.addEventListener('fetch', (event) => {
  // GET リクエストのみ処理
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // キャッシュにあればそれを返す
        if (cachedResponse) {
          return cachedResponse;
        }

        // キャッシュになければネットワークから取得
        return fetch(event.request)
          .then((networkResponse) => {
            // 有効なレスポンスのみキャッシュに追加
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch((error) => {
            console.error('[SW] Fetch failed:', error);
            // オフラインでキャッシュもない場合のフォールバック
            // 将来的にオフラインページを用意可能
          });
      })
  );
});
