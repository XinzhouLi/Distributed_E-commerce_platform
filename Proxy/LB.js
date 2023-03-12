const ioWithFrontEnd = require('socket.io')(3012, {
    cors: {
        origin: '*',
    }
});
let totalNumServer = 0;
let currentServer = 1;
const serverList = new Array();

//init server socket
let ioWithServer1 = require('socket.io-client');
let socketWithS1 = ioWithServer1.connect("http://localhost:5101/", {
    reconnection: true
});
socketWithS1.on('connect', function () {
    console.log(totalNumServer);
    totalNumServer++;
    var thisServer = totalNumServer;
    serverList.push(socketWithS1);
    console.log('Load Balancer connected to localhost:5101 with Server 1, totalNumServer: ' + totalNumServer);
    socketWithS1.on("disconnect", (reason) => {
        console.log("5101 disconnected because of " + reason);
        totalNumServer--;
        serverList.splice(thisServer-1, 1);
        
        console.log("totalNumServer after deleted: " + totalNumServer);
        console.log("Server "+(thisServer-1)+" was deleted");
    })
});

//init server socket
let ioWithServerA = require('socket.io-client');
let socketWithSA = ioWithServerA.connect("http://localhost:5100/", {
    reconnection: true
});
socketWithSA.on('connect', function () {
    console.log(totalNumServer);
    totalNumServer++;
    var thisServer = totalNumServer;
    serverList.push(socketWithSA);
    console.log('Load Balancer connected to localhost:5100 with Server A, totalNumServer: ' + totalNumServer);
    
    socketWithSA.on("disconnect", (reason) => {
        console.log("5100 disconnected because of " + reason);
        totalNumServer--;
        serverList.splice(thisServer-1, 1);
        console.log("totalNumServer after deleted: " + totalNumServer);
        console.log("Server "+(thisServer-1)+" was deleted");
    })
});

// make connection with test server: port 6000
var ioWithServerTest = require('socket.io-client');
var socketWithST = ioWithServerTest.connect("http://localhost:6000/", {
    reconnection: true
});

socketWithST.on('connect', function () {
    console.log(totalNumServer);
    totalNumServer++;
    var thisServer = totalNumServer;
    serverList.push(socketWithST);
    console.log('Load Balancer connected to localhost:6000 with Test Server, totalNumServer: ' + totalNumServer);

    socketWithST.on("disconnect", (reason) => {
        console.log("6000 disconnected because of " + reason);
        totalNumServer--;
        serverList.splice(thisServer-1, 1);
        console.log("totalNumServer after deleted: " + totalNumServer);
        console.log("Server "+(thisServer-1)+" was deleted");
    })
});


// make connection with Server 2: port 5200
var ioWithServer2 = require('socket.io-client');
var socketWithS2 = ioWithServer2.connect("http://localhost:5200/", {
    reconnection: true
});

socketWithS2.on('connect', function () {
    console.log(totalNumServer);
    totalNumServer++;
    serverList.push(socketWithS2);
    console.log('Load Balancer connected to localhost:5200 with Server 2, totalNumServer: ' + totalNumServer);
});

// make connection with Server 3: port 5300
var ioWithServer3 = require('socket.io-client');
var socketWithS3 = ioWithServer3.connect("http://localhost:5300/", {
    reconnection: true
});
socketWithS3.on('connect', function () {
    console.log('Load Balancer connected to localhost:5300 with Server 3, totalNumServer: ' + totalNumServer);
});

// make connection with Server 4: port 5400
var ioWithServer4 = require('socket.io-client');
var socketWithS4 = ioWithServer4.connect("http://localhost:5400/", {
    reconnection: true
});
socketWithS4.on('connect', function () {
    console.log('Load Balancer connected to localhost:5400 with Server 4, totalNumServer: ' + totalNumServer);
});





// Connect with frontend
ioWithFrontEnd.on("connection", function (socketWithFront) {
    console.log('LB: front end connected:', socketWithFront.client.id);

    // Listen to the requestAllCateInfo event from front end
    socketWithFront.on('requestAllCateInfo', function (data) {
        console.log('LB: front request all list: ' + data.tableName);
        // Send the request to current server
        serverList[currentServer-1].emit('requestAllCateInfo', data);
        serverList[currentServer-1].once("responseAllCateInfo", function (response) {
            console.log("Get response from server: " + currentServer);
            console.log('LB: Server send back: ' + response + '\n   to ' + socketWithFront.id);
            //setInterval(function () {
                //Send the request back to front end
                socketWithFront.emit("responseAllCateInfo", response);
                if (response != null) {
                    //clearInterval();
                    currentServer++;
                    console.log("if response is not null: " + currentServer);
                    if(currentServer > totalNumServer){
                        currentServer = currentServer % totalNumServer;
                        console.log("if currentServer > total: " + currentServer);
                    }
                }
                else {
                    console.log("response is null");
                }
            //}, 5000);
            console.log("totalNumServer: " + totalNumServer);
            console.log("currentServer: " + currentServer);
        })
    })

    // Listen to the requestSingleItem event from front end
    socketWithFront.on('requestSingleItem', function (data) {
        console.log('LB: front request single item: ' + data.tableName + ' ' + data.IdName + ' ' + data.Id);
        // Send the request to current server
        serverList[currentServer-1].emit('requestSingleItem', data);
        serverList[currentServer-1].once("responseSingleItemInfo", function (response) {
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
        serverList[currentServer-1].emit('addOrder', "\"" + data + "\"");
        serverList[currentServer-1].once("responseUserOrderStatus", function (response) {
            console.log('LB: Server send back: ' + response + '\n   to ' + socketWithFront.id);
            // Send the request back to front end
            socketWithFront.emit("responseUserOrderStatus", "Your order has been placed!");
            currentServer++;
            currentServer = currentServer % totalNumServer;
        })
    })
})


