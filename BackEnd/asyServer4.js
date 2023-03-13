// load balancer part:
// port 5400: connect with load balancer
const ioWithLoadBalancer = require('socket.io')(5400);
ioWithLoadBalancer.on('connection', function (socket) {
});

// make connection with Server 0: port 5040
var ioWithServer0 = require('socket.io-client');
var socketWithS0 = ioWithServer0.connect("http://localhost:5040/", {
    reconnection: true
});

// make connection with Server 1: port 5140
var ioWithServer1 = require('socket.io-client');
var socketWithS1 = ioWithServer0.connect("http://localhost:5140/", {
    reconnection: true
});

// make connection with Server 2: port 5240
var ioWithServer2 = require('socket.io-client');
var socketWithS2 = ioWithServer2.connect("http://localhost:5240/", {
    reconnection: true
});

// make connection with Server 3: port 5340
var ioWithServer3 = require('socket.io-client');
var socketWithS3 = ioWithServer3.connect("http://localhost:5340/", {
    reconnection: true
});