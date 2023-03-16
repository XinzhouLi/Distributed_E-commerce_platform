const dbFile = require("./dbDAO");
const util = require("util");
const fs = require("fs");

const open = util.promisify(fs.open);
const writeFile = util.promisify(fs.writeFile);
// const stat = util.promisify(fs.stat);
// const read = util.promisify(fs.read);
const exec = util.promisify(require("child_process").exec);

// Check out
// https://stackoverflow.com/questions/30763496/how-to-promisify-nodes-child-process-exec-and-child-process-execfile-functions

async function getAllInfo(tableName) {
  try {
    let db = new dbFile.Database();
    await db.connect();
    let query = "SELECT * FROM " + tableName;
    console.log(query);
    let result = await db.all(query);
    // console.log(result);
    return JSON.stringify({ status: 1, content: result });
  } catch (e) {
    return JSON.stringify({ status: 0, content: e });
  }
}

async function getInfoByID(tableName, idName, id) {
  try {
    let db = new dbFile.Database();
    await db.connect();
    let query =
      "SELECT * FROM " + tableName + ' WHERE "' + idName + '" = "' + id + '"';
    console.log(query);
    let result = await db.get(query);
    // console.log(result[0])
    if (result == null) {
      throw Error("No result is founded");
    }
    return JSON.stringify({ status: 1, content: result });
  } catch (e) {
    return JSON.stringify({ status: 0, content: e.message });
  }
}

async function editItemQuantity(tableName, idName, id, quantityToBuy) {
  let db = new dbFile.Database();
  await db.connect();
  let query1 =
    "SELECT quantity FROM " +
    tableName +
    ' WHERE "' +
    idName +
    '" = "' +
    id +
    '"';
  // console.log(query1)
  let temp = await db.all(query1);
  // console.log(temp);
  let new_quantity = temp[0]["quantity"] - quantityToBuy;
  if (new_quantity < 0) {
    throw new Error("Result in quantity smaller than 0");
  }
  let query2 =
    'UPDATE "' + tableName + '" SET quantity = ? WHERE "' + idName + '" = ?';
  // console.log(query2)
  await db.run(query2, [new_quantity, id]);
}

async function insertOrder(OrderData) {
  let db = new dbFile.Database();
  await db.connect();
  let query =
    "INSERT INTO orderInfo(orderId, customerName,customerAddress, cardNumber, exp_date, secu_code, itemName) values(" +
    OrderData +
    ")";
  // console.log(query)
  await db.run(query);
}

async function insertVersion(versionNum) {
  let db = new dbFile.Database();
  await db.connect();
  let query = "INSERT INTO version(versionNum) values(" + versionNum + ")";
  await db.run(query);
}

async function sendLocalSQL(dbName, socket) {
  //For example, serverName = server1.db extension name necessary
  await exec("sqlite3 db/" + dbName + " .dump > db/master.sql");
  await open("db/master.sql", "r", function (err, fd) {
    if (err) {
      console.log(err.message);
      socket.emit("sendSQL", "fail1");
    } else {
      fs.stat("db/master.sql", function (err, stats) {
        if (err) {
          console.log(err);
          socket.emit("sendSQL", "fail2");
        } else {
          //console.log(stats.size)
          let buffer = new Buffer.alloc(stats.size);
          fs.read(fd, buffer, 0, buffer.length, 0, function (err, bytes) {
            console.log(fd);
            socket.emit("sendSQL", buffer, "master.sql");
          });
        }
      });
    }
  });
}

async function applyMasterSQL(dbName, data, filename) {
  //data, filename from socket 'sendsql'
  let db = new dbFile.Database();
  console.log(data);
  await writeFile("db/" + filename, data);
  await db.connect();
  // later for increase the speed of process to make it to Promiss.all
  await db.run("DROP TABLE IF EXISTS bed");
  await db.run("DROP TABLE IF EXISTS chair");
  await db.run("DROP TABLE IF EXISTS orderInfo");
  await db.run("DROP TABLE IF EXISTS sofa");
  await db.run("DROP TABLE IF EXISTS tables");
  await db.run("DROP TABLE IF EXISTS version");
  await db.close();
  await exec("sqlite3 db/" + dbName + " < db/master.sql");
}
// getAllInfo("tables")
// getInfoByID("bed", "bedId", "b01")
// editItemQuantity('bed', 'bedId','b01','1')
// insertOrder('"ABDC","chao","188 harvest rose","4563888855742057","05/16","826","Table66"')
// insertVersion(10)

exports.insertVersion = insertVersion;
exports.getAllInfo = getAllInfo;
exports.getInfoByID = getInfoByID;
exports.editItemQuantity = editItemQuantity;
exports.insertOrder = insertOrder;
exports.sendLocalSQL = sendLocalSQL;
exports.applyMasterSQL = applyMasterSQL;
