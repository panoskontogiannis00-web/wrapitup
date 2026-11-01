// Κρατάει μόνο τα αρχεία της εφαρμογής (σελίδα, εικονίδια) για γρήγορο άνοιγμα.
// Τον ήχο και το "Τώρα παίζει" ΔΕΝ τα αγγίζει ποτέ — έρχονται πάντα ζωντανά.
const CACHE = "wrapitup-v2";
const FILES = ["./", "index.html", "manifest.json",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/favicon-32.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;           // σταθμός, API, γραμματοσειρές: πάντα από το δίκτυο
  e.respondWith(
    fetch(e.request).then(r => {                          // πρώτα η πιο φρέσκια έκδοση…
      const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
    }).catch(() => caches.match(e.request))              // …αν δεν υπάρχει ίντερνετ, η αποθηκευμένη
  );
});
