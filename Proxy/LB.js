const ioWithFrontEnd = require('socket.io')(3012, {
    cors: {
        origin: '*',
    }
});
let totalNumServer = 1;
let NumOfUser = 0;
let currentServer = 0;
//init server socket
let ioWithServer1 = require('socket.io-client');
let socketWithS1 = ioWithServer1.connect("http://localhost:5100/", {
    reconnection: true
});

const serverList = new Array(socketWithS1)

// Connect with frontend
ioWithFrontEnd.on("connection", function (socketWithFront) {
    console.log('LB: front end connected:', socketWithFront.client.id);
    NumOfUser++;
    // Listen to the Event
    socketWithFront.on('requestAllCateInfo', function(data){
        console.log('LB: front request all list: ' + data.tableName)
        // Send the request to current server
        serverList[currentServer].emit('requestAllCateInfo',data)
        serverList[currentServer].on("responseAllCateInfo", function(response){
            console.log('LB: Server send back: ' + JSON.parse(response))
            // Send the request back to front end
            socketWithFront.emit("responseAllCateInfo", response)
            currentServer = currentServer % totalNumServer
            console.log(response)
        })
    })
})

