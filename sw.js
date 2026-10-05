/* Offline support for Электролаб 8: the page is served from the cache first
   and refreshed in the background, so it opens without internet after the first visit. */
const CACHE='elektrolab-v1';
const FILES=['./','./index.html','./manifest.webmanifest','./icons/lab-180.png','./icons/lab-192.png','./icons/lab-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET')return;
 e.respondWith(caches.open(CACHE).then(async c=>{
  const hit=await c.match(req,{ignoreSearch:true});
  const net=fetch(req).then(r=>{if(r&&r.ok&&(new URL(req.url).origin===location.origin||r.type==='cors'))c.put(req,r.clone());return r;}).catch(()=>hit);
  return hit||net;
 }));
});
