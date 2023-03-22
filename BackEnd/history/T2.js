const sender = require("socket.io-client");


let receiver = require('socket.io')(5020);
receiver.on("connect",(socket)=>{
    socket.on("www", (data)=>{

        let a = setTimeout(()=>{
            console.log(data)
        },2000)
    })

})


