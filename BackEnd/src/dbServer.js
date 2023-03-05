var sqlite3 = require("sqlite3");
var express= require("express");
let path=require("path");

var app=express();
app.use(express.json());

// create chair table
app.get("/create_chairTable",(req,res)=>{
  var db = new sqlite3.Database('./db/master.db',(err,data)=>{
    let ans={stat:"",content:""}
      if(!err){
          db.run('CREATE TABLE IF NOT EXISTS chair(id  integer primary key autoincrement,chairId text,chairName text, quantity integer, description text, image text)',(err)=>{
              if(!err){
                      console.log('table is created sucessfully!')
                      db.run('INSERT INTO chair(chairId,chairName ,quantity, description, image) values("c01","chair5","99","This is a pretty chair","90sd90asda90sf8a0gas")',(err)=>{
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

// search all chair table
app.get("/search_all_chair",(req,res)=>{
    var db = new sqlite3.Database('./db/master.db',(err,data)=>{
      let ans={stat:"",content:""}
        if(!err){
            db.all('SELECT * FROM chair',(err, data)=>{
                if(!err){
                    console.log(typeof data)
                    console.log(data)
                      ans['stat']=1;
                      ans['content']=data;
                      return res.send(JSON.stringify(ans))
                }
                else{
                    ans['stat']=0;
                      ans['content']="sorry did not find chair info";
                    console.log(err.message)
                }
            })
        }
    })
  })

  // search chair table by id
app.get("/search_chair_byId",(req,res)=>{
    var chairId = req.body.chairId
    var db = new sqlite3.Database('./db/master.db',(err,data)=>{
      let ans={stat:"",content:""}
        if(!err){
            db.all('SELECT * FROM chair where chairId="' + chairId + '"',(err, data)=>{
                if(!err){
                    console.log(typeof data)
                    console.log(data)
                      ans['stat']=1;
                      ans['content']=data;
                      return res.send(JSON.stringify(ans))
                }
                else{
                    ans['stat']=0;
                      ans['content']="sorry did not find chair info by chairId";
                    console.log(err.message)
                }
            })
        }
    })
  })




// edit chair quantity
app.post("/change_chair_quantity", (req, res) => {
  var chairId = req.body.chairId
  var changeNum=req.body.changeNumber
  console.log("chairId: "+chairId+"    changeNumber: "+changeNum)
  let ans = { stat: "", content: "" }
  //  var correctInfo = false
  //print bubby
  console.log("decrease the number of "+chairId+" by "+changeNum)
  var db = new sqlite3.Database("./db/master.db", (err, data) => {
      if (!err) {
          // check if the username and password is correct
          db.all('SELECT quantity FROM chair where chairId="' + chairId + '"', (err, data) => {
            
               console.log(data)
              // console.log(typeof data[0])
              if (data.length == 1) {
                  console.log(data[0]['quantity'])
                  var quantity=data[0]['quantity']
                  let sql;
                  sql = 'UPDATE chair SET quantity = ? WHERE chairId = ?';
                  newQuantity=quantity-changeNum
                  // newQuantity=98
                  db.run(sql, [newQuantity, chairId], (err) => {
                      console.log("Reset quantity sucessfully")
                      if (!err) {
                          // correctInfo = true;
                          ans['stat'] = 1;
                          ans['content'] = 'You have changed the chair quantity successfully!';
                          // console.error(err.message);
                          return res.send(JSON.stringify(ans))
                      } else {
                          ans['stat'] = 0;
                          ans['content'] = 'You have entered the right chairId, but changing failed!';
                          return res.send(JSON.stringify(ans))
                      }
                  });
              }
              else {
                  ans['stat'] = 0;
                  ans['content'] = 'The ChairID is not unique';
                  return res.send(JSON.stringify(ans))
              }
          })
      }
  })
})











// create table table
app.get("/create_tableTable",(req,res)=>{
  var db = new sqlite3.Database('./db/master.db',(err,data)=>{
    let ans={stat:"",content:""}
      if(!err){
          db.run('CREATE TABLE IF NOT EXISTS tables(id  integer primary key autoincrement,tableId text,tableName text, quantity integer, description text, image text)',(err)=>{
              if(!err){
                      console.log('table is created sucessfully!')
                      db.run('INSERT INTO tables(tableId,tableName ,quantity, description, image) values("t02","table2","99","This is a pretty table","90sd90asda90sf8a0gas")',(err)=>{
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


// search all table table
app.get("/search_all_table",(req,res)=>{
    var db = new sqlite3.Database('./db/master.db',(err,data)=>{
      let ans={stat:"",content:""}
        if(!err){
            db.all('SELECT * FROM tables',(err, data)=>{
                if(!err){
                    console.log(typeof data)
                    console.log(data)
                      ans['stat']=1;
                      ans['content']=data;
                      return res.send(JSON.stringify(ans))
                }
                else{
                    ans['stat']=0;
                      ans['content']="sorry did not find table info";
                    console.log(err.message)
                }
            })
        }
    })
  })

  // search table table by id
app.get("/search_table_byId",(req,res)=>{
    var tableId = req.body.tableId
    var db = new sqlite3.Database('./db/master.db',(err,data)=>{
      let ans={stat:"",content:""}
        if(!err){
            db.all('SELECT * FROM tables where tableId="' + tableId + '"',(err, data)=>{
                if(!err){
                    console.log(typeof data)
                    console.log(data)
                      ans['stat']=1;
                      ans['content']=data;
                      return res.send(JSON.stringify(ans))
                }
                else{
                    ans['stat']=0;
                      ans['content']="sorry did not find table info by tableId";
                    console.log(err.message)
                }
            })
        }
    })
  })


//edit table quantity
app.post("/change_table_quantity", (req, res) => {
  var tableId = req.body.tableId
  var changeNum=req.body.changeNumber
  console.log("tableId: "+tableId+"    changeNumber: "+changeNum)
  let ans = { stat: "", content: "" }
  //  var correctInfo = false
  //print bubby
  console.log("decrease the number of "+tableId+" by "+changeNum)
  var db = new sqlite3.Database("./db/master.db", (err, data) => {
      if (!err) {
          // check if the username and password is correct
          db.all('SELECT quantity FROM tables where tableId="' + tableId + '"', (err, data) => {
            
               console.log(data)
              // console.log(typeof data[0])
              if (data.length == 1) {
                  console.log(data[0]['quantity'])
                  var quantity=data[0]['quantity']
                  let sql;
                  sql = 'UPDATE tables SET quantity = ? WHERE tableId = ?';
                  newQuantity=quantity-changeNum
                  // newQuantity=98
                  db.run(sql, [newQuantity, tableId], (err) => {
                      console.log("Reset quantity sucessfully")
                      if (!err) {
                          // correctInfo = true;
                          ans['stat'] = 1;
                          ans['content'] = 'You have changed the table quantity successfully!';
                          // console.error(err.message);
                          return res.send(JSON.stringify(ans))
                      } else {
                          ans['stat'] = 0;
                          ans['content'] = 'You have entered the right tableId, but changing failed!';
                          return res.send(JSON.stringify(ans))
                      }
                  });
              }
              else {
                  ans['stat'] = 0;
                  ans['content'] = 'The tableID is not unique';
                  return res.send(JSON.stringify(ans))
              }
          })
      }
  })
})





// create sofa table
app.get("/create_sofaTable",(req,res)=>{
  var db = new sqlite3.Database('./db/master.db',(err,data)=>{
    let ans={stat:"",content:""}
      if(!err){
          db.run('CREATE TABLE IF NOT EXISTS sofa(id  integer primary key autoincrement,sofaId text,sofaName text, quantity integer, description text, image text)',(err)=>{
              if(!err){
                      console.log('sofa is created sucessfully!')
                      db.run('INSERT INTO sofa(sofaId,sofaName ,quantity, description, image) values("s02","sofa2","99","This is a pretty sofa","90sd90asda90sf8a0gas")',(err)=>{
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


// search all sofa table
app.get("/search_all_sofa",(req,res)=>{
    var db = new sqlite3.Database('./db/master.db',(err,data)=>{
      let ans={stat:"",content:""}
        if(!err){
            db.all('SELECT * FROM sofa',(err, data)=>{
                if(!err){
                    console.log(typeof data)
                    console.log(data)
                      ans['stat']=1;
                      ans['content']=data;
                      return res.send(JSON.stringify(ans))
                }
                else{
                    ans['stat']=0;
                      ans['content']="sorry did not find sofa info";
                    console.log(err.message)
                }
            })
        }
    })
  })

  // search sofa table by id
app.get("/search_sofa_byId",(req,res)=>{
    var sofaId = req.body.sofaId
    var db = new sqlite3.Database('./db/master.db',(err,data)=>{
      let ans={stat:"",content:""}
        if(!err){
            db.all('SELECT * FROM sofa where sofaId="' + sofaId + '"',(err, data)=>{
                if(!err){
                    console.log(typeof data)
                    console.log(data)
                      ans['stat']=1;
                      ans['content']=data;
                      return res.send(JSON.stringify(ans))
                }
                else{
                    ans['stat']=0;
                      ans['content']="sorry did not find sofa info by sofaId";
                    console.log(err.message)
                }
            })
        }
    })
  })



// edit sofa quantity
app.post("/change_sofa_quantity", (req, res) => {
  var sofaId = req.body.sofaId
  var changeNum=req.body.changeNumber
  console.log("sofaId: "+sofaId+"    changeNumber: "+changeNum)
  let ans = { stat: "", content: "" }
  //  var correctInfo = false
  //print bubby
  console.log("decrease the number of "+sofaId+" by "+changeNum)
  var db = new sqlite3.Database("./db/master.db", (err, data) => {
      if (!err) {
          // check if the username and password is correct
          db.all('SELECT quantity FROM sofa where sofaId="' + sofaId + '"', (err, data) => {
            
               console.log(data)
              // console.log(typeof data[0])
              if (data.length == 1) {
                  console.log(data[0]['quantity'])
                  var quantity=data[0]['quantity']
                  let sql;
                  sql = 'UPDATE sofa SET quantity = ? WHERE sofaId = ?';
                  newQuantity=quantity-changeNum
                  // newQuantity=98
                  db.run(sql, [newQuantity, sofaId], (err) => {
                      console.log("Reset quantity sucessfully")
                      if (!err) {
                          // correctInfo = true;
                          ans['stat'] = 1;
                          ans['content'] = 'You have changed the sofa quantity successfully!';
                          // console.error(err.message);
                          return res.send(JSON.stringify(ans))
                      } else {
                          ans['stat'] = 0;
                          ans['content'] = 'You have entered the right sofaId, but changing failed!';
                          return res.send(JSON.stringify(ans))
                      }
                  });
              }
              else {
                  ans['stat'] = 0;
                  ans['content'] = 'The sofaID is not unique';
                  return res.send(JSON.stringify(ans))
              }
          })
      }
  })
})





// create bed table
app.get("/create_bedTable",(req,res)=>{
  var db = new sqlite3.Database('./db/master.db',(err,data)=>{
    let ans={stat:"",content:""}
      if(!err){
          db.run('CREATE TABLE IF NOT EXISTS bed(id  integer primary key autoincrement,bedId text,bedName text, quantity integer, description text, image text)',(err)=>{
              if(!err){
                      console.log('bed is created sucessfully!')
                      db.run('INSERT INTO bed(bedId,bedName ,quantity, description, image) values("b02","bed2","99","This is a pretty bed","90sd90asda90sf8a0gas")',(err)=>{
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

// search all bed table
app.get("/search_all_bed",(req,res)=>{
    var db = new sqlite3.Database('./db/master.db',(err,data)=>{
      let ans={stat:"",content:""}
        if(!err){
            db.all('SELECT * FROM bed',(err, data)=>{
                if(!err){
                    console.log(typeof data)
                    console.log(data)
                      ans['stat']=1;
                      ans['content']=data;
                      return res.send(JSON.stringify(ans))
                }
                else{
                    ans['stat']=0;
                      ans['content']="sorry did not find bed info";
                    console.log(err.message)
                }
            })
        }
    })
  })

  // search bed table by id
app.get("/search_bed_byId",(req,res)=>{
    var bedId = req.body.bedId
    var db = new sqlite3.Database('./db/master.db',(err,data)=>{
      let ans={stat:"",content:""}
        if(!err){
            db.all('SELECT * FROM bed where bedId="' + bedId + '"',(err, data)=>{
                if(!err){
                    console.log(typeof data)
                    console.log(data)
                      ans['stat']=1;
                      ans['content']=data;
                      return res.send(JSON.stringify(ans))
                }
                else{
                    ans['stat']=0;
                      ans['content']="sorry did not find bed info by bedId";
                    console.log(err.message)
                }
            })
        }
    })
  })



// edit bed quantity
app.post("/change_bed_quantity", (req, res) => {
  var bedId = req.body.bedId
  var changeNum=req.body.changeNumber
  console.log("bedId: "+bedId+"    changeNumber: "+changeNum)
  let ans = { stat: "", content: "" }
  //  var correctInfo = false
  //print bubby
  console.log("decrease the number of "+bedId+" by "+changeNum)
  var db = new sqlite3.Database("./db/master.db", (err, data) => {
      if (!err) {
          // check if the username and password is correct
          db.all('SELECT quantity FROM bed where bedId="' + bedId + '"', (err, data) => {
            
               console.log(data)
              // console.log(typeof data[0])
              if (data.length == 1) {
                  console.log(data[0]['quantity'])
                  var quantity=data[0]['quantity']
                  let sql;
                  sql = 'UPDATE bed SET quantity = ? WHERE bedId = ?';
                  newQuantity=quantity-changeNum
                  // newQuantity=98
                  db.run(sql, [newQuantity, bedId], (err) => {
                      console.log("Reset quantity sucessfully")
                      if (!err) {
                          // correctInfo = true;
                          ans['stat'] = 1;
                          ans['content'] = 'You have changed the bed quantity successfully!';
                          // console.error(err.message);
                          return res.send(JSON.stringify(ans))
                      } else {
                          ans['stat'] = 0;
                          ans['content'] = 'You have entered the right bedId, but changing failed!';
                          return res.send(JSON.stringify(ans))
                      }
                  });
              }
              else {
                  ans['stat'] = 0;
                  ans['content'] = 'The bedID is not unique';
                  return res.send(JSON.stringify(ans))
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
        db.run('CREATE TABLE IF NOT EXISTS orderInfo(id  integer primary key autoincrement, orderId text, customerName text, customerAddress text, cardNumber text, exp_date text, secu_code integer, itemName text)',(err)=>{
        console.log("2222")
              if(!err){
                      console.log('table is created sucessfully!')
                      db.run('INSERT INTO orderInfo(orderId, customerName,customerAddress, cardNumber, exp_date, secu_code, itemName) values("AAAA","Alex","188 harvest rose","4563888855742057","05/16","826","Table1")',(err)=>{
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



  // search orderInfo table by id
  app.get("/search_order_byId",(req,res)=>{
    var orderId = req.body.orderId
    var db = new sqlite3.Database('./db/master.db',(err,data)=>{
      let ans={stat:"",content:""}
        if(!err){
            db.all('SELECT * FROM orderInfo where orderId="' + orderId + '"',(err, data)=>{
                if(!err){
                    console.log(typeof data)
                    console.log(data)
                      ans['stat']=1;
                      ans['content']=data;
                      return res.send(JSON.stringify(ans))
                }
                else{
                    ans['stat']=0;
                      ans['content']="sorry did not find bed info by orderId";
                    console.log(err.message)
                }
            })
        }
    })
  })




// create count table
app.get("/create_countTable",(req,res)=>{
  var db = new sqlite3.Database('./db/master.db',(err,data)=>{
    let ans={stat:"",content:""}
      if(!err){
          db.run('CREATE TABLE IF NOT EXISTS count(id  integer primary key autoincrement, countNum integer)',(err)=>{
              if(!err){
                      console.log('count is created sucessfully!')
                      db.run('INSERT INTO count(countNum) values("001")',(err)=>{
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


app.listen(5489,()=>{
  console.log("your server has been started..   ");
})

// chair table sofa bed 