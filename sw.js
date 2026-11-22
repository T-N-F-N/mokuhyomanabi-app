/* =========================================================
 * 目標実現アプリ — オフライン対応（サービスワーカー）
 *
 * ・最初に開いたとき、index.html に書かれているファイル（css / js / 教材 / アイコン）をすべて端末に保存する。
 *   ファイルの一覧は index.html から自動で読み取るので、教材を足してもここを直す必要はない。
 * ・ふだんは「保存してある内容をすぐ表示 → 裏で新しい版を確認」。
 *   新しい版が見つかったら保存を入れかえ、画面に「新しい内容があります」と知らせる。
 * ・localhost（自分のPCで作っているとき）だけは、いつも最新のファイルを読む。つながらないときだけ保存分を使う。
 * ========================================================= */
const CACHE = 'learnapp-v1';
const SCOPE = self.registration.scope;                 // 例：https://example.github.io/app/
const INDEX = new URL('index.html', SCOPE).href;
const PARAMS = new URL(self.location.href).searchParams;
const LOCAL = ['localhost', '127.0.0.1', '[::1]'].includes(self.location.hostname);
const FRESH_FIRST = LOCAL && !PARAMS.has('cachefirst'); // localhost では最新を優先（確認用に ?cachefirst で切りかえ可）

const keyOf = (req) => {
  if (req.mode === 'navigate') return INDEX;
  const u = new URL(req.url);
  if (u.href === SCOPE) return INDEX;
  return u.origin + u.pathname;                          // ?v=12 などは無視して同じファイルとして扱う
};
const sig = (r) => r.headers.get('etag') || r.headers.get('last-modified') || r.headers.get('content-length') || '';
const tell = async (msg) => { const cs = await self.clients.matchAll({ includeUncontrolled: true }); cs.forEach((c) => c.postMessage(msg)); };

// index.html に書かれているファイルの一覧を作る
async function listFiles() {
  const res = await fetch(INDEX, { cache: 'no-cache' });
  if (!res.ok) throw new Error('index ' + res.status);
  const html = await res.clone().text();
  const urls = new Set([INDEX]);
  for (const m of html.matchAll(/(?:src|href)="([^"#?]+)"/g)) {
    const u = new URL(m[1], SCOPE);
    if (u.origin === self.location.origin && u.href.startsWith(SCOPE) && u.href !== SCOPE) urls.add(u.href);
  }
  return { urls: [...urls], index: res };
}
// すべてのファイルを確認して保存する。変わっていたファイルの数を返す
async function syncAll() {
  const cache = await caches.open(CACHE);
  const { urls, index } = await listFiles();
  let changed = 0, saved = 0;
  const put = async (url, res) => {
    const old = await cache.match(url);
    if (old && sig(old) !== sig(res)) changed++;
    await cache.put(url, res); saved++;
  };
  await put(INDEX, index);
  const rest = urls.filter((u) => u !== INDEX);
  for (let i = 0; i < rest.length; i += 8) {             // 8個ずつ取りに行く
    await Promise.all(rest.slice(i, i + 8).map(async (u) => { try { const r = await fetch(u, { cache: 'no-cache' }); if (r.ok) await put(u, r); } catch (e) { /* つながらないファイルは次回 */ } }));
  }
  return { changed, saved, total: urls.length };
}

self.addEventListener('install', (e) => { e.waitUntil(syncAll().catch(() => {}).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE && k.startsWith('learnapp-')) await caches.delete(k);
    await self.clients.claim();
    const n = (await (await caches.open(CACHE)).keys()).length;
    tell({ type: 'ready', files: n });
  })());
});

let noticed = false;
async function refresh(cache, key, hit) {
  const res = await fetch(key, { cache: 'no-cache' });
  if (!res || !res.ok) return hit;
  const changed = hit && sig(hit) !== sig(res);
  await cache.put(key, res.clone());
  if (changed && !noticed) { noticed = true; tell({ type: 'updated' }); setTimeout(() => (noticed = false), 15000); }
  return res;
}
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(SCOPE)) return;
  const key = keyOf(req);
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (FRESH_FIRST) {
      try { const res = await fetch(key, { cache: 'no-cache' }); if (res.ok) cache.put(key, res.clone()); return res; }
      catch (err) { const hit = await cache.match(key); if (hit) return hit; throw err; }
    }
    const hit = await cache.match(key);
    const fresh = refresh(cache, key, hit).catch(() => hit);
    e.waitUntil(fresh);
    return hit || (await fresh) || Response.error();
  })());
});

// 設定画面の「最新の内容を確認」から呼ばれる
self.addEventListener('message', (e) => {
  if (!e.data || e.data.type !== 'check') return;
  e.waitUntil(syncAll().then((r) => tell({ type: 'checked', ...r })).catch(() => tell({ type: 'checked', error: true })));
});
