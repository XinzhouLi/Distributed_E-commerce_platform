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

const ioWithLoadBalancer = require('socket.io')(5200);
ioWithLoadBalancer.on('connection', function (socket) {
    console.log('Server 1: connected with Load Balancer:', socket.client.id);

    socket.on('requestSingleItem', async function (data) {
        let input = data
        console.log('Server1: Send in Query')
        let result = await DB.getInfoByID(input.tableName, input.idName, input.id)
        socket.emit('responseSingleItemInfo', result)
        console.log("Server1: Send back", result)
    });

    socket.on('requestAllCateInfo', async function (data) {
        // let input = data
        let input = data
        console.log('Server1: Send in Query')
        let result = await DB.getAllInfo(input.tableName)
        socket.emit('responseAllCateInfo', result)
        console.log("Server1: Send back", result)
    });

    socket.on('addOrder', async function (data) {
        let input = data
        console.log('Server1: Send in Query')
        let result
        try {
            await DB.editItemQuantity(input.tableName, input.idName, input.id, input.quantityToBuy)
            await DB.insertOrder(input.insertOrderData)
            await DB.insertVersion()
        } catch (e) {
            result = JSON.stringify({status: 0, content: e.message})
            socket.emit('responseUserOrderStatus', result)
        }
        result = JSON.stringify({status: 1, content: "Order successfully placed"})
        socket.emit('responseUserOrderStatus', result)

        console.log("Server1: Send back", result)
    });

});

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
ioS1.on('connect', async function(socket){
    totalAlive ++;
    console.log("Current alive: ", totalAlive);
    socket.join("serverRoom");
    socket.emit('who')

    socket.on('iam', (data)=>{
        console.log(id, "connected with "+data)
        activeSocket.set(data, {react :socket,  acti: data === 0 ? socketWithS0 : socketWithS2})

    })

    if(isMaster){
        console.log("S1 SQL file sent to slave");
        await DB.sendLocalSQL(db, socket);
    }


    //都是可以被复制的
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
 

    //Listen for request master
    socket.on('requestMaster', function(){
        socket.emit('responseMaster',master);
    });

    socket.on('requestElection', function (data){
        responseElection(socket,data);
    });

    socket.on('declareMaster',(data)=>{
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
            quitElection = false;
            //error should only be 1 or 0
            console.log("election response error : "+data)
        }
        console.log('electionReponseNum from s1 '+electionReponseNum)
        console.log("totalAlive from s1 "+totalAlive)
        if(electionReponseNum===(totalAlive-1)){
                if(!quitElection){
                //broadcast I am new leader!!!
                console.log(id+" am the leader now")
                master=id;
                isMaster=true;
                for (let[key, value] of activeSocket){
                    value.acti.emit("declareMaster",id)
                    
                    
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

function askMaster(response,socket){
    console.log("recieve master response"+response);
    console.log("Master is "+ master);

    if(response == -1 && master == -1){
        numNoMaster ++;
        // more than half servers have no master
        console.log("numMa " + numNoMaster, "min req " + minServerRequire)
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
    }
}

function startElection(socket, id, aimId){
    console.log("s"+id+" send election request to s "+aimId);
    //send my id & dbVersion
    let info={'id':id,'dbVersion':dbVersion}
    socket.emit('requestElection',info);
}

function responseElection(socket,data){
    console.log("s"+id+"responses election request to s"+data.id);
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