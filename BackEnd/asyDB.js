const dbFile = require("./dbDAO")


async function getAllInfo(tableName){
    try {
        let db = new dbFile.Database();
        await db.connect();
        let query = 'SELECT * FROM ' + tableName
        console.log(query)
        let result = await db.all(query)
        // console.log(result);
        return JSON.stringify({status: 1, content: result});

    }catch (e){
        return JSON.stringify({status:0, content:e})
    }

}

async function getInfoByID(tableName, idName, id){
    try {
        let db = new dbFile.Database();
        await db.connect();
        let query = 'SELECT * FROM '+ tableName +' WHERE "' + idName + '" = "' + id +'"'
        console.log(query)
        let result  = await db.get(query)
        // console.log(result[0])
        if (result == null){
            throw Error("No result is founded")
        }
        return JSON.stringify({status: 1, content: result});
    }catch (e) {
        return JSON.stringify({status:0, content:e.message})
    }

}

async function editItemQuantity(tableName, idName, id, quantityToBuy) {

    let db = new dbFile.Database();
    await db.connect();
    let query1 = 'SELECT quantity FROM '+ tableName +' WHERE "' + idName + '" = "' + id +'"'
    // console.log(query1)
    let temp = await db.all(query1)
    // console.log(temp);
    let new_quantity = temp[0]['quantity'] - quantityToBuy;
    if (new_quantity<0){
        throw new Error('Result in quantity smaller than 0')
    }
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

// test
// console.log(getAllInfo("tables"))
// getInfoByID("bed", "bedId", "b01")
// editItemQuantity('bed', 'bedId','b01','1')
// insertOrder('"ABDC","chao","188 harvest rose","4563888855742057","05/16","826","Table66"')
// insertVersion(10)


exports.insertVersion = insertVersion;
exports.getAllInfo = getAllInfo;
exports.getInfoByID = getInfoByID;
exports.editItemQuantity = editItemQuantity;
exports.insertOrder = insertOrder;