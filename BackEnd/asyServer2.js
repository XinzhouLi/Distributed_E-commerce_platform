// load balancer part:
// port 5200: connect with load balancer
const ioWithLoadBalancer = require('socket.io')(5200);
ioWithLoadBalancer.on('connection', function (socket) {
});

// make connection with Server 0: port 5020
var ioWithServer0 = require('socket.io-client');
var socketWithS0 = ioWithServer0.connect("http://localhost:5020/", {
    reconnection: true
});

// make connection with Server 1: port 5120
var ioWithServer1 = require('socket.io-client');
var socketWithS1 = ioWithServer0.connect("http://localhost:5120/", {
    reconnection: true
});

//port 5230 connects with server 3
const ioWithServer3 = require('socket.io')(5230);
ioWithServer3.on('connection', async function (socket) {
});

//port 5240 connects with server 4
const ioWithServer4 = require('socket.io')(5240);
ioWithServer4.on('connection', async function (socket) {
});