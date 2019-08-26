//  crowd service-worker.js

    self.version = 1.0;
    var debugMode = true;

    const assets = [
        "/js/watch.js",
        "/js/jquery.min.js",
        "/three/three.js",
        "/three/EditorControls.js",
        "/three/Detector.js",
        "/three/Projector.js",
        "/three/KeyboardState.js",
        "/three/Animation.js",
        "/three/AnimationHandler.js",
        "/three/KeyFrameAnimation.js",
        "./skydomes/skydome002.jpg",
        "./models/human_walk_0_female.js",
        "/css/bootstrap-v3.3.7.min.css",
    ];

    self.addEventListener( "install", function (e) {
        caches.open("google-search")
        .then(function(cache){
            cache.addAll( assets );
        });
    });

    self.addEventListener( "fetch", function (e) {
        e.respondWith( cacheFirst(e.request) );
    });

    function cacheFirst(request) {
        return caches.match(request)
        .then(function(response){
            return response || fetch(request);
        });
    }

    function unistall(){
        self.registration.unregister().then(function(){
            return self.clients.matchAll();
        }).then(function(clients) {
            clients.forEach(function(client){
                client.navigate(client.url);  // it will re-install on reload!
                console.log(`service worker unistalled from client "${client.url}"`);
            });
        });
    }

