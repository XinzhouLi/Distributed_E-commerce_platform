// const DB = require('./dbServer')
const {response} = require("express");
var sqlite3 = require("sqlite3");
var express = require("express");

var app = express();
app.use(express.json());

//change db address
// var dbPath = '../db/master.db'

var fs = require('fs');
var exec = require('child_process').exec;

let dbID = "s1";
let isMaster = 0;
// initially the mater is -1
let master = -1;

let aliveServers = {
    s0: 0,
    s2: 0,
    s3: 0
}

let numNoMaster = 1;

// port 5200: connect with load balancer
const ioWithLoadBalancer = require('socket.io')(5200);
ioWithLoadBalancer.on('connection', function (socket) {
    console.log('Server 2 connected with Load Balancer:', socket.client.id);
});

// make connection with Server 1: port 5120
var ioWithServer1 = require('socket.io-client');
var socketWithS1 = ioWithServer1.connect("http://localhost:5120/", {
    reconnection: true
});

socketWithS1.on('connect', async function () {
    console.log('Server 2 connected to localhost:5120 with Server 1');
    aliveServers.s0 = 1;
    
    // first leader election
    socketWithS1.emit('requestMaster');
    socketWithS1.on('responseMaster', function(data){
        if(data == -1 && master == -1){
            numNoMaster ++;
            // more than half servers have no master
            if(numNoMaster>2){
                // start leader election
                numNoMaster = 0;
                console.log("start leader election");
            }
        }
        else if(data != -1){
            master = data;
        }
    });
   
});

socketWithS1.on('requestMaster', function(){
    socketWithS1.emit('responseMaster',master);
});

socketWithS1.on('disconnect', function(){
    console.log("Server 1 failed!");
    socketWithS1.disconnect();
    aliveServers.s0 = 0;
    
    if(master == 0){
        //start leader election
    }
})

//port 5230 connects with server 3
const ioWithServer3 = require('socket.io')(5230);
ioWithServer3.on('connection', async function (socket) {
    console.log('Server 2 connected with Server 3:', socket.client.id);
    aliveServers.s2 = 1;

    // first leader election
    socket.emit('requestMaster');
    socket.on('responseMaster', function(data){
        if(data == -1 && master == -1){
            numNoMaster ++;
            // more than half servers have no master
            if(numNoMaster>2){
                // start leader election
                numNoMaster = 0;
                console.log("start leader election");
            }
        }
        else if(data != -1){
            master = data;
        }
    });

    socket.on('requestMaster', function(){
        socket.emit('responseMaster',master);
    });
    
    socket.on('disconnect', function(){
        console.log("Server 3 failed!");
        socket.disconnect();
        aliveServers.s2 = 0;
        // inform other active servers to record server state
        
        if(master == 2){
            //start leader election
        }
    })
});

//port 5240 connects with server 4
const ioWithServer4 = require('socket.io')(5240);
ioWithServer4.on('connection', async function (socket) {
    console.log('Server 2 connected with Server 4:', socket.client.id);
    aliveServers.s3 = 1;

    // first leader election
    socket.emit('requestMaster');
    socket.on('responseMaster', function(data){
        if(data == -1 && master == -1){
            numNoMaster ++;
            // more than half servers have no master
            if(numNoMaster>2){
                // start leader election
                numNoMaster = 0;
                console.log("start leader election");
            }
        }
        else if(data != -1){
            master = data;
        }
    });

    socket.on('requestMaster', function(){
        socket.emit('responseMaster',master);
    });
    
    socket.on('disconnect', function(){
        console.log("Server 4 failed!");
        socket.disconnect();
        aliveServers.s3 = 0;
        // inform other active servers to record server state
        
        if(master == 3){
            //start leader election
        }
    })
});