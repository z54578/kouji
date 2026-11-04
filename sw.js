// アプリを更新したときは、この番号を1つ上げてください（例：v1 → v2）
const CACHE = "koujika-tools-v68";
const FILES = ["./", "./index.html", "./pc.html", "./thread.html", "./weld.html", "./materials.html", "./zfile.html", "./tokico-ga-1.jpg", "./tokico-ga-2.jpg", "./tatsuno-6m.jpg", "./tatsuno-6m-foot.jpg", "./gyomu.html", "./fill.html", "./leak.html", "./leak-admin.html", "./leak-list.html", "./sites.json", "./map-kuribayashi.jpg", "./map-igarashi.jpg", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match("./index.html")))
  );
});
