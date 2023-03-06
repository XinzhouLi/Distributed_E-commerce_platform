// const DB = require('./dbServer')
const {response} = require("express");
var sqlite3 = require("sqlite3");
var express = require("express");

var app = express();
app.use(express.json());
var dbPath = '../db/master.db'

let responseAllCateInfo;
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
        let Jobj = data;
        let p = new Promise((resolve, reject) =>{
            resolve(getAllInfo(Jobj.tableName));
            let l = setTimeout(()=>{
            console.log(responseAllCateInfo);
            socket.emit('responseAllCateInfo', JSON.stringify(responseAllCateInfo));
            },1000/5);
        })
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


function getAllInfo(tableName) {
    var db = new sqlite3.Database(dbPath, (err, data) => {
        let ans = {stat: "", content: ""}
        if (!err) {
            db.all('SELECT * FROM "' + tableName + '"', (err, data) => {
                if (!err) {
                    // console.log(typeof data)
                    // console.log(data)
                    ans['stat'] = 1;
                    ans['content'] = data;
                    responseAllCateInfo = ans;
                } else {
                    ans['stat'] = 0;
                    ans['content'] = "sorry did not find  '" + tableName + "' info";
                    console.log(err.message)
                }
            })
        }
    })
}







var fs = require('fs');
var exec = require('child_process').exec;

//let flag = true;
function CopyDB(){
    //if (flag){
    exec('sqlite3 ../db/master.db .dump > ../db/master.sql',
        function (error, stdout, stderr) {
        if (error !== null) {
             console.log('exec error: ' + error);
        }
        
    console.log('master sql created');
        //flag = false;
    //}
    //else{
    fs.stat('../db/slave1.db', function (err, stats) {
        //console.log(stats);//here we got all information of file in stats variable
        fs.unlink('./db/slave1.db',function(err){
        if(err) {
            exec('sqlite3 ../db/slave1.db < ../db/master.sql',
            function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
            console.log('slave1 sql updated');
            //return console.log(err);
        }
        else{
            exec('sqlite3 ../db/slave1.db < ../db/master.sql',
            function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
            console.log('slave1 sql updated');
        }
        });  
    });

    fs.stat('../db/slave2.db', function (err, stats) {
        //console.log(stats);//here we got all information of file in stats variable
        fs.unlink('../db/slave2.db',function(err){
        if(err) {
            exec('sqlite3 ../db/slave2.db < ../db/master.sql',
            function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
            console.log('slave2 sql updated');
            //return console.log(err);
        }
        else{
            exec('sqlite3 ../db/slave2.db < ../db/master.sql',
            function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
        
            console.log('slave2 sql updated');
            //return console.log(err);
        }
        });  
    });

    fs.stat('../db/slave3.db', function (err, stats) {
        //console.log(stats);//here we got all information of file in stats variable
        fs.unlink('../db/slave3.db',function(err){
        if(err) {
            exec('sqlite3 ../db/slave3.db < ../db/master.sql',
            function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
            console.log('slave3 sql updated');
            //return console.log(err);
        }
        else{
            exec('sqlite3 ../db/slave3.db < ../db/master.sql',
            function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
            console.log('slave3 sql updated');
            //return console.log(err);
        }
        });  
    });

    fs.stat('../db/slave4.db', function (err, stats) {
        //console.log(stats);//here we got all information of file in stats variable
        fs.unlink('./db/slave4.db',function(err){
        if(err) {
            exec('sqlite3 ../db/slave4.db < ../db/master.sql',
            function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
            console.log('slave4 sql updated');
            //return console.log(err);
        }
        else{
            exec('sqlite3 ../db/slave4.db < ../db/master.sql',
            function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
            console.log('slave4 sql updated');
            //return console.log(err);
        }
        });  
    });
    //flag = true;
//}
});
}

setInterval(CopyDB, 10000);

