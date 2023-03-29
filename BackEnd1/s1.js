const DB = require('./asyDB')

let totalServer=3;

let minServerRequire=parseInt((totalServer/2));

// Multiple server communication:
//parameters for election
let quitElection = false;
let needElection=false;
let electionReponseNum=0;
let totalAlive=1;
let id =1;
let dbVersion=1;
let isMaster = false;
let master = -1;

let numNoMaster =0;
let activeSocket = new Map();
let db = "db1.db";

//init variables for consistency
const events = require('events');
let emitter = new events.EventEmitter()
let localAvailable = true;
let globalAvailable = true;
let whoHold = -1;
const waitingList = [];
let ifSendToken=true;
let numCompleteWriteOrder = 0;


// make connection with Server 1: port 6000
let activeIo = require('socket.io-client');
let socketWithS0 = activeIo.connect("http://localhost:5100/", {
    reconnection: true
});
registerListener(socketWithS0)
// make connection with Server 2: port 7000
let socketWithS2 = activeIo.connect("http://localhost:7100/", {
    reconnection: true
});
registerListener(socketWithS2)
//port 5000 as server side to receive s1 and s2 messages
const ioS1 = require('socket.io')(6100);

const ioWithLoadBalancer = require('socket.io')(5200);





//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------

//下面都是可以被复制的
//用了更多的三目运算来优化了之前老要调添加对应的socket到map中
ioWithLoadBalancer.on('connection', function (socket) {
    console.log('Server '+id+': connected with Load Balancer:', socket.client.id);

    socket.on('requestSingleItem', async function (data) {
        console.log('Server '+ id+' process requestSingleItem')
        let input = data
        let result = await DB.getInfoByID(input.tableName, input.idName, input.id)
        socket.emit('responseSingleItemInfo', result)
        console.log('Server '+id+' Send back', result)
    });

    socket.on('requestAllCateInfo', async function (data) {
        console.log('Server '+ id+' process requestAllCateInfo')
        let input = data;
        let result = await DB.getAllInfo(input.tableName)
        socket.emit('responseAllCateInfo', result)
        console.log('Server '+id+' Send back', result)
    });

    socket.on('addOrder', async function (data) {
        let input = data;
        console.log('Server '+ id+' process addOrder')
        let UUID = Math.floor(Math.random() * 1000000)
        let checkInfo = await DB.getInfoByID(input.tableName, input.idName, input.id)
        waitingList.push(UUID)
        await processAddOrder(UUID, input, socket, checkInfo)
    });

});
ioS1.on('connect', async function(socket){
    totalAlive ++;
    console.log("Current alive: ", totalAlive);
    socket.emit('who')
    socket.on('iam', async (data) => {
        console.log("Server " +id, "connected with " + "Server "+ data)
        activeSocket.set(data, {react: socket, acti: data === 0 ? socketWithS0 : (data === 1 ? socketWithS1 : socketWithS2)})
    })
    if(isMaster){
        console.log("Server "+id+" SQL file sent to slaves");
        DB.sendLocalSQL(db, socket);
    }


    //预留三秒时间 等待连接并存储socket的信息，否则会出现回调问题
    let t0 = setTimeout(()=>{
        if(isMaster){
            console.log("Server "+id+ "  is master");
        }
        else if(totalAlive == totalServer) {
            for (let[key, value] of activeSocket){
                if(value.react === socket){
                    value.acti.emit('requestMaster');
                }
            }
            console.log("Server "+id + " request current Master info")
        }
        // intialize token
        if (whoHold == -1){
            for(let[key, value] of activeSocket){
                if (value.react === socket){
                    value.acti.emit("requestTokenInfo")
                    console.log("Server "+id + " request current token info")
                }
            }
        }
    }, 5000);

    //Listen for request master
    socket.on('requestMaster', function(){
        socket.emit('responseMaster',master);
        console.log(1)
    });

    socket.on('requestElection', function (data){
        responseElection(socket,data);
    });

    socket.on('declareMaster',(data)=>{
        master = data;
        quitElection = false;
        console.log("Master changed to Server "+master);
    })

    socket.on('sendSQL', function(data, filename){
        DB.applyMasterSQL(db, data, filename);
        console.log("Received SQL file from master");
    });
    socket.on('setToken', (data)=>{
        whoHold = data;
        ifSendToken=true;
        console.log("Token initialize to hold by Server "+ data);
    })

    socket.on('disconnecteddd', ()=>{
        totalAlive --;
        console.log("Remaining alive: ", totalAlive);
        let offServer;
        // delete off server info
        for (let[key, value] of activeSocket){
            if(value.acti === socket){
                offServer = key;
                activeSocket.delete(key);
            }
        }


        if(offServer == master) {
            if(offServer == whoHold) {
                console.log("Master with token failed, start leader election and reset token");
                electionReponseNum = 0;
                for (let[key, value] of activeSocket){
                    startElection(value.acti, id, key);
                }
            }else {
                ifSendToken = false;
                console.log("Only Master failed, start leader election without reset token");
                electionReponseNum = 0;
                for (let [key, value] of activeSocket) {
                    startElection(value.acti, id, key);
                }
            }
        }else{
            if(offServer == whoHold){
                console.log("only token failed, reset token to Master")
                whoHold = master;
                globalAvailable = true
            }
            // else{
            //     console.log("the failed server is not master and not hold token, do nothing")
            // }
        }

    });
    //tell the asking server who hold the token
    socket.on("requestTokenInfo", ()=>{
        socket.emit("responseTokenInfo",whoHold, globalAvailable)
        console.log("Token Info has been sent out")
    })

    socket.on('writeOrder', async (data)=> {
        console.log("Received a writing order request")
        await DB.editItemQuantity(data.tableName, data.idName, data.id, data.quantityToBuy)
        await DB.insertOrder(data.insertOrderData)
        dbVersion++
        await DB.editVersion(dbVersion)
        socket.emit("completeWriteOrder")
    })
    socket.on("releaseToken",()=>{
        console.log("Token has been released")
        globalAvailable = true
    })
    socket.on("requestToken",(data)=>{
        console.log(whoHold, globalAvailable)
        if (whoHold == id && globalAvailable){
            whoHold = data
            globalAvailable = false
            for (let[key, value] of activeSocket){
                value.acti.emit("TokenHolderChanged", whoHold, globalAvailable)
            }
            console.log("Server "+data+" now holds token")
        }

    })
    socket.on("TokenHolderChanged", (newHolderID, gStatus) => {
        whoHold = newHolderID
        console.log("Server "+newHolderID+" now holds token" )
        if(newHolderID == id){
            console.log("Server "+newHolderID+"try wakeup all the local thread")
        }
        globalAvailable = gStatus
        emitter.emit("wakeup")
    })
});


async function registerListener(sendSocket) {
    dbVersion = (await DB.getVersion())["versionNum"];
    sendSocket.on('responseMaster', function (response) {
        askMaster(response, sendSocket);
    });
    sendSocket.on('who', () => {
        sendSocket.emit('iam', id);
    })
    sendSocket.on('responseElection', async function (data) {
        if (data === 0) {
            //0 is quit, I will quit the election
            quitElection = true;
            electionReponseNum++;
        } else if (data == 1 && quitElection != true) {
            quitElection = false;
            electionReponseNum++;
        } else {
            //error should only be 1 or 0
            quitElection = false;
            console.log("election response error : " + data)
        }
        console.log('electionReponseNum from s0 ' + electionReponseNum + " vote is:" + data)
        if (electionReponseNum === (totalAlive - 1)) {
            if (!quitElection) {
                //broadcast I am new leader!!!
                console.log("Server " + id + " is the leader now")
                master = id;
                isMaster = true;

                for (let [key, value] of activeSocket) {
                    value.acti.emit("declareMaster", id)
                    if (ifSendToken) {
                        value.acti.emit("setToken", id)
                        whoHold = id
                        globalAvailable = true
                        localAvailable = true
                    }
                    DB.sendLocalSQL(db, value.acti);
                }
                ifSendToken = true;
            }
        }
    });

    sendSocket.on('sendSQL', async function (data, filename) {
        await DB.applyMasterSQL(db, data, filename);
        let temp = await DB.getVersion()
        dbVersion = temp["versionNum"]
        console.log("Receive SQL file from Master");
    });

    //set my tokeninfo from other servers' response
    sendSocket.on("responseTokenInfo", (data1, data2) => {
        if (data1 != -1) {
            whoHold = data1
            globalAvailable = data2
            console.log("Init token, hold by Server " + data1)
        }

    })
    sendSocket.on("completeWriteOrder", (data) => {
        numCompleteWriteOrder++
        if (numCompleteWriteOrder == (totalAlive - 1)) {
            waitingList.shift()
            if (waitingList.length == 0) {
                globalAvailable = true
                localAvailable = true
                //向所有人发送 token 无人使用
                console.log("All server done writing task, token release")
                for (let [key, value] of activeSocket) {
                    value.acti.emit("releaseToken")
                }
            } else {
                console.log("wake up all local threads")
                localAvailable = true
                emitter.emit("wakeup")
                // 应答在这里触发，通知所有本地on来检测是否自己应该干活
            }
            numCompleteWriteOrder = 0


        }

    })
    sendSocket.on('disconnect', ()=>{
        totalAlive --;
        console.log("Remaining alive: ", totalAlive);
        let offServer;
        // delete off server info
        for (let[key, value] of activeSocket){
            if(value.acti === sendSocket){
                offServer = key;
                activeSocket.delete(key);
            }
        }


        if(offServer == master) {
            if(offServer == whoHold) {
                console.log("Master with token failed, start leader election and reset token");
                electionReponseNum = 0;
                for (let[key, value] of activeSocket){
                    startElection(value.acti, id, key);
                }
            }else {
                ifSendToken = false;
                console.log("Only Master failed, start leader election without reset token");
                electionReponseNum = 0;
                for (let [key, value] of activeSocket) {
                    startElection(value.acti, id, key);
                }
            }
        }else{
            if(offServer == whoHold){
                console.log("only token failed, reset token to Master")
                whoHold = master;
                globalAvailable = true
            }
            // else{
            //     console.log("the failed server is not master and not hold token, do nothing")
            // }
        }

    });
}

function askMaster(response, socket){
    if(response == -1 && master == -1){
        numNoMaster ++;
        // more than half servers have no master
        if(numNoMaster>minServerRequire){
            // start leader election
            numNoMaster = 0;
            console.log("Start leader election");
            for (let[key, value] of activeSocket){
                // if(value.acti === socket){
                startElection(value.acti, id, key);
                // }
            }
            // declareMaster=false;

        }
    }
    else if(response != -1){
        master = response;
        console.log("My Master status changed to Server",master);
    }
}

function startElection(socket, id, aimId){
    //send my id & dbVersion
    let info={'id':id,'dbVersion':dbVersion}
    socket.emit('requestElection',info);
}

function responseElection(socket,data){
    let targetId=data.id;
    let targetDBVersion=data.dbVersion;

    if(dbVersion>targetDBVersion) {
        // 0 is quit: ask target quit
        socket.emit('responseElection', 0);
    }else if(dbVersion==targetDBVersion){
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
}



async function processAddOrder(UUID, input, socket, checkInfo) {
    if(JSON.parse(checkInfo).content.quantity<input.quantityToBuy){

        let result = JSON.stringify({status: 0, content: "Storage is less than the quantityToBuy"})
        socket.emit('responseUserOrderStatus', result)

    }
    else{
        //try to get token
        if (globalAvailable || localAvailable) {

            if(whoHold == id && localAvailable){
                if (waitingList[0] == UUID){
                    // 我手上持有token 并且本地可用 并我是list中第一位
                    //执行写入操作
                    try {
                        await DB.editItemQuantity(input.tableName, input.idName, input.id, input.quantityToBuy)
                        await DB.insertOrder(input.insertOrderData)
                        dbVersion++
                        await DB.editVersion(dbVersion)
                    } catch (e) {
                        let result = JSON.stringify({status: 0, content: e.message})
                        socket.emit('responseUserOrderStatus', result)
                    }
                    let result = JSON.stringify({status: 1, content: "Order successfully placed"})
                    socket.emit('responseUserOrderStatus', result)
                    //向别人发送写入操作指令
                    console.log("Server "+id+": Send back", result)
                    for(let[key, value] of activeSocket){
                        value.acti.emit("writeOrder", input)
                    }

                }else{
                    //等待并重新执行
                    emitter.once("wakeup", async () => {
                        await processAddOrder(UUID, input, socket, checkInfo)
                    })
                }
            }
            else if(whoHold == id && !localAvailable){
                // 我手上持有token 并且本地其他线程在干活。
                emitter.once("wakeup", async () => {
                    await processAddOrder(UUID, input, socket, checkInfo)
                })
            }
            else if(whoHold != id){
                console.log(whoHold, globalAvailable)
                activeSocket.get(whoHold).acti.emit("requestToken", id)
                //有活 但Token被其他server拥有但空闲，
                //手上没有Token 需要找别人要
                emitter.once("wakeup", async () => {
                    console.log(whoHold)
                    await processAddOrder(UUID, input, socket, checkInfo)
                })
            }
        }
        else if(!globalAvailable){
            //有活 但Token被其他server占用， 等待并重新执行
            emitter.once("wakeup", async () => {
                await processAddOrder(UUID, input, socket, checkInfo)
            })
        }
    }
}