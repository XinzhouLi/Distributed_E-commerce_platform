// load balancer part:
// port 5100: connect with load balancer
const ioWithLoadBalancer = require('socket.io')(5100);
ioWithLoadBalancer.on('connection', function (socket) {
});

// make connection with Server 0: port 5010
var ioWithServer0 = require('socket.io-client');
var socketWithS0 = ioWithServer0.connect("http://localhost:5010/", {
    reconnection: true
});

//port 5120 connects with server 2
const ioWithServer2 = require('socket.io')(5120);
ioWithServer2.on('connection', async function (socket) {
});

//port 5130 connects with server 3
const ioWithServer3 = require('socket.io')(5130);
ioWithServer3.on('connection', async function (socket) {
});

//port 5130 connects with server 4
const ioWithServer4 = require('socket.io')(5140);
ioWithServer4.on('connection', async function (socket) {
});