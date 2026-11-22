/* =========================================================
 * スマホ対応（ホーム画面への追加・オフライン・更新のお知らせ）
 * sw.js（サービスワーカー）を登録し、設定画面の「📱 スマホで使う」に状態を表示する。
 * https で公開した場所か、localhost で開いたときだけ働く（ブラウザの決まり）。
 * ========================================================= */
(function () {
  'use strict';
  const App = window.LearnApp, K = App.kit;
  const st = { ok: 'serviceWorker' in navigator && window.isSecureContext, ready: false, files: 0, reg: null, install: null, persisted: null, checking: null };
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  function banner() {
    if (document.getElementById('pwaUp')) return;
    const el = document.createElement('div');
    el.id = 'pwaUp';
    el.innerHTML = '<span>✨ 新しい内容があります</span><button class="btn primary" id="pwaGo">更新する</button><button class="btn ghost" id="pwaNo" aria-label="閉じる">あとで</button>';
    document.body.appendChild(el);
    el.querySelector('#pwaGo').onclick = () => location.reload();
    el.querySelector('#pwaNo').onclick = () => el.remove();
  }
  async function countFiles() { try { const c = await caches.open('learnapp-v1'); st.files = (await c.keys()).length; } catch (e) { /* 使えない環境 */ } return st.files; }
  async function askPersist() {
    if (!navigator.storage || !navigator.storage.persist) return (st.persisted = null);
    st.persisted = await navigator.storage.persisted();
    if (!st.persisted) st.persisted = await navigator.storage.persist();
    return st.persisted;
  }

  if (st.ok) {
    navigator.serviceWorker.addEventListener('message', (e) => {
      const d = e.data || {};
      if (d.type === 'updated') banner();
      if (d.type === 'ready') { st.ready = true; st.files = d.files; paint(); }
      if (d.type === 'checked' && st.checking) { const f = st.checking; st.checking = null; f(d); }
    });
    // 自分のPC（localhost）では、いつも最新を読む。本番と同じ動き（保存分を先に表示）を試すときは、アドレスに ?cachefirst を付けて開く
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js' + (new URLSearchParams(location.search).has('cachefirst') ? '?cachefirst' : '')).then((reg) => { st.reg = reg; return navigator.serviceWorker.ready; }).then(async () => { st.ready = true; await countFiles(); paint(); }).catch(() => { st.ok = false; paint(); });
    });
    window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); st.install = e; paint(); });
    window.addEventListener('appinstalled', () => { st.install = null; paint(); });
    // ホーム画面から開いているときは、学習記録が消されにくくなるように頼んでおく
    if (standalone()) askPersist();
  }
  if (navigator.storage && navigator.storage.persisted) navigator.storage.persisted().then((p) => { st.persisted = p; paint(); });

  // 設定画面のカード
  function paint() {
    const el = document.getElementById('pwaCard');
    if (!el) return;
    const yes = (t) => `<span class="tag good">✔ ${t}</span>`, no = (t) => `<span class="tag">${t}</span>`;
    const how = standalone() ? '<p>✔ ホーム画面のアプリとして開いています。</p>'
      : st.install ? '<div class="actions"><button class="btn primary" id="pwaAdd">📲 ホーム画面に追加する</button></div>'
        : ios ? '<p><b>iPhone・iPad</b>：Safari で開き、下の <b>共有ボタン（□に↑）</b> →「<b>ホーム画面に追加</b>」。</p>'
          : '<p><b>Android</b>：Chrome の右上の <b>︙</b> →「<b>ホーム画面に追加</b>」または「<b>アプリをインストール</b>」。<br><b>iPhone・iPad</b>：Safari の <b>共有ボタン</b> →「<b>ホーム画面に追加</b>」。<br><b>パソコン</b>：Chrome・Edge のアドレス欄の右の <b>インストール</b> のマーク。</p>';
    el.innerHTML = `<h3>📱 スマホで使う</h3>
      <p class="small">${st.ok ? (st.ready ? yes(`電波がなくても使えます（${st.files}個のファイルを保存済み）`) : no('準備中…')) : no('この開き方では、オフライン機能は使えません')}
        ${st.persisted === true ? yes('学習記録は消されにくい設定です') : ''}</p>
      ${st.ok ? '' : '<p class="small muted">オフライン機能とホーム画面への追加は、<b>https で公開した場所</b>（または自分のPCの localhost）で開いたときに働きます。同じ Wi-Fi から 192.168… のアドレスで開いた場合は使えません（ブラウザの決まりです）。</p>'}
      <h4>ホーム画面に追加する</h4>${how}
      <div class="actions">${st.ok ? '<button class="btn" id="pwaChk">🔄 最新の内容を確認</button>' : ''}${st.persisted === false ? '<button class="btn" id="pwaKeep">🛡 記録を消されにくくする</button>' : ''}</div>
      <p class="small muted">・学習記録は、<b>この端末のこのブラウザの中だけ</b>に保存されます。パソコンとスマホの記録は別々です。移すときは、下の「バックアップを保存」→ もう一方で「バックアップから復元」を使います。<br>・教材が更新されると、画面の下に「新しい内容があります」と出ます。「更新する」を押しても、学習記録は消えません。<br>・iPhone では、ホーム画面に追加して使うと、記録が自動で消される心配が小さくなります。念のため、ときどきバックアップを保存してください。</p>`;
    const add = el.querySelector('#pwaAdd'), chk = el.querySelector('#pwaChk'), keep = el.querySelector('#pwaKeep');
    if (add) add.onclick = async () => { const p = st.install; if (!p) return; p.prompt(); await p.userChoice; st.install = null; paint(); };
    if (keep) keep.onclick = async () => { const p = await askPersist(); K.toast(p ? '🛡 記録が消されにくくなりました' : 'このブラウザでは、ホーム画面に追加すると有効になります', p ? 'good' : ''); paint(); };
    if (chk) chk.onclick = () => {
      const sw = navigator.serviceWorker.controller || (st.reg && st.reg.active);
      if (!sw) return K.toast('準備中です。少し待ってから、もう一度押してください');
      chk.disabled = true; chk.textContent = '確認中…';
      if (st.reg) st.reg.update().catch(() => {});
      const timer = setTimeout(() => { if (st.checking) { st.checking = null; K.toast('つながりませんでした。電波のある所で試してください'); paint(); } }, 30000);
      st.checking = async (d) => { clearTimeout(timer); await countFiles(); paint(); if (d.error) K.toast('つながりませんでした。電波のある所で試してください'); else if (d.changed) banner(); else K.toast('✔ 最新の内容です', 'good'); };
      sw.postMessage({ type: 'check' });
    };
  }
  App.pwa = { state: st, paint, banner };
})();
