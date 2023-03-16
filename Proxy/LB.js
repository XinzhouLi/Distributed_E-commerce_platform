const ioWithFrontEnd = require('socket.io')(3012, {
    cors: {
        origin: '*',
    }
});
let totalNumServer = 0;
let currentServer = 1;
let thisServerA = 0;
let thisServerT = 0;
let thisServer1 = 0;
let thisServer2 = 0;
let thisServer3 = 0;
let thisServer4 = 0;
let thisServer5 = 0;
const serverList = new Array();

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



// make connection with server 1: port 5101
var ioWithServer1 = require('socket.io-client');
var socketWithS1 = ioWithServer1.connect("http://localhost:5101/", {
    reconnection: true
});

socketWithS1.on('connect', function () {
    console.log(totalNumServer);
    totalNumServer++;
    thisServer1 = totalNumServer;
    serverList.push(socketWithS1);
    console.log('Load Balancer connected to localhost:5101 with Test Server, totalNumServer: ' + totalNumServer);

    socketWithS1.once("disconnect", (reason) => {
        console.log("5101 disconnected because of " + reason);
        totalNumServer--;
        //console.log("currentServer after dddddddd: " + currentServer);
        serverList.splice(thisServer1 - 1, 1);
        console.log("totalNumServer after deleted: " + totalNumServer);
        checkThisServer(socketWithS1);
        console.log("Server " + thisServer1 + " was deleted");
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
    serverList.push(socketWithS2);
    console.log('Load Balancer connected to localhost:5200 with Test Server, totalNumServer: ' + totalNumServer);

    socketWithS2.once("disconnect", (reason) => {
        console.log("5200 disconnected because of " + reason);
        totalNumServer--;
        //console.log("currentServer after dddddddd: " + currentServer);
        serverList.splice(thisServer2 - 1, 1);
        console.log("totalNumServer after deleted: " + totalNumServer);
        checkThisServer(socketWithS2);
        console.log("Server " + thisServer2 + " was deleted");
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
    serverList.push(socketWithS3);
    console.log('Load Balancer connected to localhost:5300 with Test Server, totalNumServer: ' + totalNumServer);

    socketWithS3.once("disconnect", (reason) => {
        console.log("5300 disconnected because of " + reason);
        totalNumServer--;
        //console.log("currentServer after dddddddd: " + currentServer);
        serverList.splice(thisServer3 - 1, 1);
        console.log("totalNumServer after deleted: " + totalNumServer);
        checkThisServer(socketWithS3);
        console.log("Server " + thisServer3 + " was deleted");
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
//     thisServer4 = totalNumServer;
//     serverList.push(socketWithS4);
//     console.log('Load Balancer connected to localhost:5400 with Test Server, totalNumServer: ' + totalNumServer);

//     socketWithS4.once("disconnect", (reason) => {
//         console.log("5400 disconnected because of " + reason);
//         totalNumServer--;
//         //console.log("currentServer after dddddddd: " + currentServer);
//         serverList.splice(thisServer4 - 1, 1);
//         console.log("totalNumServer after deleted: " + totalNumServer);
//         checkThisServer(socketWithS4);
//         console.log("Server " + thisServer4 + " was deleted");
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
//     thisServer5 = totalNumServer;
//     serverList.push(socketWithS5);
//     console.log('Load Balancer connected to localhost:5500 with Test Server, totalNumServer: ' + totalNumServer);

//     socketWithS5.once("disconnect", (reason) => {
//         console.log("5500 disconnected because of " + reason);
//         totalNumServer--;
//         //console.log("currentServer after dddddddd: " + currentServer);
//         serverList.splice(thisServer5 - 1, 1);
//         console.log("totalNumServer after deleted: " + totalNumServer);
//         checkThisServer(socketWithS5);
//         console.log("Server " + thisServer5 + " was deleted");
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


function checkThisServer(socket){
    if(socket == socketWithS1){
        thisServer2--;
        thisServer3--;
        thisServer4--;
        thisServer5--;
    }
    if(socket == socketWithS2){
        thisServer1--;
        thisServer3--;
        thisServer4--;
        thisServer5--;
    }
    if(socket == socketWithS3){
        thisServer1--;
        thisServer2--;
        thisServer4--;
        thisServer5--;
    }
    // if(socket == socketWithS4){
    //     thisServer1--;
    //     thisServer2--;
    //     thisServer3--;
    //     thisServer5--;
    // }
    // if(socket == socketWithS5){
    //     thisServer1--;
    //     thisServer2--;
    //     thisServer3--;
    //     thisServer4--;
    // }

    // if(socket == socketWithST)
    //     thisServerA--;
    // if(socket == socketWithSA)
    //     thisServerT--;
}
