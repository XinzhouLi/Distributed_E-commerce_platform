const sender = require("socket.io-client");

let myId = "s1"
// record all the connected server
let socket_record = new Map();

let senderToS0 = sender.connect("http://localhost:5000/", {
    reconnection: true
});
let senderToS1 = sender.connect("http://localhost:5010/", {
    reconnection: true
});
let senderToS2 = sender.connect("http://localhost:5020/", {
    reconnection: true
});


let receiver = require('socket.io')(5010);
receiver.on("connect",(socket)=>{
    socket.join("broadCast")

    // 注册接入的socket
    socket.on("who",(data)=>{
        console.log(data+" connected with id "+socket.id)
        socket_record.set(socket.id, {sName: data, sender:
                data === "s0" ? senderToS0 :
                    data === "s1" ? senderToS1 :
                        data === "s2" ? senderToS1 :
                            null
        })

    })

    // 解注册某一个socket
    socket.on("disconnect", (data)=>{
        console.log(data+" connected with id "+socket.id)
        socket_record.delete(socket.id)
    })

})

let sender_record = [senderToS0,senderToS1,senderToS2]
// Sender listener 注册
function registerListener(senderSocket) {
    senderSocket.on("connect", (data)=>{
        senderSocket.emit("who", myId)
    })
}








setInterval(()=>{
    console.log(socket_record)
    // console.log()
},5000)



function f(socket) {
    socket.emit("id", socket.id)
}