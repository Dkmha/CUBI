// Service worker de Cubi: guarda la app y sus librerías para abrirla sin conexión.
const V='cubi-v14';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;if(/api\.maptiler\.com|basemaps\.cartocdn\.com|tile\.openstreetmap\.org/.test(e.request.url))return; // las teselas del mapa no se guardan
e.respondWith(caches.open(V).then(async c=>{const hit=await c.match(e.request);const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone());return r}).catch(()=>hit);return hit||net}))});
