const dbFile = require("./dbDAO")
const util = require('util');
const exec = util.promisify(require('child_process').exec);
// Check out
// https://stackoverflow.com/questions/30763496/how-to-promisify-nodes-child-process-exec-and-child-process-execfile-functions

async function getAllInfo(tableName){
    let db = new dbFile.Database();
    await db.connect();
    let query = 'SELECT * FROM ' + tableName
    // console.log(query)
    let result = await db.all(query);
    // console.log(result);
}

async function getInfoByID(tableName, idName, id){
    let db = new dbFile.Database();
    await db.connect();
    let query = 'SELECT * FROM '+ tableName +' WHERE "' + idName + '" = "' + id +'"'
    // console.log(query)
    let result  = await db.get(query)
    // console.log(result[0])
}

async function editItemQuantity(tableName, idName, id, quantityToBuy) {
    let db = new dbFile.Database();
    await db.connect();
    let query1 = 'SELECT quantity FROM '+ tableName +' WHERE "' + idName + '" = "' + id +'"'
    // console.log(query1)
    let temp = await db.all(query1)
    // console.log(temp);
    let new_quantity = temp[0]['quantity'] - quantityToBuy;
    let query2 = 'UPDATE "' + tableName + '" SET quantity = ? WHERE "' + idName + '" = ?';
    // console.log(query2)
    await db.run(query2, [new_quantity, id])
}

async function insertOrder(OrderData) {
    let db = new dbFile.Database();
    await db.connect();
    let query = 'INSERT INTO orderInfo(orderId, customerName,customerAddress, cardNumber, exp_date, secu_code, itemName) values(' + OrderData + ')'
    // console.log(query)
    await db.run(query)
}

async function insertVersion(versionNum) {
    let db = new dbFile.Database();
    await db.connect();
    let query = 'INSERT INTO version(versionNum) values(' + versionNum + ')'
    await db.run(query)
}

async function dumpLocalSQL(serverName){
    //For example, serverName = server1.db extension name necessary
    await exec('sqlite3 ../db/' + serverName + ' .dump > ../db/master.sql');
}

async function ApplyMasterSQL(){
    let db = new dbFile.Database();
    await db.connect();
    // later for increase the speed of process to make it to Promiss.all 
    await db.run('DROP TABLE IF EXISTS bed');
    await db.run('DROP TABLE IF EXISTS chair');
    await db.run('DROP TABLE IF EXISTS orderInfo');
    await db.run('DROP TABLE IF EXISTS sofa');
    await db.run('DROP TABLE IF EXISTS tables');
    await db.run('DROP TABLE IF EXISTS version');
    await db.close();
    await exec('sqlite3 db/server1.db < db/master.sql');
}
// getAllInfo("tables")
// getInfoByID("bed", "bedId", "b01")
// editItemQuantity('bed', 'bedId','b01','1')
// insertOrder('"ABDC","chao","188 harvest rose","4563888855742057","05/16","826","Table66"')
// insertVersion(10)