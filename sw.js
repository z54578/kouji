// アプリを更新したときは、この番号を1つ上げてください（例：v1 → v2）
const CACHE = "koujika-tools-v91";
const FILES = ["./", "./index.html", "./pc.html", "./thread.html", "./weld.html", "./materials.html", "./zfile.html", "./tokico-ga-1.jpg", "./tokico-ga-2.jpg", "./tatsuno-6m.jpg", "./tatsuno-6m-foot.jpg", "./foam-dim-unit.jpg", "./foam-dim-anchor.jpg", "./foam-dim-piping.jpg", "./foam-dim-head.jpg", "./foam-dim-headcase.jpg", "./gyomu.html", "./fill.html", "./leak.html", "./leak-admin.html", "./leak-list.html", "./sites.json", "./map-kuribayashi.jpg", "./map-igarashi.jpg", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => {
  // 1つのファイルが無くても、ほかは保存できるように1つずつ入れる
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => c.add(new Request(f, {cache: "reload"})).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    // ページ（html）とsites.jsonは、ブラウザの一時保存を使わず毎回いちばん新しいものを取りに行く
    fetch((e.request.mode === "navigate" || /\.(html|json)$/.test(new URL(e.request.url).pathname)) ? new Request(e.request.url, {cache: "no-store", credentials: "same-origin"}) : e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match("./index.html")))
  );
});
