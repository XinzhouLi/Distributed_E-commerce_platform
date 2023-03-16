const DB = require('./asyDB')

let totalServer=3;

let minServerRequire=parseInt((totalServer/2));
// console.log(minServerRequire)


// // load balancer part:
// // port 5000: connect with load balancer
// const ioWithLoadBalancer = require('socket.io')(5111);
// ioWithLoadBalancer.on('connection', function (socket) {
//     console.log('Server 0: connected with Load Balancer:', socket.client.id);

//     socket.on('requestSingleItem', async function (data) {
//         let input = data
//         console.log('Server0: Send in Query')
//         let result = await DB.getInfoByID(input.tableName, input.idName, input.id)
//         socket.emit('responseSingleItemInfo', result)
//         console.log("Server0: Send back", result)
//     });

//     socket.on('requestAllCateInfo', async function (data) {
//         let input = data
//         console.log('Server0: Send in Query')
//         let result = await DB.getAllInfo(input.tableName)
//         socket.emit('responseAllCateInfo', result)
//         console.log("Server0: Send back", result)
//     });

//     socket.on('addOrder', async function (data) {
//         let input = data
//         console.log('Server0: Send in Query')
//         let result
//         try {
//             await DB.editItemQuantity(input.tableName, input.idName, input.id, input.quantityToBuy)
//             await DB.insertOrder(input.insertOrderData)
//             await DB.insertVersion()
//         } catch (e) {
//             result = JSON.stringify({status: 0, content: e.message})
//             socket.emit('responseUserOrderStatus', result)
//         }
//         result = JSON.stringify({status: 1, content: "Order successfully placed"})
//         socket.emit('responseUserOrderStatus', result)

//         console.log("Server0: Send back", result)
//     });

// });

// Multiple server communication:
//parameters for election
let needElection=false;
let electionReponseNum=0;
let quitElection=false;
let declareMaster=false;
let totalAlive=0;
let id =2;
let dbVersion=1;
let isMaster = false;
let master = -1;
//initialize data
let numNoMaster =0;
//initialize data
let doneRequestWithTarget=[false,false,false,false,false];
let doneDeclareMasterWithTarget=[false,false,false,false,false];


// connect with other servers




//connect with Server 0

// make connection with Server 0: port 5020
var ioWithServer0 = require('socket.io-client');
var socketWithS0 = ioWithServer0.connect("http://localhost:5020/", {
    reconnection: true
});
socketWithS0.on('connect', async function(){
    let aimId=0;
    console.log('Server'+id+' connected with Server'+aimId);
    totalAlive++;
    console.log("Server "+id+" connected to "+totalAlive+" servers")

    if(isMaster){
        console.log("Server"+id+" is master")
        //send sql
    }else{
        console.log("Server"+id+" don't know master, he ask with Server"+aimId);
        // first leader election
        socketWithS0.emit('requestMaster'); 
        socketWithS0.on('responseMaster', function(data){
            if(data == -1 && master == -1){
                console.log("Server"+aimId+"also don't know master and send -1 to server"+id);
                numNoMaster ++;
                // more than half servers have no master
                if(numNoMaster>minServerRequire){
                    console.log("More than "+minServerRequire+" servers don't know master, Server"+id+" start the election");
                    // start leader election
                    numNoMaster = 0;
                    doneRequestWithTarget[aimId]=false;
                    doneDeclareMasterWithTarget[aimId]=false;
                    quitElection=false;
                    needElection=true;
                }
            }
            else if(data != -1){
                console.log("Server"+aimId+"know master is server"+data+" and send "+data+" to server"+id);
                master = data;
            }
        });
    }

    socketWithS0.on('requestMaster', function(){
        console.log("Server"+id+"is asked who is server, he answered "+master);
        socketWithS0.emit('responseMaster',master);
    });

    

    socketWithS0.on('requestElection', function (data){
        //console.log("Server"+id+" recieve election request from Server"+data)
        let targetId=data.id;
        let targetDBVersion=data.dbVersion;
        if(dbVersion>targetDBVersion){
            // 0 is quit: ask target quit
            console.log("Server"+id+" recieve election request from Server"+data.id+" and it send 0")
            socketWithS0.emit('responseElection',0);
        }else if(dbVersion==targetDBVersion){
            if(id>targetId){
                // 0 is quit: ask target quit
                console.log("Server"+id+" recieve election request from Server"+data.id+" and it send 0")
                socketWithS0.emit('responseElection',0);
            }else{
                //1 is okay: allow target keep going election
                console.log("Server"+id+" recieve election request from Server"+data.id+" and it send 1")
                socketWithS0.emit('responseElection',1);
            }
        }else{
            //1 is okay: allow target keep going election
            console.log("Server"+id+" recieve election request from Server"+data.id+" and it send 1")
            socketWithS0.emit('responseElection',1);
        }
    });
    
    socketWithS0.on('declareMaster', function (data){
        console.log("Server "+id+" hear Server"+data+" delcared that "+data+" is the new master");
        //record master id
        // socketWithS0.off('responseElection');
        master=data;
        console.log("Now master is server "+master);
        needElection=false;
    });

    socketWithS0.on('disconnect', function(){
        console.log("Server "+aimId+" disconnect with Server"+id);
        socketWithS0.disconnect();
        totalAlive--;
        console.log("Server "+id+" connected to "+totalAlive+" servers")
        // inform other active servers to record server state
        if(master == aimId){
            //start leader election
            console.log("failling Server "+aimId+" is master, Server"+id+" decide to start leader election");
                doneRequestWithTarget[aimId]=false;
                quitElection=false;
                needElection=true;
                declareMaster=false;
                doneDeclareMasterWithTarget[aimId]=false;
        }
    })

    function startElectionWithS0(){
        if(needElection && !doneRequestWithTarget[aimId]){
            console.log("Server "+id+" start election");
            doneRequestWithTarget[aimId]=true;
            //send my id & 
            let info={'id':id,'dbVersion':dbVersion}
            socketWithS0.emit('requestElection',info);
            socketWithS0.on('responseElection', function(data){
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
                    console.log("No quit, Server "+id+" will become a master");
                    declareMaster=true;
                }else{
                    console.log("Server "+id+" quit election");
                }
               }
            });
        }
    }
    function declareMasterWithS0(){
        if(declareMaster&& !doneDeclareMasterWithTarget[aimId]){
            console.log("Server "+id+" declare master with Server"+aimId+" and closed StartElectionWithS"+aimId);
            socketWithS0.emit('declareMaster',id);
            doneDeclareMasterWithTarget[aimId]=true;
            // socketWithS0.off('responseElection');
            isMaster=true;
        }
    }

    // keep check if need to do master election 
    setInterval(startElectionWithS0,1000/5);
    // keep check if need to do master declare
    setInterval(declareMasterWithS0,1000/5);
});




//connect with Server 1

// make connection with Server 1: port 5120
var ioWithServer1 = require('socket.io-client');
var socketWithS1 = ioWithServer1.connect("http://localhost:5120/", {
    reconnection: true
});
socketWithS1.on('connect', async function(){
    let aimId=1;
    console.log('Server'+id+' connected with Server'+aimId);
    totalAlive++;
    console.log("Server "+id+" connected to "+totalAlive+" servers")

    if(isMaster){
        console.log("Server"+id+" is master")
        //send sql
    }else{
        console.log("Server"+id+" don't know master, he ask with Server"+aimId);
        // first leader election
        socketWithS1.emit('requestMaster'); 
        socketWithS1.on('responseMaster', function(data){
            if(data == -1 && master == -1){
                console.log("Server"+aimId+"also don't know master and send -1 to server"+id);
                numNoMaster ++;
                // more than half servers have no master
                if(numNoMaster>minServerRequire){
                    console.log("More than "+minServerRequire+" servers don't know master, Server"+id+" start the election");
                    // start leader election
                    numNoMaster = 0;
                    doneRequestWithTarget[aimId]=false;
                    doneDeclareMasterWithTarget[aimId]=false;
                    quitElection=false;
                    needElection=true;
                }
            }
            else if(data != -1){
                console.log("Server"+aimId+"know master is server"+data+" and send "+data+" to server"+id);
                master = data;
            }
        });
    }

    socketWithS1.on('requestMaster', function(){
        console.log("Server"+id+"is asked who is server, he answered "+master);
        socketWithS1.emit('responseMaster',master);
    });

    

    socketWithS1.on('requestElection', function (data){
        //console.log("Server"+id+" recieve election request from Server"+data)
        let targetId=data.id;
        let targetDBVersion=data.dbVersion;
        if(dbVersion>targetDBVersion){
            // 0 is quit: ask target quit
            console.log("Server"+id+" recieve election request from Server"+data.id+" and it send 0")
            socketWithS1.emit('responseElection',0);
        }else if(dbVersion==targetDBVersion){
            if(id>targetId){
                // 0 is quit: ask target quit
                console.log("Server"+id+" recieve election request from Server"+data.id+" and it send 0")
                socketWithS1.emit('responseElection',0);
            }else{
                //1 is okay: allow target keep going election
                console.log("Server"+id+" recieve election request from Server"+data.id+" and it send 1")
                socketWithS1.emit('responseElection',1);
            }
        }else{
            //1 is okay: allow target keep going election
            console.log("Server"+id+" recieve election request from Server"+data.id+" and it send 1")
            socketWithS1.emit('responseElection',1);
        }
    });
    
    socketWithS1.on('declareMaster', function (data){
        console.log("Server "+id+" hear Server"+data+" delcared that "+data+" is the new master");
        //record master id
        // socketWithS1.off('responseElection');
        master=data;
        console.log("Now master is server "+master);
        needElection=false;
    });

    socketWithS1.on('disconnect', function(){
        console.log("Server "+aimId+" disconnect with Server"+id);
        socketWithS1.disconnect();
        totalAlive--;
        console.log("Server "+id+" connected to "+totalAlive+" servers")
        // inform other active servers to record server state
        if(master == aimId){
            //start leader election
            console.log("failling Server "+aimId+" is master, Server"+id+" decide to start leader election");
                doneRequestWithTarget[aimId]=false;
                quitElection=false;
                needElection=true;
                declareMaster=false;
                doneDeclareMasterWithTarget[aimId]=false;
        }
    })

    function startElectionWithS1(){
        if(needElection && !doneRequestWithTarget[aimId]){
            console.log("Server "+id+" start election");
            doneRequestWithTarget[aimId]=true;
            //send my id & 
            let info={'id':id,'dbVersion':dbVersion}
            socketWithS1.emit('requestElection',info);
            socketWithS1.on('responseElection', function(data){
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
                    console.log("No quit, Server "+id+" will become a master");
                    declareMaster=true;
                }else{
                    console.log("Server "+id+" quit election");
                }
               }
            });
        }
    }
    function declareMasterWithS1(){
        if(declareMaster&& !doneDeclareMasterWithTarget[aimId]){
            console.log("Server "+id+" declare master with Server"+aimId);
            socketWithS1.emit('declareMaster',id);
            doneDeclareMasterWithTarget[aimId]=true;
            // socketWithS1.off('responseElection');
            console.log("Server "+id+"closed StartElectionWithS"+aimId);
            isMaster=true;
        }
    }

    // keep check if need to do master election 
    setInterval(startElectionWithS1,1000/5);
    // keep check if need to do master declare
    setInterval(declareMasterWithS1,1000/5);
});