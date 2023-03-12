const DB = require('./asyDB')

// port 5100: connect with load balancer
const ioWithLoadBalancer = require('socket.io')(6000);
ioWithLoadBalancer.on('connection', function (socket) {
    console.log('Server 1: connected with Load Balancer:', socket.client.id);

    socket.on('requestSingleItem', async function (data) {
        let input = data
        console.log('Server1: Send in Query')
        let result = await DB.getInfoByID(input.tableName, input.idName, input.id)
        socket.emit('responseSingleItemInfo', result)
        console.log("Server1: Send back", result)
    });

    socket.on('requestAllCateInfo', async function (data) {
        let input = data;
        console.log('Server1: Send in Query')
        let result = await DB.getAllInfo(input.tableName)
        socket.emit('responseAllCateInfo', result)
        console.log("Server1: Send back", result)
    });

    socket.on('addOrder', async function (data) {
        let input = data
        console.log('Server1: Send in Query')
        let result
        try {
            await DB.editItemQuantity(input.tableName, input.idName, input.id, input.quantityToBuy)
            await DB.insertOrder(input.insertOrderData)
            await DB.insertVersion()
        } catch (e) {
            result = JSON.stringify({status: 0, content: e.message})
            socket.emit('responseUserOrderStatus', result)
        }
        result = JSON.stringify({status: 1, content: "Order successfully placed"})
        socket.emit('responseUserOrderStatus', result)

        console.log("Server1: Send back", result)
    });

});
