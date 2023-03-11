// const DB = require('./dbServer')
var sqlite3 = require("sqlite3");

var dbPath = 'db/master.db'

var fs = require('fs');
const { emit } = require("process");
var exec = require('child_process').exec;

let dbID = "s0";
// default master = -1
let isMaster = 0;
let master = -1;

let responseAllCateInfo;
let responseSingleItemInfo;
let responseUserOrderStatus;
let editResult;

//parameters for election
let needElection=false;
let electionReponseNum=0;
let quitElection=false;
let declareMaster=false;
let totalAlive=0;
let id =0;
let dbVersion=1;

let aliveServers = {
    s1: 0,
    s2: 0,
    s3: 0
};



//assume server 1 id=0, server2 id =1, server3 id=2, server4 id=3

let numNoMaster = 1;


// port 5100: connect with load balancer
const ioWithLoadBalancer = require('socket.io')(5100);
ioWithLoadBalancer.on('connection', function (socket) {
    console.log('Server 1 connected with Load Balancer:', socket.client.id);

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

//setInterval(CopyDB, 10000);

// connect with other servers

//port 5120 connects with server 2
const ioWithServer2 = require('socket.io')(5120);
ioWithServer2.on('connection', async function (socket) {
    console.log('Server 1 connected with Server 2:', socket.client.id);
    aliveServers.s1 = 1;
    let doneRequestWithServer2=false;
    let doneDeclareMasterWithServer2=false;
    totalAlive++;

    // first leader election
    socket.emit('requestMaster'); 
    socket.on('responseMaster', function(data){
        if(data == -1 && master == -1){
            numNoMaster ++;
            // more than half servers have no master
            if(numNoMaster>2){
                // start leader election
                numNoMaster = 0;
                console.log("start leader election");
                doneRequestWithServer2=false;
                quitElection=false;
                needElection=true;
                declareMaster=false;
                doneDeclareMasterWithServer2=false;
            }
        }
        else if(data != -1){
            master = data;
        }
    });

    socket.on('requestMaster', function(){
        socket.emit('responseMaster',master);
    });

    function startElectionWithS2(){
        if(needElection && !doneRequestWithServer2){
            console.log("start election");
            doneRequestWithServer2=true;
            //send my id & 
            let info={'id':id,'dbVersion':dbVersion}
            socket.emit('requestElection',info);
            socket.on('responseElection', function(data){
               if(data==0){
                //0 is quit, I will quit the election
                quitElection=true;
                electionReponseNum++;
               }else if(data ==1){
                electionReponseNum++;
               }else{
                //error should only be 1 or 0
                console.log("election response error : "+data)
               }
               if(electionReponseNum==totalAlive){
                if(!quitElection){
                    //broadcast I am new leader!!!
                    declareLeader=true;
                }
               }
            });
        }
    }
    function declareMaster(){
        if(declareMaster&& !doneDeclareMasterWithServer2){
            socket.emit('declareMaster',id);
            doneDeclareMasterWithServer2=true;
            isMaster=1;
        }
    }

    socket.on('requestElection', function (data){
        console.log("I recieve election request from: "+data)
        let targetId=data.id;
        let targetDBVersion=data.dbVersion;
        if(dbVersion>=targetDBVersion){
            if(id>targetId){
                // 0 is quit: ask target quit
                socket.emit('responseElection',0);
            }else{
                //1 is okay: allow target keep going election
                socket.emit('responseElection',1);
            }
        }else{
            //1 is okay: allow target keep going election
            socket.emit('responseElection',1);
        }
    });
    
    socket.on('delclareMaster', function (data){
        //record master id
        master=data;
        needElection=false;
    });

    socket.on('disconnect', function(){
        console.log("Server 2 failed!");
        socket.disconnect();
        aliveServers.s1 = 0;
        totalAlive--;
        // inform other active servers to record server state
        if(master == 1){
            //start leader election
            console.log("start leader election");
                doneRequestWithServer2=false;
                quitElection=false;
                needElection=true;
                declareMaster=false;
                doneDeclareMasterWithServer2=false;
        }
    })

    // keep check if need to do master election 
    setInterval(startElectionWithS2,1000/2);
    // keep check if need to do master declare
    setInterval(declareMaster,1000/50);

});







//port 5130 connects with server 3
const ioWithServer3 = require('socket.io')(5130);
ioWithServer3.on('connection', async function (socket) {
    console.log('Server 1 connected with Server 3:', socket.client.id);
    aliveServers.s2 = 1;
    let doneRequestWithServer3=false;
    let doneDeclareMasterWithServer3=false;
    totalAlive++;

    // first leader election
    socket.emit('requestMaster'); 
    socket.on('responseMaster', function(data){
        if(data == -1 && master == -1){
            numNoMaster ++;
            // more than half servers have no master
            if(numNoMaster>2){
                // start leader election
                numNoMaster = 0;
                console.log("start leader election");
                doneRequestWithServer3=false;
                quitElection=false;
                needElection=true;
                declareMaster=false;
                doneDeclareMasterWithServer3=false;
            }
        }
        else if(data != -1){
            master = data;
        }
    });

    socket.on('requestMaster', function(){
        socket.emit('responseMaster',master);
    });

    function startElectionWithS3(){
        if(needElection && !doneRequestWithServer3){
            console.log("start election");
            doneRequestWithServer3=true;
            //send my id & 
            let info={'id':id,'dbVersion':dbVersion}
            socket.emit('requestElection',info);
            socket.on('responseElection', function(data){
               if(data==0){
                //0 is quit, I will quit the election
                quitElection=true;
                electionReponseNum++;
               }else if(data ==1){
                electionReponseNum++;
               }else{
                //error should only be 1 or 0
                console.log("election response error : "+data)
               }
               if(electionReponseNum==totalAlive){
                if(!quitElection){
                    //broadcast I am new leader!!!
                    declareLeader=true;
                }
               }
            });
        }
    }
    //broad cast that i am the master
    function declareMaster(){
        if(declareMaster&& !doneDeclareMasterWithServer3){
            socket.emit('declareMaster',id);
            doneDeclareMasterWithServer3=true;
            isMaster=1;
        }
    }

    socket.on('requestElection', function (data){
        console.log("I recieve election request from: "+data)
        let targetId=data.id;
        let targetDBVersion=data.dbVersion;
        if(dbVersion>=targetDBVersion){
            if(id>targetId){
                // 0 is quit: ask target quit
                socket.emit('responseElection',0);
            }else{
                //1 is okay: allow target keep going election
                socket.emit('responseElection',1);
            }
        }else{
            //1 is okay: allow target keep going election
            socket.emit('responseElection',1);
        }
    });
    
    socket.on('delclareMaster', function (data){
        //record master id
        master=data;
        needElection=false;
    });

    socket.on('disconnect', function(){
        console.log("Server 3 failed!");
        socket.disconnect();
        aliveServers.s2 = 0;
        totalAlive--;
        // inform other active servers to record server state
        if(master == 1){
            //start leader election
            console.log("start leader election");
                doneRequestWithServer3=false;
                quitElection=false;
                needElection=true;
                declareMaster=false;
                doneDeclareMasterWithServer3=false;
        }
    })

    // keep check if need to do master election 
    setInterval(startElectionWithS3,1000/2);
    // keep check if need to do master declare
    setInterval(declareMaster,1000/50);
});







//port 5140 connects with server 4
const ioWithServer4 = require('socket.io')(5140);
ioWithServer4.on('connection', async function (socket) {
    console.log('Server 1 connected with Server 4:', socket.client.id);
    aliveServers.s3 = 1;
    let doneRequestWithServer4=false;
    let doneDeclareMasterWithServer4=false;
    totalAlive++;

    // first leader election
    socket.emit('requestMaster'); 
    socket.on('responseMaster', function(data){
        if(data == -1 && master == -1){
            numNoMaster ++;
            // more than half servers have no master
            if(numNoMaster>2){
                // start leader election
                numNoMaster = 0;
                console.log("start leader election");
                doneRequestWithServer4=false;
                quitElection=false;
                needElection=true;
                declareMaster=false;
                doneDeclareMasterWithServer4=false;
            }
        }
        else if(data != -1){
            master = data;
        }
    });

    socket.on('requestMaster', function(){
        socket.emit('responseMaster',master);
    });

    function startElectionWithS4(){
        if(needElection && !doneRequestWithServer4){
            console.log("start election");
            doneRequestWithServer4=true;
            //send my id & 
            let info={'id':id,'dbVersion':dbVersion}
            socket.emit('requestElection',info);
            socket.on('responseElection', function(data){
               if(data==0){
                //0 is quit, I will quit the election
                quitElection=true;
                electionReponseNum++;
               }else if(data ==1){
                electionReponseNum++;
               }else{
                //error should only be 1 or 0
                console.log("election response error : "+data)
               }
               if(electionReponseNum==totalAlive){
                if(!quitElection){
                    //broadcast I am new leader!!!
                    declareLeader=true;
                }
               }
            });
        }
    }
    //broad cast that i am the master
    function declareMaster(){
        if(declareMaster&& !doneDeclareMasterWithServer4){
            socket.emit('declareMaster',id);
            doneDeclareMasterWithServer4=true;
            isMaster=1;
        }
    }

    socket.on('requestElection', function (data){
        console.log("I recieve election request from: "+data)
        let targetId=data.id;
        let targetDBVersion=data.dbVersion;
        if(dbVersion>=targetDBVersion){
            if(id>targetId){
                // 0 is quit: ask target quit
                socket.emit('responseElection',0);
            }else{
                //1 is okay: allow target keep going election
                socket.emit('responseElection',1);
            }
        }else{
            //1 is okay: allow target keep going election
            socket.emit('responseElection',1);
        }
    });
    
    socket.on('delclareMaster', function (data){
        //record master id
        master=data;
        needElection=false;
    });

    socket.on('disconnect', function(){
        console.log("Server 4 failed!");
        socket.disconnect();
        aliveServers.s3 = 0;
        totalAlive--;
        // inform other active servers to record server state
        if(master == 1){
            //start leader election
            console.log("start leader election");
                doneRequestWithServer4=false;
                quitElection=false;
                needElection=true;
                declareMaster=false;
                doneDeclareMasterWithServer4=false;
        }
    })

    // keep check if need to do master election 
    setInterval(startElectionWithS4,1000/2);
    // keep check if need to do master declare
    setInterval(declareMaster,1000/50);
});