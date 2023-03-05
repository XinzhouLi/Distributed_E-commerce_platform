var sqlite3 = require("sqlite3");
var express= require("express");

var app=express();
app.use(express.json());
var dbPath = '../db/master.db'

// search all table
// tableName example: chair 
function getAllInfo(tableName){
    var db = new sqlite3.Database(dbPath,(err,data)=>{
      let ans={stat:"",content:""}
        if(!err){
            db.all('SELECT * FROM "' + tableName + '"',(err, data)=>{
                if(!err){
                    console.log(typeof data)
                    console.log(data)
                      ans['stat']=1;
                      ans['content']=data;
                      return JSON.stringify(ans)
                }
                else{
                    ans['stat']=0;
                    ans['content']="sorry did not find  '" + tableName + "' info";
                    console.log(err.message)
                    return JSON.stringify(ans)
                }
            })
        }
    })
  }


  // search item by id
  //tableName example: bed
  //IdName example: bedId
  //Id example: b03
function getInfoByID(tableName,IdName,Id){
    var db = new sqlite3.Database(dbPath,(err,data)=>{
      let ans={stat:"",content:""}
        if(!err){
            db.all('SELECT * FROM "' + tableName + '" where "' + IdName + '"="' + Id + '"',(err, data)=>{
                if(!err){
                    console.log(typeof data)
                    console.log(data)
                      ans['stat']=1;
                      ans['content']=data;
                      return JSON.stringify(ans)
                }
                else{
                    ans['stat']=0;
                    ans['content']="sorry did not find '"+tableName +"' info by '"+IdName+"'";
                    console.log(err.message)
                    return JSON.stringify(ans)
                }
            })
        }
    })
  }


  // edit item quantity
  //tableName example: bed
  //IdName example: bedId
  //Id example: b03
  //changeNum: 1
function editItemQuantity(tableName,IdName,Id,changeNum){
  let ans = { stat: "", content: "" }
  //print bubby
  console.log("decrease the number of "+Id+" by "+changeNum)
  var db = new sqlite3.Database(dbPath, (err, data) => {
      if (!err) {
          // check if the username and password is correct
          db.all('SELECT quantity FROM "'+tableName+'" where "'+IdName+'"="' + Id + '"', (err, data) => {
               console.log(data)
              if (data.length == 1) {
                  console.log(data[0]['quantity'])
                  var quantity=data[0]['quantity']
                  let sql;
                  sql = 'UPDATE "'+tableName+'" SET quantity = ? WHERE "'+IdName+'" = ?';
                  newQuantity=quantity-changeNum
                  db.run(sql, [newQuantity, Id], (err) => {
                      console.log("Reset quantity sucessfully")
                      if (!err) {
                          ans['stat'] = 1;
                          ans['content'] = 'You have changed the "'+tableName+'" quantity successfully!';
                          return JSON.stringify(ans)
                      } else {
                          ans['stat'] = 0;
                          ans['content'] = 'You have entered the right "'+IdName+'", but changing failed!';
                          return JSON.stringify(ans)
                      }
                  });
              }
              else {
                  ans['stat'] = 0;
                  ans['content'] = 'The "'+IdName+'" is not unique';
                  return JSON.stringify(ans)
              }
          })
      }
  })
}


// create order table
// insertOrderData form: orderId, customerName,customerAddress, cardNumber, exp_date, secu_code, itemName
// insertOrderData example: '"ABDC","chao","188 harvest rose","4563888855742057","05/16","826","Table88"'
function insertOrder(insertOrderData){
  var db = new sqlite3.Database(dbPath,(err,data)=>{
    let ans={stat:"",content:""}
      if(!err){
        db.run('CREATE TABLE IF NOT EXISTS orderInfo(id  integer primary key autoincrement, orderId text, customerName text, customerAddress text, cardNumber text, exp_date text, secu_code integer, itemName text)',(err)=>{
              if(!err){
                        console.log('table is created sucessfully!')
                        db.run('INSERT INTO orderInfo(orderId, customerName,customerAddress, cardNumber, exp_date, secu_code, itemName) values('+insertOrderData+')',(err)=>{
                        if(!err){
                            ans['stat']=1;
                            ans['content']='Data add successfully!';
                            return JSON.stringify(ans)
                            }
                        else{
                            ans['stat']=0;
                            ans['content']='Error!';
                            console.log(err);
                            return JSON.stringify(ans)
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
}

// add new version number
// versionNum example: 6
function insertVersion(versionNum){
  var db = new sqlite3.Database(dbPath,(err,data)=>{
    let ans={stat:"",content:""}
      if(!err){
          db.run('CREATE TABLE IF NOT EXISTS version(id  integer primary key autoincrement, versionNum integer)',(err)=>{
              if(!err){
                    //   console.log('count is created sucessfully!')
                      db.run('INSERT INTO version(versionNum) values('+versionNum+')',(err)=>{
                        if(!err){
                            console.log("New version number added")
                            ans['stat']=1;
                            ans['content']='Data add successfully!';
                            return JSON.stringify(ans)
                            }
                        else{
                            ans['stat']=0;
                            ans['content']='Error!';
                            console.log(err);
                            return JSON.stringify(ans)
                        }
                    })
              }
              else{
                  console.log(err.message)
              }
          })
      }
  })
}

// var iod='"ABDC","chao","188 harvest rose","4563888855742057","05/16","826","Table88"'
// addVersion(003)
// getInfoByID("version","versionNum",3)

