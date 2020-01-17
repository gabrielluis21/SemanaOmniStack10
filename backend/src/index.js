const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const routes = require('./routes');
const { setUpWebSocket } = require('./websocket');

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-szypc.mongodb.net/week10?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const app = express();
const server = http.Server(app);

setUpWebSocket(server);

app.use(cors());
app.use(express.json);
app.use(routes);

server.listen(3333);