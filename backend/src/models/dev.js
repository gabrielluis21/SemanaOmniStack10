const mongoose = require('mongoose');
const pointSchemma = require('./utils/pointSchemma');

const DevSchemma = new mongoose.Schema({
    name: String,
    github_username: String,
    bio: String,
    avatar_url: String,
    techs: [String],
    location: {
        type: pointSchemma,
        index: '2dsphere',
    }
});

module.exports = mongoose.model('Dev', DevSchemma);