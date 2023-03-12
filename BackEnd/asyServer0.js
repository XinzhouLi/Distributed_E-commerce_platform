const DB = require('./asyDB')

let totalServer=5;

let minServerRequire=parseInt((totalServer/2));
// console.log(minServerRequire)


// load balancer part:
// port 5100: connect with load balancer
const ioWithLoadBalancer = require('socket.io')(5100);
ioWithLoadBalancer.on('connection', function (socket) {
    console.log('Server 0: connected with Load Balancer:', socket.client.id);

    socket.on('requestSingleItem', async function (data) {
        let input = JSON.parse(data)
        console.log('Server1: Send in Query')
        let result = await DB.getInfoByID(input.tableName, input.idName, input.id)
        socket.emit('responseSingleItemInfo', result)
        console.log("Server1: Send back", result)
    });

    socket.on('requestAllCateInfo', async function (data) {
        let input = JSON.parse(data)
        console.log('Server1: Send in Query')
        let result = await DB.getAllInfo(input.tableName)
        socket.emit('responseAllCateInfo', result)
        console.log("Server1: Send back", result)
    });

    socket.on('addOrder', async function (data) {
        let input = JSON.parse(data)
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



// 
// Multiple server communication:
//parameters for election
let needElection=false;
let electionReponseNum=0;
let quitElection=false;
let declareMaster=false;
let totalAlive=0;
let id =0;
let dbVersion=1;
let isMaster = false;
let master = -1;
//initialize data
let doneRequestWithTarget=[false,false,false,false,false];
let doneDeclareMasterWithTarget=[false,false,false,false,false];



//port 5120 connects with server 1
const ioWithServer1 = require('socket.io')(5120);
ioWithServer1.on('connection', async function (socket) {
    let aimId=1;
    totalAlive++;
    // if i am master
    //send sql file to this Server
    if(isMaster){
        sendLocalSql(socket);
    }
    //recv SQL file
    socket.on('sendSQL', function (data, filename) {
        renewDB(data, filename);
    })

    //First connect to server send initial request & listen initial response
    socket.emit('requestMaster'); 
    socket.on('responseMaster', function(data){
        askMaster(data,aimId);
    });

    //Listen for request master 
    socket.on('requestMaster', function(){
        socket.emit('responseMaster',master);
    });

    socket.on('requestElection', function (data){
        responseElection(socket,data);
    });

    socket.on('delclareMaster', function (data){
        recieveDelcareMaster(socket, data)

    });

    socket.on('disconnect', function(){
        disconnect(socket, aimId);
    });
    // keep check if need to do master election 
    setInterval(startElection(socket,aimId),1000/2);
    // keep check if need to do master declare
    setInterval(sendDeclareMaster(socket,aimId),1000/50);
});

function askMaster(data, aimId){
    if(data == -1 && master == -1){
        numNoMaster ++;
        // more than half servers have no master
        if(numNoMaster>minServerRequire){
            // start leader election
            numNoMaster = 0;
            console.log("start leader election");
            doneRequestWithTarget[aimId]=false;
            doneDeclareMasterWithTarget[aimId]=false;
            quitElection=false;
            needElection=true;
            declareMaster=false;
        }
    }
    else if(data != -1){
        master = data;
    }
}
function startElection(socket,aimId){
    if(needElection && ! doneRequestWithTarget[aimId]){
        console.log("start election");
        doneRequestWithTarget[aimId]=true;
        //send my id & dbVersion
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

function sendDeclareMaster(socket,aimId){
    if(declareMaster&& !doneDeclareMasterWithTarget[aimId]){
        doneDeclareMasterWithTarget[aimId]=true;
        socket.emit('declareMaster',id);
        socket.off('responseElection');
        isMaster=true;
        sendLocalSql(socket);
    }
}

function responseElection(socket,data){
    console.log("I recieve election request from: "+data)
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

function recieveDelcareMaster(socket,data){
    //record master id
    socket.off('responseElection');
    master=data;
    needElection=false;
}

function disconnect(socket, aimId){
    socket.disconnect();
    totalAlive--;
    // inform other active servers to record server state
    if(master == aimId){
        //start leader election
        console.log("start leader election");
            doneRequestWithTarget[aimId]=false;
            doneDeclareMasterWithTarget[aimId]=false;
            quitElection=false;
            needElection=true;
            declareMaster=false; 
    }
}


function sendLocalSql(socket){

}


