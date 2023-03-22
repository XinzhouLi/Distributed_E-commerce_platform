const DB = require('./asyDB')

let totalServer=3;

let minServerRequire=parseInt((totalServer/2));

// Multiple server communication:
//parameters for election
let quitElection = false;
let needElection=false;
let electionReponseNum=0;
let totalAlive=1;
let id =2;
let dbVersion=1;
let isMaster = false;
let master = -1;

let numNoMaster =0;
let activeSocket = new Map();
let db = "db2.db";



//init variables for consistency
let localAvailable = true;
let globalAvailable = true;
let whoHold = -1;
const waitingList = [];
let ifSendToken=true;

const ioWithLoadBalancer = require('socket.io')(5300);
ioWithLoadBalancer.on('connection', function (socket) {
    console.log('Server 2: connected with Load Balancer:', socket.client.id);

    socket.on('requestSingleItem', async function (data) {
        let input = data
        console.log('Server2: Send in Query')
        let result = await DB.getInfoByID(input.tableName, input.idName, input.id)
        socket.emit('responseSingleItemInfo', result)
        console.log("Server2: Send back", result)
    });

    socket.on('requestAllCateInfo', async function (data) {
        let input = data
        console.log('Server2: Send in Query')
        let result = await DB.getAllInfo(input.tableName)
        socket.emit('responseAllCateInfo', result)
        console.log("Server2: Send back", result)
    });

    socket.on('addOrder', async function (data) {
        let input = data
        console.log('Server2: Send in Query')
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

        console.log("Server2: Send back", result)
    });

});

// make connection with Server 1: port 6000
let activeIo = require('socket.io-client');
let socketWithS0 = activeIo.connect("http://localhost:5100/", {
    reconnection: true
});
registerListener(socketWithS0)

let socketWithS1 = activeIo.connect("http://localhost:6100/", {
    reconnection: true
});
registerListener(socketWithS1);

const ioS2 = require('socket.io')(7100);
ioS2.on('connect', async function(socket){
    totalAlive ++;
    console.log("Current alive: ", totalAlive);
    socket.join("serverRoom");
    socket.emit('who')
    socket.on('iam', (data)=>{
        console.log(id, "connected with "+ data)
        activeSocket.set(data, {react :socket,  acti: data === 0 ? socketWithS0 : socketWithS1});
        //console.log(activeSocket);
    })
    if(isMaster){
        console.log("S1 SQL file sent to slave");
        await DB.sendLocalSQL(db, socket);
    }

    //都是可以被复制的
    let t0 =setTimeout(()=>{
        if(isMaster){
            console.log("s2 is master");
        }else if(totalAlive >= 3) {
            //console.log(activeSocket);
            console.log("start checking ")
            for (let[key, value] of activeSocket){
                if(value.react === socket){
                    value.acti.emit('requestMaster');
                }
            }
        }



        if (whoHold == -1){
            for(let[key, value] of activeSocket){
                if (value.react === socket){
                    value.acti.emit("requestTokenInfo")
                    console.log(id + " request current token info")
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
        master = data;
        quitElection = false;
        console.log("Master changed to "+master)
    })

    socket.on('sendSQL', function(data, filename){
        DB.applyMasterSQL(db, data, filename);
        console.log("Receive SQL file from master");
    });


    socket.on('setToken', (data)=>{
        whoHold = data;
        console.log(id + " has the token now")
    })


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


        // if(offServer == master) {
        //
        //     console.log("Master failed, start leader election");
        //     electionReponseNum = 0;
        //     for (let[key, value] of activeSocket){
        //         startElection(value.acti, id, key);
        //     }
        // }

        if(offServer == master) {
            if(offServer == whoHold) {
                console.log("Master failed, start leader election");
                electionReponseNum = 0;
                for (let[key, value] of activeSocket){
                    startElection(value.acti, id, key);
                }
            }else {
                ifSendToken = false;
                console.log("Master failed, start leader election");
                electionReponseNum = 0;
                for (let [key, value] of activeSocket) {
                    startElection(value.acti, id, key);
                }
            }
        }else{
            if(offServer == whoHold){
                whoHold = master;
                globalAvailable = true
            }else{
                //do nothing
            }
        }
    });


    socket.on("requestTokenInfo", ()=>{
        socket.emit("responseTokenInfo",whoHold, globalAvailable)
        console.log("Token Info has been sent out")
    })

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
        }else if(data ==1 && quitElection != true){
            quitElection = false;
            electionReponseNum++;
        }else{
            //error should only be 1 or 0
            quitElection = false;
            console.log("election response error : "+data)
        }
        //console.log(totalAlive)
        console.log('electionReponseNum from s'+id+" "+electionReponseNum)
        console.log("totalAlive from s"+id+" "+totalAlive)
        if(electionReponseNum===(totalAlive-1)){
            if(!quitElection){
                //broadcast I am new leader!!!
                console.log(id+" am the leader now")
                master=id;
                isMaster=true;

                for (let[key, value] of activeSocket){
                    value.acti.emit("declareMaster",id)
                    if (ifSendToken){
                        value.acti.emit("setToken", id)
                        whoHold = id
                        globalAvailable = true
                        localAvailable = true
                    }
                    ifSendToken=true;
                    await DB.sendLocalSQL(db, value.acti);
                }
            }
        }
    });

    sendSocket.on('sendSQL', function(data, filename){
        DB.applyMasterSQL(db, data, filename);
        console.log("Receive SQL file from master");
    });

    sendSocket.on("responseTokenInfo",(data1, data2)=>{
        if(data1 != -1){
            whoHold = data1
            globalAvailable = data2
            console.log("Who hold: "+data1 + " status: "+ data2)
        }

    })

}






function sendLocalSql(){
    // console.log(ioS0.sockets.in("serverRoom"));
    ioS0.sockets.in("serverRoom").emit('hello',1);
}

function askMaster(response, socket){
    if(response == -1 && master == -1){
        numNoMaster ++;
        console.log("numMa" + numNoMaster, "min req" + minServerRequire)
        // more than half servers have no master
        if(numNoMaster>minServerRequire){
            // start leader election
            numNoMaster = 0;
            console.log("start leader election");
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