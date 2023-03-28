// server 1 == 0 means that server 1 is abvaible for task
let serverStatus = {
    server1: 0
}

let serverCurrentTask = {
    server1 : 0
}

let taskQueue = [];
let reqestSingleItem = 0;
let responseSingleItemInfo = 0;
let reqestAllCateInfo = 0;
let responseAllCateInfo = 0;
let userInfo = 0;
let responseUserOrderStatus = 0;
// let reqestOrderInfo = 0;
// let responseOrderInfo = 0;

// listen to Front End Server: port 3010
// const ioWithFrontEnd = require('socket.io')(3010);
const ioWithFrontEnd = require('socket.io')(3010, {
    cors: {
      origin: '*',
    }
  });


ioWithFrontEnd.on('connection', function (socketWithFrontEnd) {
    console.log('Load Balancer connected with Front End:', socketWithFrontEnd.client.id);
    startTaskDistributing();
    // data: itemID
    socketWithFrontEnd.on('requestSingleItem', function(data){
        // console.log("Data in loadBalancer is:..."+data)
        taskQueue.push("requestSingleItem");
        reqestSingleItem = data;
        // wait for 2 sec to let server complish task
        let timeOut = setTimeout(function(){
        if(responseSingleItemInfo != 0){
            socketWithFrontEnd.emit('responseSingleItemInfo', responseSingleItemInfo);
            reqestSingleItem = 0;
            responseSingleItemInfo = 0;
        }
        else{
            console.log("Server Not Response!");
            // if not success, add the task to the queue again
            taskQueue.push("requestSingleItem");
        }
        }, 2000);
    });

    //data: category name
    socketWithFrontEnd.on('requestAllCateInfo', function(data){
        taskQueue.push("requestAllCateInfo");
        reqestAllCateInfo = data;
        console.log(data)
        // wait for 2 sec to let server complish task
        let timeOut = setTimeout(function(){
        if(responseAllCateInfo != 0){
            socketWithFrontEnd.emit('responseAllCateInfo', responseAllCateInfo);
            reqestAllCateInfo = 0;
            responseAllCateInfo = 0;
        }
        else{
            console.log("Server Not Response!");
            taskQueue.push("requestAllCateInfo");
        }
        }, 2000);
    });


    //data: user info
    socketWithFrontEnd.on('addOrder', function(data){
        taskQueue.push("addOrder");
        userInfo = data;
        // wait for 2 sec to let server complish task
        let timeOut = setTimeout(function(){
        if(responseUserOrderStatus != 0){
            socketWithFrontEnd.emit('responseUserOrderStatus', "Your order has been successfully placed!");
            userInfo = 0;
            responseUserOrderStatus = 0;
        }
        else{
            console.log("Server Not Response!");
            taskQueue.push("addOrder");
        }
        }, 2000);
    });

    // //data: order ID
    // socketWithFrontEnd.on('requestOrderInfo', function(data){
    //     taskQueue.push("requestOrderInfo");
    //     reqestOrderInfo = data;
    //     // wait for 2 sec to let server complish task
    //     let timeOut = setTimeout(function(){
    //     if(responseOrderInfo != 0){
    //         socketWithFrontEnd.emit('responseOrderInfo', responseOrderInfo);
    //         reqestOrderInfo = 0;
    //         responseOrderInfo = 0;
    //     }
    //     else{
    //         console.log("Server Not Response!");
    //         taskQueue.push("requestOrderInfo");
    //     }
    //     }, 2000);
    // });
});

function startTaskDistributing() {
    let taskDistributing = setInterval( () => {
        if(taskQueue.length != 0) {
            for(let i = 0; i < taskQueue.length; i++) {
                if(serverStatus.server1 == 0) {
                    serverCurrentTask.server1 = taskQueue[i];
                    // remove the first task
                    taskQueue.shift();
                }
                // ********** edit later**************
            // else if(serverStatus.server2 == 0) {
            //     serverCurrentTask.server2 = taskQueue[i];
                //    // remove the first task
                //    taskQueue.shift();
            // }
            // else if(serverStatus.server3 == 0) {
            //     serverCurrentTask.server3 = taskQueue[i];
            //    // remove the first task
                //    taskQueue.shift();
            // }
            // else if(serverStatus.server4 == 0) {
            //     serverCurrentTask.server4 = taskQueue[i];
            //    // remove the first task
                //    taskQueue.shift();
            // }
            // else if(serverStatus.server5 == 0) {
            //     serverCurrentTask.server5 = taskQueue[i];
            //    // remove the first task
                //    taskQueue.shift();
            // }
            }
            
        }
    }, 1000/50); 
}


// make connection with Server 1: port 5100
var ioWithServer1 = require('socket.io-client');
var socketWithS1 = ioWithServer1.connect("http://localhost:5100/", {
    reconnection: true
});

socketWithS1.on('connect', function () {
    console.log('Load Balancer connected to localhost:5100 with Server 1');

    let timeInterval = setInterval(() => {
        if(serverCurrentTask.server1 != 0 && serverCurrentTask.server1 == "requestSingleItem") {
            serverStatus.server1 = 1;
            socketWithS1.emit('requestSingleItem', reqestSingleItem);
            serverCurrentTask.server1 = 0;
            socketWithS1.on('responseSingleItemInfo', function(data){
                responseSingleItemInfo = data;
            });
            serverStatus.server1 = 0;
        }
    
        if(serverCurrentTask.server1 != 0 && serverCurrentTask.server1 == "requestAllCateInfo") {
            serverStatus.server1 = 1;
            socketWithS1.emit('requestAllCateInfo', reqestAllCateInfo);
            serverCurrentTask.server1 = 0;
            socketWithS1.on('responseAllCateInfo', function(data){
                console.log(data);
                responseAllCateInfo = data;
            });
            serverStatus.server1 = 0;
        }
    
        if(serverCurrentTask.server1 != 0 && serverCurrentTask.server1 == "addOrder") {
            serverStatus.server1 = 1;
            socketWithS1.emit('addOrder', userInfo);
            serverCurrentTask.server1 = 0;
            // expected data == 1, means that add order is done
            socketWithS1.on('responseUserOrderStatus', function(data){
                responseUserOrderStatus = data;
            });
            serverStatus.server1 = 0;
        }
    
        // if(serverCurrentTask.server1 != 0 && serverCurrentTask.server1 == "requestOrderInfo") {
        //     serverStatus.server1 = 1;
        //     socketWithS1.emit('requestOrderInfo', reqestOrderInfo);
        //     serverCurrentTask.server1 = 0;
        //     socketWithS1.on('responseOrderInfo', function(data){
        //         responseOrderInfo = data;
        //     });
        //     serverStatus.server1 = 0;
        // }
    }, 1000);
});

// make connection with Server 2: port 5200
var ioWithServer2 = require('socket.io-client');
var socketWithS2 = ioWithServer2.connect("http://localhost:5200/", {
    reconnection: true
});

socketWithS2.on('connect', function () {
    console.log('Load Balancer connected to localhost:5200 with Server 2');
});

// make connection with Server 3: port 5300
var ioWithServer3 = require('socket.io-client');
var socketWithS3 = ioWithServer3.connect("http://localhost:5300/", {
    reconnection: true
});

socketWithS3.on('connect', function () {
    console.log('Load Balancer connected to localhost:5300 with Server 3');
});

// make connection with Server 4: port 5400
var ioWithServer4 = require('socket.io-client');
var socketWithS4 = ioWithServer4.connect("http://localhost:5400/", {
    reconnection: true
});

socketWithS4.on('connect', function () {
    console.log('Load Balancer connected to localhost:5400 with Server 4');
});