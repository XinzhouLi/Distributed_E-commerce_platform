const ioWithFrontEnd = require('socket.io')(3010, {
    cors: {
        origin: '*',
    }
});

var totalNumServer = 0;
var currentServer = 1;
var thisServer1 = 0;
var thisServer2 = 0;
var thisServer3 = 0;
var serverList = new Array();
var serverNumList = new Array();



const ioWithLb1 = require('socket.io')(6666, {
    cors: {
        origin: '*',
    }
});

ioWithLb1.on("connection", function (socketWithLb1) {
    console.log("LB1 connected");
    socketWithLb1.emit("helloMessage","Hello I'm LB0");
    socketWithLb1.on("helloMessage", (data) => {
        console.log(data);
    })
})

// make connection with server 1: port 5101
var ioWithServer1 = require('socket.io-client');
var socketWithS1 = ioWithServer1.connect("http://localhost:5101/", {
    reconnection: true
});

socketWithS1.on('connect', function () {
    console.log(totalNumServer);
    totalNumServer++;
    thisServer1 = totalNumServer;
    let serverNum1 = {
        socket: socketWithS1, 
        serverNum: thisServer1
    };
    
    serverList.push(socketWithS1);
    serverNumList.push(serverNum1);
    console.log('Load Balancer connected to localhost:5101 with Test Server, totalNumServer: ' + totalNumServer);
    console.log('This server is ' + thisServer1 + ' in serverList');
    socketWithS1.once("disconnect", (reason) => {
        console.log("5101 disconnected because of " + reason);
        totalNumServer--;
        //console.log("currentServer after dddddddd: " + currentServer);
        serverList.splice(thisServer1 - 1, 1);
        console.log(serverNum1);
        checkThisServer(serverNum1);
        console.log("totalNumServer after deleted: " + totalNumServer);
        console.log("Server " + thisServer1 + " was deleted");
        if (currentServer > totalNumServer) {
            console.log("totalNumServerNow: " + totalNumServer);
            console.log("currentServerNow: " + currentServer)
            currentServer = currentServer % totalNumServer;
            if (currentServer == 0 && totalNumServer != 0) {
                currentServer = 1;
            }
            else if(totalNumServer == 0) {
                currentServer = 1;
                totalNumServer = 0;
            }
            console.log("if currentServer > total: " + currentServer);
        }
    })
});

// make connection with server 2: port 5200
var ioWithServer2 = require('socket.io-client');
var socketWithS2 = ioWithServer2.connect("http://localhost:5200/", {
    reconnection: true
});

socketWithS2.on('connect', function () {
    totalNumServer++;
    thisServer2 = totalNumServer;
    let serverNum2 = {
        socket: socketWithS2, 
        serverNum: thisServer2
    };
    serverList.push(socketWithS2);
    serverNumList.push(serverNum2);
    console.log('Load Balancer connected to localhost:5200 with Test Server, totalNumServer: ' + totalNumServer);
    console.log('This server is ' + thisServer2 + ' in serverList');
    socketWithS2.once("disconnect", (reason) => {
        console.log("5200 disconnected because of " + reason);
        totalNumServer--;
        //console.log("currentServer after dddddddd: " + currentServer);
        serverList.splice(thisServer2 - 1, 1);
        checkThisServer(serverNum2);
        console.log("totalNumServer after deleted: " + totalNumServer);
        console.log("Server " + thisServer2 + " was deleted");
        if (currentServer > totalNumServer) {
            console.log("totalNumServerNow: " + totalNumServer);
            console.log("currentServerNow: " + currentServer)
            currentServer = currentServer % totalNumServer;
            if (currentServer == 0 && totalNumServer != 0) {
                currentServer = 1;
            }
            else if(totalNumServer == 0) {
                currentServer = 1;
                totalNumServer = 0;
            }
            console.log("if currentServer > total: " + currentServer);
        }
    })
});

// make connection with server 3: port 5300
var ioWithServer3 = require('socket.io-client');
var socketWithS3 = ioWithServer3.connect("http://localhost:5300/", {
    reconnection: true
});

socketWithS3.on('connect', function () {
    console.log(totalNumServer);
    totalNumServer++;
    thisServer3 = totalNumServer;
    let serverNum3 = {
        socket: socketWithS3, 
        serverNum: thisServer3
    };
    serverList.push(socketWithS3);
    serverNumList.push(serverNum3);
    console.log('Load Balancer connected to localhost:5300 with Test Server, totalNumServer: ' + totalNumServer);
    console.log('This server is ' + thisServer3 + ' in serverList');
    socketWithS3.once("disconnect", (reason) => {
        console.log("5300 disconnected because of " + reason);
        totalNumServer--;
        //console.log("currentServer after dddddddd: " + currentServer);
        serverList.splice(thisServer3 - 1, 1);
        checkThisServer(serverNum3);
        console.log("totalNumServer after deleted: " + totalNumServer);
        console.log("Server " + thisServer3 + " was deleted");
        if (currentServer > totalNumServer) {
            console.log("totalNumServerNow: " + totalNumServer);
            console.log("currentServerNow: " + currentServer)
            currentServer = currentServer % totalNumServer;
            if (currentServer == 0 && totalNumServer != 0) {
                currentServer = 1;
            }
            else if(totalNumServer == 0) {
                currentServer = 1;
                totalNumServer = 0;
            }
            console.log("if currentServer > total: " + currentServer);
        }
    })
});









// Connect with frontend
ioWithFrontEnd.on("connection", function (socketWithFront) {
    console.log('LB: front end connected:', socketWithFront.client.id);

    // Listen to the requestAllCateInfo event from front end
    socketWithFront.on('requestAllCateInfo', function (data) {
        console.log('LB: front request all list: ' + data.tableName);
        console.log('LB: currentServer: ' + currentServer);
        // Send the request to current server
        serverList[currentServer - 1].emit('requestAllCateInfo', data);
        serverList[currentServer - 1].once("responseAllCateInfo", function (response) {
            console.log("Get response from server: " + currentServer);
            console.log('LB: Server send back: ' + response + '\n   to ' + socketWithFront.id);
            //Send the request back to front end
            socketWithFront.emit("responseAllCateInfo", response);
            //clearInterval();
            currentServer++;
            console.log("if response is not null: " + currentServer);
            if (currentServer > totalNumServer) {
                currentServer = currentServer % totalNumServer;
                if (currentServer == 0 && totalNumServer != 0) {
                    currentServer = 1;
                }
                console.log("if currentServer > total: " + currentServer);
            }

            console.log("totalNumServer: " + totalNumServer);
            console.log("currentServer: " + currentServer);
        })
    })

    // Listen to the requestSingleItem event from front end
    socketWithFront.on('requestSingleItem', function (data) {
        console.log('LB: front request single item: ' + data.tableName + ' ' + data.idName + ' ' + data.id);
        // Send the request to current server
        serverList[currentServer - 1].emit('requestSingleItem', data);
        serverList[currentServer - 1].once("responseSingleItemInfo", function (response) {
            console.log("Get response from server: " + currentServer);
            console.log('LB: Server send back: ' + response + '\n   to ' + socketWithFront.id);
            //Send the request back to front end
            socketWithFront.emit("responseSingleItemInfo", response);
            //clearInterval();
            currentServer++;
            console.log("if response is not null: " + currentServer);
            if (currentServer > totalNumServer) {
                currentServer = currentServer % totalNumServer;
                if (currentServer == 0 && totalNumServer != 0) {
                    currentServer = 1;
                }
                console.log("if currentServer > total: " + currentServer);
            }

            console.log("totalNumServer: " + totalNumServer);
            console.log("currentServer: " + currentServer);
        })
    })

    // Listen to the addOrder event from front end
    socketWithFront.on('addOrder', function (data) {
        console.log('LB: front request add order: ' + "\"" + data.insertOrderData + "\"");
        // Send the request to current server
        serverList[currentServer - 1].emit('addOrder', data);
        serverList[currentServer - 1].once("responseUserOrderStatus", function (response) {
            console.log("Get response from server: " + currentServer);
            console.log('LB: Server send back: ' + response + '\n   to ' + socketWithFront.id);
            //Send the request back to front end
            socketWithFront.emit("responseUserOrderStatus", response);
            //clearInterval();
            currentServer++;
            console.log("if response is not null: " + currentServer);
            if (currentServer > totalNumServer) {
                currentServer = currentServer % totalNumServer;
                if (currentServer == 0 && totalNumServer != 0) {
                    currentServer = 1;
                }
                console.log("if currentServer > total: " + currentServer);
            }

            console.log("totalNumServer: " + totalNumServer);
            console.log("currentServer: " + currentServer);
        })
    })
})


function checkThisServer(socketObj){
    console.log("--------------------   checkThisServer   --------------------")
    let temp = 0;
    serverNumList.forEach(obj=>{
        console.log("serverNumList[" + serverNumList.indexOf(obj) + "]: " + obj.serverNum);
        if(obj.serverNum > socketObj.serverNum){
            obj.serverNum--;

        }
        if(obj.serverNum == socketObj.serverNum){
            temp = serverNumList.indexOf(obj);
        }  
    })
    serverNumList.splice(temp, 1);
}
