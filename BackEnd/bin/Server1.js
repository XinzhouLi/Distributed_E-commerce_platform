const DB = require('./dbServer')
const {response} = require("express");
const ioWithLoadBalancer = require('socket.io')(5100);
ioWithLoadBalancer.on('connection', function (socket) {
    console.log('connected:', socket.client.id);

    socket.on('requestSingleItem', function(data) {
        // ***** Edit ******
        // connect to dbserver
        let Jobj = JSON.parse(data)
        let response = DB.getInfoByID(Jobj.tableName, Jobj.IdName, Jobj.Id)
        // ***** EDit ******
        socket.emit('responseSingleItemInfo', response);
    });

    socket.on('requestAllCateInfo', function(data) {
        // ***** Edit ******
        // connect to dbserver
        let Jobj = data;
        let response = DB.getAllInfo(Jobj.tableName);
        console.log(response)
        // ***** EDit ******
        socket.emit('responseAllCateInfo', JSON.stringify(response));
    });

    socket.on('addOrder', function(data) {
        // ***** Edit ******
        // connect to dbserver
        let Jobj = JSON.parse(data);
        let response = DB.insertOrder(Jobj.insertOrderData);
        // ***** EDit ******
        // only add to db, if sucess, emit 1
        socket.emit('responseUserOrderStatus', response);
    });

    socket.on('requestOrderInfo', function(data) {
        // ***** Edit ******
        // connect to dbserver
        let Jobj = JSON.parse(data);
        let response = DB.getInfoByID(Jobj.tableName, Jobj.IdName, Jobj.Id)
        // ***** EDit ******
        // only add to db, if sucess, emit 1
        socket.emit('responseOrderInfo', response);
    });
    
});

//
// function copyDB(){
//     fs.copyFile('../db/master.db', './db/slave1.db', (err) => {
//         if (err) throw err;
//         console.log('master.db was copied to slave1.db');
//     });
//     fs.copyFile('./db/master.db', './db/slave2.db', (err) => {
//         if (err) throw err;
//         console.log('master.db was copied to slave2.db');
//     });
//     fs.copyFile('./db/master.db', './db/slave3.db', (err) => {
//         if (err) throw err;
//         console.log('master.db was copied to slave3.db');
//     });
//     fs.copyFile('./db/master.db', './db/slave4.db', (err) => {
//         if (err) throw err;
//         console.log('master.db was copied to slave4.db');
//     });
// }
// setInterval(copyDB, 3000);
