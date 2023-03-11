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

let dbID = "s3";
let isMaster = 0;
// initially the mater is -1
let master = -1;

let aliveServers = {
    s0 : 0,
    s1: 0,
    s2: 0
}

let numNoMaster = 1;

// port 5400: connect with load balancer
const ioWithLoadBalancer = require('socket.io')(5400);
ioWithLoadBalancer.on('connection', function (socket) {
    console.log('Server 4 connected with Load Balancer:', socket.client.id);
});

// make connection with Server 1: port 5130
var ioWithServer1 = require('socket.io-client');
var socketWithS1 = ioWithServer1.connect("http://localhost:5140/", {
    reconnection: true
});

socketWithS1.on('connect', async function () {
    console.log('Server 4 connected to localhost:5140 with Server 1');
    aliveServers. s0= 1;
    
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
            // ask master for a copy of db
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

// make connection with Server 2: port 5240
var ioWithServer2 = require('socket.io-client');
var socketWithS2 = ioWithServer2.connect("http://localhost:5240/", {
    reconnection: true
});

socketWithS2.on('connect', async function () {
    console.log('Server 4 connected to localhost:5240 with Server 2');
    aliveServers. s1= 1;
    
    // first leader election
    socketWithS2.emit('requestMaster');
    socketWithS2.on('responseMaster', function(data){
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

socketWithS2.on('requestMaster', function(){
    socketWithS2.emit('responseMaster',master);
});

socketWithS2.on('disconnect', function(){
    console.log("Server 2 failed!");
    socketWithS2.disconnect();
    aliveServers.s1 = 0;
    
    if(master == 1){
        //start leader election

    }
})

// make connection with Server 3: port 5340
var ioWithServer3 = require('socket.io-client');
var socketWithS3 = ioWithServer3.connect("http://localhost:5340/", {
    reconnection: true
});

socketWithS3.on('connect', async function () {
    console.log('Server 4 connected to localhost:5340 with Server 3');
    aliveServers. s2= 1;
    
    // first leader election
    socketWithS3.emit('requestMaster');
    socketWithS3.on('responseMaster', function(data){
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

socketWithS3.on('requestMaster', function(){
    socketWithS3.emit('responseMaster',master);
});

socketWithS3.on('disconnect', function(){
    console.log("Server 3 failed!");
    socketWithS3.disconnect();
    aliveServers.s2 = 0;
    
    if(master == 2){
        //start leader election
    }
})