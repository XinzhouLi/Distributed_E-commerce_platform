var sqlite3 = require("sqlite3");
var express= require("express");
let path=require("path");

var app=express();
app.use(express.json());

// create item table
app.get("/create_itemTable",(req,res)=>{
  var db = new sqlite3.Database('./db/master.db',(err,data)=>{
    let ans={stat:"",content:""}
      if(!err){
          db.run('CREATE TABLE IF NOT EXISTS items(id  integer primary key autoincrement,itemId integer,itemName text, number integer)',(err)=>{
              if(!err){
                      console.log('table is created sucessfully!')
                      db.run('INSERT INTO items(itemId,itemName ,number) values("000","test","0")',(err)=>{
                        if(!err){
                            ans['stat']=1;
                            ans['content']='Data add successfully!';
                            return res.send(JSON.stringify(ans))
                            }
                        else{
                            ans['stat']=0;
                            ans['content']='Error!';
                            console.log(err);
                            return res.send(JSON.stringify(ans))
                        }
                    })
              }
              else{
                  console.log(err.message)
              }
          })
      }
  })
})

// create order table
app.get("/create_orderTable",(req,res)=>{
  var db = new sqlite3.Database('./db/master.db',(err,data)=>{
    let ans={stat:"",content:""}
      if(!err){
        console.log("1111")
        // db.run('CREATE TABLE IF NOT EXISTS items(id  integer primary key autoincrement,itemId integer,itemName text, number integer)',(err)=>{
          // db.run('CREATE TABLE IF NOT EXISTS order(id integer primary key autoincrement, orderId text, customerName text, customerAddress text, cardNumber text, itemName text)',(err)=>{
            db.run('CREATE TABLE IF NOT EXISTS orderInfo(id  integer primary key autoincrement, orderId text, customerName text, customerAddress text, cardNumber text, itemName text)',(err)=>{
            console.log("2222")
              if(!err){
                      console.log('table is created sucessfully!')
                      db.run('INSERT INTO orderInfo(orderId, customerName,customerAddress, cardNumber, itemName) values("AAAA","Alex","188 harvest rose","4563888855742057","Table1")',(err)=>{
                        if(!err){
                            ans['stat']=1;
                            ans['content']='Data add successfully!';
                            return res.send(JSON.stringify(ans))
                            }
                        else{
                            ans['stat']=0;
                            ans['content']='Error!';
                            console.log(err);
                            return res.send(JSON.stringify(ans))
                        }
                    })
              }
              else{
                console.log("yes, error!")
                  console.log(err.message)
              }
          })
      }
  })
})


app.listen(5489,()=>{
  console.log("your server has been started..   ");
})