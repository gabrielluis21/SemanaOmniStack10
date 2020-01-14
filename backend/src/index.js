const express = require('express');

const app = express();

const routes = require('./routes');

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-szypc.mongodb.net/week10?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

app.use(express.json);
app.use(routes);

app.listen(3333);