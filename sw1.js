//importScripts('js/sw_aux.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    '/',
    'index.html',
    'img/image.jpg',
    'js/oculta.js',
    'js/app.js'
];

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