

let ser = require('socket.io')(3011);
let socket_array = new Array()
ser.on("connect",(socket)=>{
    console.log(socket.id)
    // ser.emit("id", socket.id)
    f(socket)

    socket.on("who",(d)=>{
        console.log(d)
        socket_array.push({ d : socket.id})
    })
    socket.on("reps",(data)=>{
        console.log("jjjj")
        console.log(data)
    })
    socket.on("disconnect",()=>{
        console.log("/"+socket.id)
    })
})

setInterval(()=>{
    console.log(socket_array)
},1000)



function f(socket) {
    socket.emit("id", socket.id)
}