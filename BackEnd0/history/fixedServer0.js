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
let id =0;
let dbVersion=1;
let isMaster = false;
let master = -1;
//initialize data
let numNoMaster =0;
//initialize data
let doneRequestWithTarget=[false,false,false,false,false];
let doneDeclareMasterWithTarget=[false,false,false,false,false];


// connect with other servers

//port 5010 connects with server 1
const ioWithServer1 = require('socket.io')(5010);
ioWithServer1.on('connection', async function (socket) {
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
        socket.emit('requestMaster'); 
        socket.on('responseMaster', function(data){
            if(data == -1 && master == -1){
                console.log("Server"+aimId+"also don't know master and send -1 to server"+aimId);
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

    socket.on('requestMaster', function(){
        console.log("Server"+id+"is asked who is server, he answered "+master);
        socket.emit('responseMaster',master);
    });

    

    socket.on('requestElection', function (data){
        //console.log("Server"+id+" recieve election request from Server"+data)
        let targetId=data.id;
        let targetDBVersion=data.dbVersion;
        if(dbVersion>targetDBVersion){
            // 0 is quit: ask target quit
            console.log("Server"+id+" recieve election request from Server"+data.id+" and it send 0")
            socket.emit('responseElection',0);
        }else if(dbVersion==targetDBVersion){
            if(id>targetId){
                // 0 is quit: ask target quit
                console.log("Server"+id+" recieve election request from Server"+data.id+" and it send 0")
                socket.emit('responseElection',0);
            }else{
                //1 is okay: allow target keep going election
                console.log("Server"+id+" recieve election request from Server"+data.id+" and it send 1")
                socket.emit('responseElection',1);
            }
        }else{
            //1 is okay: allow target keep going election
            console.log("Server"+id+" recieve election request from Server"+data.id+" and it send 1")
            socket.emit('responseElection',1);
        }
    });
    
    socket.on('declareMaster', function (data){
        console.log("Server "+id+" hear Server"+data+" delcared that "+data+" is the new master");
        //record master id
        // socket.off('responseElection');
        master=data;
        needElection=false;
        console.log("Now master is server "+master);
    });

    socket.on('disconnect', function(){
        console.log("Server "+aimId+" disconnect with Server"+id);
        socket.disconnect();
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
            console.log("Server "+id+" declare master with Server"+aimId+" and closed StartElectionWithS"+aimId);
            socket.emit('declareMaster',id);
            doneDeclareMasterWithTarget[aimId]=true;
            // socket.off('responseElection');
            isMaster=true;
        }
    }

    // keep check if need to do master election 
    setInterval(startElectionWithS1,1000/5);
    // keep check if need to do master declare
    setInterval(declareMasterWithS1,1000/5);

});


//port 5020 connects with server 2
const ioWithServer2 = require('socket.io')(5020);
ioWithServer2.on('connection', async function (socket) {
    let aimId=2;
    console.log('Server'+id+' connected with Server'+aimId);
    totalAlive++;
    console.log("Server "+id+" connected to "+totalAlive+" servers")

    if(isMaster){
        console.log("Server"+id+" is master")
        //send sql
    }else{
        console.log("Server"+id+" don't know master, he ask with Server"+aimId);
        // first leader election
        socket.emit('requestMaster'); 
        socket.on('responseMaster', function(data){
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

    socket.on('requestMaster', function(){
        console.log("Server"+id+"is asked who is server, he answered "+master);
        socket.emit('responseMaster',master);
    });

    socket.on('requestElection', function (data){
        //console.log("Server"+id+" recieve election request from Server"+data)
        let targetId=data.id;
        let targetDBVersion=data.dbVersion;
        if(dbVersion>targetDBVersion){
            // 0 is quit: ask target quit
            console.log("Server"+id+" recieve election request from Server"+data.id+" and it send 0")
            socket.emit('responseElection',0);
        }else if(dbVersion==targetDBVersion){
            if(id>targetId){
                // 0 is quit: ask target quit
                console.log("Server"+id+" recieve election request from Server"+data.id+" and it send 0")
                socket.emit('responseElection',0);
            }else{
                //1 is okay: allow target keep going election
                console.log("Server"+id+" recieve election request from Server"+data.id+" and it send 1")
                socket.emit('responseElection',1);
            }
        }else{
            //1 is okay: allow target keep going election
            console.log("Server"+id+" recieve election request from Server"+data.id+" and it send 1")
            socket.emit('responseElection',1);
        }
    });
    
    socket.on('declareMaster', function (data){
        console.log("Server "+id+" hear Server"+data+" delcared that "+data+" is the new master");
        //record master id
        // socket.off('responseElection');
        master=data;
        needElection=false;
        console.log("Now master is server "+master);
    });

    socket.on('disconnect', function(){
        console.log("Server "+aimId+" disconnect with Server"+id);
        socket.disconnect();
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

    function startElectionWithS2(){
        if(needElection && !doneRequestWithTarget[aimId]){
            console.log("Server "+id+" start election");
            doneRequestWithTarget[aimId]=true;
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
                    console.log("No quit, Server "+id+" will become a master");
                    declareMaster=true;
                }else{
                    console.log("Server "+id+" quit election");
                }
               }
            });
        }
    }
    function declareMasterWithS2(){
        if(declareMaster&& !doneDeclareMasterWithTarget[aimId]){
            console.log("Server "+id+" declare master with Server"+aimId+" and closed StartElectionWithS"+aimId);
            socket.emit('declareMaster',id);
            doneDeclareMasterWithTarget[aimId]=true;
            // socket.off('responseElection');
            isMaster=true;
        }
    }

    // keep check if need to do master election 
    setInterval(startElectionWithS2,1000/5);
    // keep check if need to do master declare
    setInterval(declareMasterWithS2,1000/5);
});


