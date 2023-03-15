// const DB = require('./asyDB')

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
let doneRequestMaster = [false, false, false];

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

    //都是可以被复制的
    let t0 =setTimeout(()=>{
        if(isMaster){
            console.log("s2 is master");
            sendLocalSql();
        }else if(totalAlive >= 3) {
            //console.log(activeSocket);
            console.log("start checking ")
            for (let[key, value] of activeSocket){
                if(value.react === socket){
                    value.acti.emit('requestMaster');
                }
            }
        }
    }, 3000);
    //send sql file to all Servers
    // if(isMaster){
    //     console.log("s0 is master");
    //     sendLocalSql();
    // }else if(totalAlive >= 3) {
    //     console.log("start checking ")
    //     for (let[key, value] of activeSocket){
    //         if(value.acti === socket){
    //             value.acti.emit('requestMaster');
    //         }
    //     }

    //     // if(!doneRequestMaster[0]){
    //     //     doneRequestMaster[0]=true;
    //     //     socketWithS0.emit('requestMaster');
    //     // }
    //     // if(!doneRequestMaster[1]){
    //     //     doneRequestMaster[1]=true;
    //     //     socketWithS1.emit('requestMaster');
    //     // }


    //     // socketWithS0.emit('requestMaster');
    //     // socketWithS1.emit('requestMaster');
    // }

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
        askMaster(response);
    });
    sendSocket.on('who', ()=>{
        sendSocket.emit('iam',id);
    })
    sendSocket.on('responseElection', function(data){
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
        console.log('electionReponseNum from s2 '+electionReponseNum)
        console.log("totalAlive from s2 "+totalAlive)
        if(electionReponseNum===(totalAlive - 1)){
            if(!quitElection){
                //broadcast I am new leader!!!
                console.log(id+" am the leader now")

                for (let[key, value] of activeSocket){
                    value.acti.emit("declareMaster",id)
                }
            }
        }
    });
}


// //recv SQL file
// socketWithS1.on('sendSQL', function (data, filename) {
//     renewDB(data, filename);
// })

// socketWithS2.on('sendSQL', function (data, filename) {
//     renewDB(data, filename);
// })



function sendLocalSql(){
    // console.log(ioS0.sockets.in("serverRoom"));
    ioS0.sockets.in("serverRoom").emit('hello',1);
}

function askMaster(response){
    if(response == -1 && master == -1){
        numNoMaster ++;
        console.log("numMa" + numNoMaster, "min req" + minServerRequire)
        // more than half servers have no master
        if(numNoMaster>=minServerRequire){
            // start leader election
            numNoMaster = 0;
            console.log("start leader election");
            for (let[key, value] of activeSocket){
                startElection(value.acti, id, key);
            }
            // declareMaster=false;

        }
    }
    else if(response != -1){
        master = response;
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