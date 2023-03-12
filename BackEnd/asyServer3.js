// load balancer part:
// port 5300: connect with load balancer
const ioWithLoadBalancer = require('socket.io')(5300);
ioWithLoadBalancer.on('connection', function (socket) {
});

// make connection with Server 0: port 5030
var ioWithServer0 = require('socket.io-client');
var socketWithS0 = ioWithServer0.connect("http://localhost:5030/", {
    reconnection: true
});

// make connection with Server 1: port 5130
var ioWithServer1 = require('socket.io-client');
var socketWithS1 = ioWithServer0.connect("http://localhost:5130/", {
    reconnection: true
});

// make connection with Server 2: port 5230
var ioWithServer2 = require('socket.io-client');
var socketWithS2 = ioWithServer2.connect("http://localhost:5230/", {
    reconnection: true
});

//port 5340 connects with server 4
const ioWithServer4 = require('socket.io')(5340);
ioWithServer4.on('connection', async function (socket) {
});

