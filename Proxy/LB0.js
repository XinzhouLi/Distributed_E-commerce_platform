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
var thisServer4 = 0;
var thisServer5 = 0;
var serverList = new Array();
var serverNumList = new Array();

// // make connection with test server: port 6000
// var ioWithServerTest = require('socket.io-client');
// var socketWithST = ioWithServerTest.connect("http://localhost:6000/", {
//     reconnection: true
// });

// socketWithST.on('connect', function () {
//     console.log(totalNumServer);
//     totalNumServer++;
//     thisServerT = totalNumServer;
//     serverList.push(socketWithST);
//     console.log('Load Balancer connected to localhost:6000 with Test Server, totalNumServer: ' + totalNumServer);

//     socketWithST.once("disconnect", (reason) => {
//         console.log("6000 disconnected because of " + reason);
//         totalNumServer--;
//         //console.log("currentServer after dddddddd: " + currentServer);
//         console.log("------T  "+thisServerT);
//         serverList.splice(thisServerT - 1, 1);
//         console.log("totalNumServer after deleted: " + totalNumServer);
//         //thisServerA--;
//         checkThisServer(socketWithST);
//         console.log("Now A is " + thisServerA);
//         console.log("Server " + thisServerT + " was deleted");
//         if (currentServer > totalNumServer) {
//             console.log("totalNumServerNow: " + totalNumServer);
//             console.log("currentServerNow: " + currentServer)
//             currentServer = currentServer % totalNumServer;
//             if (currentServer == 0 && totalNumServer != 0) {
//                 currentServer = 1;
//             }
//             console.log("if currentServer > total: " + currentServer);
//         }
//     })
// });


// //init server socket
// let ioWithServerA = require('socket.io-client');
// let socketWithSA = ioWithServerA.connect("http://localhost:5100/", {
//     reconnection: true
// });
// socketWithSA.on('connect', function () {
//     console.log(totalNumServer);
//     totalNumServer++;
//     thisServerA = totalNumServer;
//     serverList.push(socketWithSA);
//     console.log('Load Balancer connected to localhost:5100 with Server A, totalNumServer: ' + totalNumServer);

//     socketWithSA.once("disconnect", (reason) => {
//         console.log("5100 disconnected because of " + reason);
//         totalNumServer--;
//         console.log("------A  "+thisServerA);
//         serverList.splice(thisServerA - 1, 1);
//         console.log("Server " + thisServerA + " was deleted");
//         //thisServerT--;
//         checkThisServer(socketWithSA);
//         console.log("Now T is " + thisServerT);
//         console.log("totalNumServer after deleted: " + totalNumServer);
//         if (currentServer > totalNumServer) {
//             console.log("totalNumServerNow: " + totalNumServer);
//             console.log("currentServerNow: " + currentServer)
//             currentServer = currentServer % totalNumServer;
//             if (currentServer == 0 && totalNumServer != 0) {
//                 currentServer = 1;
//             }
//             console.log("if currentServer > total: " + currentServer);
//         }
//     })
// });

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
    var serverNum1 = {
        socket: socketWithS1, 
        serverNum: thisServer1
    };
    console.log(serverNum1);
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
        console.log("Server " + thisServer1 + " was deleted, now sever1 is " + serverNumList[0].serverNum, " server2 is " + serverNumList[1].serverNum);
        if (currentServer > totalNumServer) {
            console.log("totalNumServerNow: " + totalNumServer);
            console.log("currentServerNow: " + currentServer)
            currentServer = currentServer % totalNumServer;
            if (currentServer == 0 && totalNumServer != 0) {
                currentServer = 1;
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
    console.log(totalNumServer);
    totalNumServer++;
    thisServer2 = totalNumServer;
    var serverNum2 = {
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
        console.log("Server " + thisServer2 + " was deleted, now sever1 is " + serverNumList[0].serverNum, " server2 is " + serverNumList[1].serverNum);
        if (currentServer > totalNumServer) {
            console.log("totalNumServerNow: " + totalNumServer);
            console.log("currentServerNow: " + currentServer)
            currentServer = currentServer % totalNumServer;
            if (currentServer == 0 && totalNumServer != 0) {
                currentServer = 1;
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
    var serverNum3 = {
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
        console.log("Server " + thisServer3 + " was deleted, now sever1 is " + serverNumList[0].serverNum, " server2 is " + serverNumList[1].serverNum);
        if (currentServer > totalNumServer) {
            console.log("totalNumServerNow: " + totalNumServer);
            console.log("currentServerNow: " + currentServer)
            currentServer = currentServer % totalNumServer;
            if (currentServer == 0 && totalNumServer != 0) {
                currentServer = 1;
            }
            console.log("if currentServer > total: " + currentServer);
        }
    })
});

// // make connection with server 4: port 5400
// var ioWithServer4 = require('socket.io-client');
// var socketWithS4 = ioWithServer4.connect("http://localhost:5400/", {
//     reconnection: true
// });

// socketWithS4.on('connect', function () {
//     console.log(totalNumServer);
//     totalNumServer++;
//     serverNumList[socketWithS4] = totalNumServer;
//     serverList.push(socketWithS4);
//     console.log('Load Balancer connected to localhost:5400 with Test Server, totalNumServer: ' + totalNumServer);

//     socketWithS4.once("disconnect", (reason) => {
//         console.log("5400 disconnected because of " + reason);
//         totalNumServer--;
//         //console.log("currentServer after dddddddd: " + currentServer);
//         serverList.splice(serverNumList[socketWithS4] - 1, 1);
//         console.log("totalNumServer after deleted: " + totalNumServer);
//         checkThisServer(socketWithS4);
//         console.log("Server " + serverNumList[socketWithS4] + " was deleted");
//         if (currentServer > totalNumServer) {
//             console.log("totalNumServerNow: " + totalNumServer);
//             console.log("currentServerNow: " + currentServer)
//             currentServer = currentServer % totalNumServer;
//             if (currentServer == 0 && totalNumServer != 0) {
//                 currentServer = 1;
//             }
//             console.log("if currentServer > total: " + currentServer);
//         }
//     })
// });

// // make connection with server 5: port 5500
// var ioWithServer5 = require('socket.io-client');
// var socketWithS5 = ioWithServer5.connect("http://localhost:5500/", {
//     reconnection: true
// });

// socketWithS5.on('connect', function () {
//     console.log(totalNumServer);
//     totalNumServer++;
//     serverNumList[socketWithS5] = totalNumServer;
//     serverList.push(socketWithS5);
//     console.log('Load Balancer connected to localhost:5500 with Test Server, totalNumServer: ' + totalNumServer);

//     socketWithS5.once("disconnect", (reason) => {
//         console.log("5500 disconnected because of " + reason);
//         totalNumServer--;
//         //console.log("currentServer after dddddddd: " + currentServer);
//         serverList.splice(serverNumList[socketWithS5] - 1, 1);
//         console.log("totalNumServer after deleted: " + totalNumServer);
//         checkThisServer(socketWithS5);
//         console.log("Server " + serverNumList[socketWithS5] + " was deleted");
//         if (currentServer > totalNumServer) {
//             console.log("totalNumServerNow: " + totalNumServer);
//             console.log("currentServerNow: " + currentServer)
//             currentServer = currentServer % totalNumServer;
//             if (currentServer == 0 && totalNumServer != 0) {
//                 currentServer = 1;
//             }
//             console.log("if currentServer > total: " + currentServer);
//         }
//     })
// });







// Connect with frontend
ioWithFrontEnd.on("connection", function (socketWithFront) {
    console.log('LB: front end connected:', socketWithFront.client.id);

    // Listen to the requestAllCateInfo event from front end
    socketWithFront.on('requestAllCateInfo', function (data) {
        console.log('LB: front request all list: ' + data.tableName);
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
    for(let obj in serverList){
        console.log("serverList[" + obj + "]: " + obj.serverNum);
        if(obj.serverNum > socketObj.serverNum){
            obj.serverNum--;
        }
        if(obj.serverNum == socketObj.serverNum){
            serverList.splice(obj, 1);
        }
            
    }
    
    // if(socket == socketWithS4){
    //     serverNumList[socketWithS1]--;
    //     serverNumList[socketWithS2]--;
    //     serverNumList[socketWithS3]--;
    //     serverNumList[socketWithS5]--;
    // }
    // if(socket == socketWithS5){
    //     serverNumList[socketWithS1]--;
    //     serverNumList[socketWithS2]--;
    //     serverNumList[socketWithS3]--;
    //     serverNumList[socketWithS4]--;
    // }

    // if(socket == socketWithST)
    //     thisServerA--;
    // if(socket == socketWithSA)
    //     thisServerT--;
}
