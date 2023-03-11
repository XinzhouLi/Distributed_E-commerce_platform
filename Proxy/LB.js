const ioWithFrontEnd = require('socket.io')(3012, {
    cors: {
        origin: '*',
    }
});
let totalNumServer = 1;
let NumOfUser = 0;
let currentServer = 0;
let frontSockets = {};

//init server socket
let ioWithServer1 = require('socket.io-client');
let socketWithS1 = ioWithServer1.connect("http://localhost:5101/", {
    reconnection: true
});

const serverList = new Array(socketWithS1)

// Connect with frontend
ioWithFrontEnd.on("connection", function (socketWithFront) {
    console.log('LB: front end connected:', socketWithFront.client.id);
    NumOfUser++;
    // Listen to the requestAllCateInfo event from front end
    socketWithFront.on('requestAllCateInfo', function (data) {
        console.log('LB: front request all list: ' + data.tableName);
        // Send the request to current server
        serverList[currentServer].emit('requestAllCateInfo', data);
        serverList[currentServer].once("responseAllCateInfo", function (response) {
            console.log('LB: Server send back: ' + response + '\n   to ' + socketWithFront.id);
            setInterval(function () {
                //Send the request back to front end
                socketWithFront.emit("responseAllCateInfo", response);
                currentServer++;
                currentServer = currentServer % totalNumServer;
                console.log(currentServer);
                if (response != null) {
                    clearInterval();
                }
            }, 2000);
        })
    })

    // Listen to the requestSingleItem event from front end
    socketWithFront.on('requestSingleItem', function (data) {
        console.log('LB: front request single item: ' + data.tableName + ' ' + data.IdName + ' ' + data.Id);
        // Send the request to current server
        serverList[currentServer].emit('requestSingleItem', data);
        serverList[currentServer].once("responseSingleItemInfo", function (response) {
            console.log('LB: Server send back: ' + response + '\n   to ' + socketWithFront.id);
            // Send the request back to front end
            socketWithFront.emit("responseSingleItemInfo", response);
            currentServer++;
            currentServer = currentServer % totalNumServer;
        })
    })

    // Listen to the addOrder event from front end
    socketWithFront.on('addOrder', function (data) {
        console.log('LB: front request add order: ' + "\"" + data.insertOrderData + "\"");
        // Send the request to current server
        serverList[currentServer].emit('addOrder', "\"" + data + "\"");
        serverList[currentServer].once("responseUserOrderStatus", function (response) {
            console.log('LB: Server send back: ' + response + '\n   to ' + socketWithFront.id);
            // Send the request back to front end
            socketWithFront.emit("responseUserOrderStatus", "Your order has been placed!");
            currentServer++;
            currentServer = currentServer % totalNumServer;
        })
    })

    // Listen to the requestOrderInfo event from front end
    socketWithFront.on('requestOrderInfo', function (data) {
        console.log('LB: front request order info: ' + data.tableName + ' ' + data.IdName + ' ' + data.Id);
        // Send the request to current server
        serverList[currentServer].emit('requestOrderInfo', data);
        serverList[currentServer].once("responseOrderInfo", function (response) {
            console.log('LB: Server send back: ' + response + '\n   to ' + socketWithFront.id);
            // Send the request back to front end
            socketWithFront.emit("responseOrderInfo", response);
            currentServer++;
            currentServer = currentServer % totalNumServer;
        })
    })


})


