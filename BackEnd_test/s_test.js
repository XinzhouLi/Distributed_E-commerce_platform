const DB = require('./asyDB')

let totalServer=3;

let minServerRequire=parseInt((totalServer/2));

// Multiple server communication:
//parameters for election
let quitElection = false;
let needElection=false;
let electionReponseNum=0;
let totalAlive=1;
let id =0;
let dbVersion=1;
let isMaster = false;
let master = -1;

let numNoMaster =0;
let activeSocket = new Map();
let db = "db0.db";

const ioWithLoadBalancer = require('socket.io')(9101);
ioWithLoadBalancer.on('connection', function (socket) {
    console.log('Server 0: connected with Load Balancer:', socket.client.id);

    socket.on('requestSingleItem', async function (data) {
        let input = data
        console.log('Server0: Send in Query')
        let result = await DB.getInfoByID(input.tableName, input.idName, input.id)
        socket.emit('responseSingleItemInfo', result)
        console.log("Server0: Send back", result)
    });

    socket.on('requestAllCateInfo', async function (data) {
        // let input = JSON.parse(data)
        let input = data;
        console.log('Server0: Send in Query')
        let result = await DB.getAllInfo(input.tableName)
        socket.emit('responseAllCateInfo', result)
        console.log("Server0: Send back", result)
    });

    socket.on('addOrder', async function (data) {
        let input = data;
        console.log('Server0: Send in Query')
        console.log(input);
        let result
        try {
            await DB.editItemQuantity(input.tableName, input.idName, input.id, input.quantityToBuy)
            console.log("something")
            await DB.insertOrder(input.insertOrderData)
            result = JSON.stringify({status: 1, content: "Order successfully placed"})
            socket.emit('responseUserOrderStatus', result)
            // await DB.insertVersion()
        } catch (e) {
            console.log("I am here!!!!")
            result = JSON.stringify({status: 0, content: e.message})
            socket.emit('responseUserOrderStatus', result)
        }
        

        console.log("Server0: Send back", result)
    });

});

// make connection with Server 1: port 6000
let activeIo = require('socket.io-client');
let socketWithS1 = activeIo.connect("http://localhost:6100/", {
    reconnection: true
});
registerListener(socketWithS1);

// make connection with Server 2: port 7000
let socketWithS2 = activeIo.connect("http://localhost:7100/", {
    reconnection: true
});
registerListener(socketWithS2);

//port 5000 as server side to receive s1 and s2 messages
const ioS0 = require('socket.io')(5100);
ioS0.on('connect', async function(socket){
    totalAlive ++;

    console.log("Current alive: ", totalAlive);
    socket.join("serverRoom");
    socket.emit('who')
    socket.on('iam', (data)=>{
        console.log(id, "connected with "+ data)
        activeSocket.set(data, {react :socket,  acti: data === 1 ? socketWithS1 : socketWithS2})
        //console.log(activeSocket);
    })
    if(isMaster){
        console.log("S1 SQL file sent to slave");
        await DB.sendLocalSQL(db, socket);
    }

    //都是可以被复制的
    //预留三秒时间 等待连接并存储socket的信息，否则会出现回调问题   
    let t0 =setTimeout(()=>{
        if(isMaster){
            console.log("s0 is master");
        }else if(totalAlive >= 3) {
            //console.log(activeSocket);
            console.log("start checking ")
            for (let[key, value] of activeSocket){
                if(value.react === socket){
                    value.acti.emit('requestMaster');
                }
            }
        }
    }, 5000);
    // //send sql file to all Servers
    // if(isMaster){
    //     console.log("s0 is master");
    //     sendLocalSql();
    // }else if(totalAlive >= 3) {
    //     console.log("start checking ")
    //     // for (let[key, value] of activeSocket){
    //     //     if(value.acti === socket){
    //     //         value.acti.emit('requestMaster');
    //     //     }
    //     // }
    //     socketWithS1.emit('requestMaster');
    //     socketWithS2.emit('requestMaster');
    // }

    //Listen for request master
    socket.on('requestMaster', function(){
        socket.emit('responseMaster',master);
    });

    socket.on('requestElection', function (data){
        responseElection(socket,data);
    });

    socket.on('declareMaster',(data)=>{
        console.log("receive declare master from server"+data);
        master = data
        console.log("Master changed to "+master)
    })

    socket.on('sendSQL', function(data, filename){
        DB.applyMasterSQL(db, data, filename);
        console.log("Receive SQL file from master");
    });

    socket.on('disconnect', ()=>{
        totalAlive --;
        console.log("disconnect, remaining alive: ", totalAlive);
        let offServer;
        // delete off server info
        for (let[key, value] of activeSocket){
            if(value.react === socket){
                offServer = key;
                activeSocket.delete(key);
            }
        }

        if(offServer == master) {
            console.log("Master failed, start leader election");
            electionReponseNum = 0;
            for (let[key, value] of activeSocket){
                startElection(value.acti, id, key);
            }
        }
        
    });


    //recv SQL file
    // socketWithS1.on('sendSQL', function (data, filename) {
    //     renewDB(data, filename);
    // })
    //
    // socketWithS2.on('sendSQL', function (data, filename) {
    //     renewDB(data, filename);
    // })

});


//都可以被直接拷贝
function registerListener(sendSocket) {

    sendSocket.on('responseMaster', function(response){
        askMaster(response,sendSocket);
    });
    sendSocket.on('who', ()=>{
        sendSocket.emit('iam',id);
    })
    sendSocket.on('responseElection', async function(data){
        if(data===0){
            //0 is quit, I will quit the election
            quitElection=true;
            electionReponseNum++;
        }else if(data ==1){
            quitElection = false;
            electionReponseNum++;
        }else{
            //error should only be 1 or 0
            quitElection = false;
            console.log("election response error : "+data)
        }
        //console.log(totalAlive)
        console.log('electionReponseNum from s0 '+electionReponseNum)
        console.log("totalAlive from s0 "+totalAlive)
        if(electionReponseNum===(totalAlive-1)){
            if(!quitElection){
                //broadcast I am new leader!!!
                console.log(id+" am the leader now")
                master=id;
                isMaster=true;
                
                for (let[key, value] of activeSocket){
                   
                    DB.sendLocalSQL(db, value.acti);
                }
            }
        }
    });

    sendSocket.on('sendSQL', function(data, filename){
        DB.applyMasterSQL(db, data, filename);
        console.log("Receive SQL file from master");
    });
}

function askMaster(response, socket){
    console.log("recieve master response is"+response);
    // console.log("Master is "+ master);
    if(response == -1 && master == -1){
        numNoMaster ++;
        console.log("numMa" + numNoMaster, "min req" + minServerRequire)
        // more than half servers have no master
        if(numNoMaster>=minServerRequire){
            // start leader election
            numNoMaster = 0;
            console.log("start leader election");
            for (let[key, value] of activeSocket){
                if(value.acti === socket){
                    startElection(value.acti, id, key);
                }
            }
            // declareMaster=false;

        }
    }
    else if(response != -1){
        master = response;
        console.log("master changed to ",master);
    }
}

function startElection(socket, id, aimId){
    console.log("s"+id+" send election request to s"+aimId);
    //send my id & dbVersion
    let info={'id':id,'dbVersion':dbVersion}
    socket.emit('requestElection',info);
}

function responseElection(socket,data){
    console.log("s"+id+" responses election request to s"+data.id);
    let targetId=data.id;
    let targetDBVersion=data.dbVersion;

    if(dbVersion>targetDBVersion) {
        // 0 is quit: ask target quit
        socket.emit('responseElection', 0);
        console.log("Election response 0")
    }else if(dbVersion==targetDBVersion){
        if(id>targetId){
            // 0 is quit: ask target quit
            socket.emit('responseElection',0);
            console.log("Election response 0")

        }else{
            //1 is okay: allow target keep going election
            socket.emit('responseElection',1);
            console.log("Election response 1")

        }
    }else{
        //1 is okay: allow target keep going election
        socket.emit('responseElection',1);
        console.log("Election response 1")

    }
}