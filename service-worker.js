//  google webspace search sw.js

    self.version = 1.1;
    var debugMode = true;

    self.addEventListener("fetch", function(e){
    //  debugMode && console.log( e.request );

        if (e.request.url.startsWith( "https://cse.google.com/cse/element" ) ) {
            debugMode && console.log( e.request );
            self.clients.matchAll().then(function(clients){
                var channel = new MessageChannel();
                clients[0].postMessage("refresh", [channel.port2]);
            }).catch(function(err){
                console.error(err);
            });
        }

    });


    self.addEventListener("install", function(e){

        self.skipWaiting();

    });

    self.addEventListener("activate", function(e){

        self.clients.claim();

    });

    function send_message_to_client(client, msg){
        return new Promise(function(resolve, reject){
            var channel = new MessageChannel();

            channel.port1.onmessage = function(e){
                if (e.data.error) {
                    reject(e.data.error);
                } else {
                    resolve(e.data);
                }
            };

            client.postMessage(msg, [channel.port2]);

        });
    }

    function send_message_to_all_clients(msg){
        self.clients.matchAll().then(function(clients){
            clients.forEach(function(client){
                send_message_to_client(client, msg).then(function(msg){
                    console.log("SW Received Message:", msg);
                });
            });
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


