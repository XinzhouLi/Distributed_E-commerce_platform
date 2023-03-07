// const DB = require('./dbServer')
const {response} = require("express");
var sqlite3 = require("sqlite3");
var express = require("express");

var app = express();
app.use(express.json());
var dbPath = '../db/master.db'

var fs = require('fs');
var exec = require('child_process').exec;

let responseAllCateInfo;
let responseSingleItemInfo;
let responseUserOrderStatus;
let editResult;
const ioWithLoadBalancer = require('socket.io')(5101);
ioWithLoadBalancer.on('connection', function (socket) {
    console.log('connected:', socket.client.id);

    socket.on('requestSingleItem', function(data) {
        let Jobj = data;
        let p = new Promise((resolve, reject) =>{
            resolve(getInfoByID(Jobj.tableName, Jobj.IdName, Jobj.Id));
            let l = setTimeout(()=>{
                console.log(responseSingleItemInfo);
                socket.emit('responseSingleItemInfo', JSON.stringify(responseSingleItemInfo));
            },1000/5);
        })
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
        let Jobj = data;
        console.log(data);
        let p = new Promise((resolve, reject) =>{
            resolve(editItemQuantity(Jobj.tableName,Jobj.IdName, Jobj.Id, Jobj.changeNum));
            if(editResult.stat == 1) {
                
            }
            resolve(insertOrder(Jobj.insertOrderData));
            let l = setTimeout(()=>{
                //console.log(responseUserOrderStatus);
                socket.emit('responseUserOrderStatus', JSON.stringify(responseUserOrderStatus));
            },1000/5);
        })
    });

    // socket.on('requestOrderInfo', function(data) {
    //     // ***** Edit ******
    //     // connect to dbserver
    //     let Jobj = JSON.parse(data);
    //     let response = DB.getInfoByID(Jobj.tableName, Jobj.IdName, Jobj.Id)
    //     // ***** EDit ******
    //     // only add to db, if sucess, emit 1
    //     socket.emit('responseOrderInfo', response);
    // });
    
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

// search item by id
//tableName example: bed
//IdName example: bedId
//Id example: b03
function getInfoByID(tableName, IdName, Id) {
    var db = new sqlite3.Database(dbPath, (err, data) => {
        let ans = {stat: "", content: ""}
        if (!err) {
            db.all('SELECT * FROM "' + tableName + '" where "' + IdName + '"="' + Id + '"', (err, data) => {
                if (!err) {
                    // console.log(typeof data)
                    // console.log(data)
                    ans['stat'] = 1;
                    ans['content'] = data;
                    responseSingleItemInfo = ans;
                } else {
                    ans['stat'] = 0;
                    ans['content'] = "sorry did not find '" + tableName + "' info by '" + IdName + "'";
                    console.log(err.message)
                }
            })
        }
    })
}

// create order table
// insertOrderData form: orderId, customerName,customerAddress, cardNumber, exp_date, secu_code, itemName
// insertOrderData example: '"ABDC","chao","188 harvest rose","4563888855742057","05/16","826","Table88"'
function insertOrder(insertOrderData) {
    var db = new sqlite3.Database(dbPath, (err, data) => {
        let ans = {stat: "", content: ""}
        if (!err) {
            db.run('CREATE TABLE IF NOT EXISTS orderInfo(id  integer primary key autoincrement, orderId text, customerName text, customerAddress text, cardNumber text, exp_date text, secu_code integer, itemName text)', (err) => {
                if (!err) {
                    console.log('table is created sucessfully!')
                    db.run('INSERT INTO orderInfo(orderId, customerName,customerAddress, cardNumber, exp_date, secu_code, itemName) values(' + insertOrderData + ')', (err) => {
                        if (!err) {
                            ans['stat'] = 1;
                            ans['content'] = 'Data add successfully!';
                            responseUserOrderStatus = ans;
                        } else {
                            ans['stat'] = 0;
                            ans['content'] = 'Error!';
                            console.log(err);
                        }
                    })
                } else {
                    console.log("yes, error!")
                    console.log(err.message)
                }
            })
        }
    })
}

// edit item quantity
//tableName example: bed
//IdName example: bedId
//Id example: b03
//changeNum: 1
function editItemQuantity(tableName, IdName, Id, changeNum) {
    let ans = {stat: "", content: ""}
    //print bubby
    console.log("decrease the number of " + Id + " by " + changeNum)
    var db = new sqlite3.Database(dbPath, (err, data) => {
        if (!err) {
            // check if the username and password is correct
            db.all('SELECT quantity FROM "' + tableName + '" where "' + IdName + '"="' + Id + '"', (err, data) => {
                //console.log(data)
                if (data.length == 1) {
                    //console.log(data[0]['quantity'])
                    var quantity = data[0]['quantity']
                    let sql;
                    sql = 'UPDATE "' + tableName + '" SET quantity = ? WHERE "' + IdName + '" = ?';
                    let newQuantity = quantity - changeNum
                    db.run(sql, [newQuantity, Id], (err) => {
                        console.log("Reset quantity sucessfully")
                        if (!err) {
                            ans['stat'] = 1;
                            ans['content'] = 'You have changed the "' + tableName + '" quantity successfully!';
                            editResult = ans;
                        } else {
                            ans['stat'] = 0;
                            ans['content'] = 'You have entered the right "' + IdName + '", but changing failed!';
                            editResult = ans;
                        }
                    });
                } else {
                    ans['stat'] = 0;
                    ans['content'] = 'The "' + IdName + '" is not unique';
                    editResult = ans;
                }
            })
        }
    })
}





// Replication

//let flag = true;
function CopyDB(){
    //if (flag){
    exec('sqlite3 ../db/master.db .dump > ../db/master.sql',
        function (error, stdout, stderr) {
        // if (error !== null) {
        //      console.log('exec error: ' + error);
        // }
        
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
                // if (error !== null) {
                //     console.log('exec error: ' + error);
                // }
            });
            console.log('slave1 sql updated');
            //return console.log(err);
        }
        else{
            exec('sqlite3 ../db/slave1.db < ../db/master.sql',
            function (error, stdout, stderr) {
                // if (error !== null) {
                //     console.log('exec error: ' + error);
                // }
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
                // if (error !== null) {
                //     console.log('exec error: ' + error);
                // }
            });
            console.log('slave2 sql updated');
            //return console.log(err);
        }
        else{
            exec('sqlite3 ../db/slave2.db < ../db/master.sql',
            function (error, stdout, stderr) {
                // if (error !== null) {
                //     console.log('exec error: ' + error);
                // }
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
                // if (error !== null) {
                //     console.log('exec error: ' + error);
                // }
            });
            console.log('slave3 sql updated');
            //return console.log(err);
        }
        else{
            exec('sqlite3 ../db/slave3.db < ../db/master.sql',
            function (error, stdout, stderr) {
                // if (error !== null) {
                //     console.log('exec error: ' + error);
                // }
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
                // if (error !== null) {
                //     console.log('exec error: ' + error);
                // }
            });
            console.log('slave4 sql updated');
            //return console.log(err);
        }
        else{
            exec('sqlite3 ../db/slave4.db < ../db/master.sql',
            function (error, stdout, stderr) {
                // if (error !== null) {
                //     console.log('exec error: ' + error);
                // }
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
