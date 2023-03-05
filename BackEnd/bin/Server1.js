const DB = require('./dbServer')

const ioWithLoadBalancer = require('socket.io')(5100);
ioWithLoadBalancer.on('connection', function (socket) {
    console.log('connected:', socket.client.id);

    socket.on('requestSingleItem', function(data) {
        // ***** Edit ******
        // connect to dbserver

        // ***** EDit ******
        socket.emit('responseSingleItemInfo');
    });

    socket.on('requestAllCateInfo', function(data) {
        // ***** Edit ******
        // connect to dbserver

        // ***** EDit ******
        socket.emit('responseAllCateInfo');
    });

    socket.on('addOrder', function(data) {
        // ***** Edit ******
        // connect to dbserver

        // ***** EDit ******
        // only add to db, if sucess, emit 1
        socket.emit('responseUserOrderStatus');
    });

    socket.on('requestOrderInfo', function(data) {
        // ***** Edit ******
        // connect to dbserver

        // ***** EDit ******
        // only add to db, if sucess, emit 1
        socket.emit('responseOrderInfo');
    });
    
});

DB.createVersionTable()