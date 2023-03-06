const ioWithFrontEnd = require('socket.io')(3012, {
    cors: {
        origin: '*',
    }
});
let NumOfUser = 0;
let nextSever = 0;
//init server socket
var ioWithServer1 = require('socket.io-client');
var socketWithS1 = ioWithServer1.connect("http://localhost:5100/", {
    reconnection: true
});

let serverList = [ioWithServer1]

ioWithFrontEnd.on("connection", function (socketWithFront) {
    console.log('LB: connected:', socketWithFront.client.id);
    NumOfUser++;
    socketWithFront.on('requestSingleItem', function(data){
        serverList[nextSever].emit('requestSingleItem',data)
        serverList[nextSever].on("responseAllCateInfo", function(response){
            socketWithFront.emit("responseAllCateInfo", response)
        })
    })
})

