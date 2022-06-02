let users = []

const SocketServer = (socket) => {
    socket.on('joinUser', user => {
        users.push({id: user._id, socketId: socket.id})
        console.log('userjoined----',users)
    })

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
        console.log('userdisconnected----',users)
    })

    // Message
    socket.on('addMessage', msg => {
        console.log('addmessage',msg)
        const user = users.find(user => user.id === msg.recipient)
        user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg) && console.log('emittedTo',user,'msg',msg)
        socket.emit('addMessageToClient', msg);
    })
}

module.exports = SocketServer