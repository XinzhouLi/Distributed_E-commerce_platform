const sender = require("socket.io-client");

let myId = "s1"
// record all the connected server
let socket_record = new Map();


let senderToS2 = sender.connect("http://localhost:5020/", {
    reconnection: true
});


senderToS2.on("connect", ()=>{
    senderToS2.emit("www",1)
    senderToS2.emit("www",2)
})

