const sender = require("socket.io-client");



let sen = sender.connect("http://localhost:3011/", {
    reconnection: true
});
sen.on("connect", (data)=>{
    sen.emit("who","T3")
})


sen.on("what",(data)=>{
    // console.log(sen)
    console.log(data)
})

sen.on("id", (data)=>{
    console.log("id: "+data)
})