//Variables cache para almacenar nuestro archivos



const CACHE_NAME = 'cache-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v5';  // nunca cambiara
const CACHE_STATIC_NAME = 'static-v12';    ///para cuando eliminamos
const CACHE_DYNAMIC_NAME = 'dynamic-v26';   ///este no cambia

function limpiarCache(cacheName,numeroItems){

    caches.open(cacheName).then(cache=>{
      return cache.keys().then(keys=>{
        if(keys.length>numeroItems)
        cache.delete(keys[0])
        .then(limpiarCache(cacheName,numeroItems));
      });
    });

  }

self.addEventListener('install', e=>{
    const cacheStatic = caches.open(CACHE_STATIC_NAME).then(cache=>{

        return cache.addAll([
            '/',
            '/index.html',

            '/estilo_inicio.css',
            '/js/intalacionSW.js',
            '/img/imagen1.jpg',
            '/js/app.js',
            '/offlline.html',
            '/estilo_offline.css',
            'https://c.tenor.com/nv7f3kZx4EoAAAAC/no-internet.gif',
            '/sin_image.png',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js'

        ]);


        const APP_SHELL_INMUTABLE = [
            'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
            'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'
        ];

        //Se instala el SW
        self.addEventListener('install', event => {

            const cacheStatic = caches.open(STATIC_CACHE).then(cache=>
                cache.addAll(APP_SHELL)
            )

            const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache=>
                cache.addAll(APP_SHELL_INMUTABLE)
            );
            event.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

        });

        //Se activa el SW
        self.addEventListener('activate', event =>{

            const respuesta = caches.keys().then(keys =>{
                keys.forEach(key =>{
                    if(key !== STATIC_CACHE && key.includes('static')){
                        return caches.delete(key);
                    }
                });
            });

            event.waitUntil(respuesta);

        });

        //fetch
        self.addEventListener('fetch', event =>{
            const respuesta = caches.match(event.request).then(res=>{
                //Si el archivo esta en cache
                //Este se muestra
              if (res) {
                  return res;
                }
                //Manda respuesta el que no esta
                //Busca en internet
                //Se guarda en el cache dinamico
                console.log("el archivo solicitado no esta en cache", event.request.url);
                        return fetch(event.request).then((newResp) => {
                        //gurdarl nuevamente en cache
                            caches.open(DYNAMIC_CACHE).then(cache => {
                                cache.put(event.request, newResp);
                            });
                            return newResp.clone();
                        }).catch( err => {
                            if ( event.request.headers.get('accept').includes('text/html') ) {
                                return caches.match('pages/offline.html');
                            }
                        });

            });
            event.respondWith(respuesta);

        });
