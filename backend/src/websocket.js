const socketIo = require('socket.io');
const parseStringAsArry = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connections = [];

exports.setUpWebSocket = (server) => {
    io = socketIo(server);

    io.on('connection', socket => {
        const { latitude, longitude, techs } = socket.io.handshake.query;
        connections.push({
            _id: socket._id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArry(techs),

        });

    });
}

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 10
        && connection.techs.some(item => tech.includes(item))
    });
}

exports.sendMessage = (to, message, data) => {
    to.forEach( connection => {
        io.to(connection._id).emit(message, data);
    } )
}