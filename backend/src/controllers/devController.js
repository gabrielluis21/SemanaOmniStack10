const axios = require('axios');
const Dev = require('../models/dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async store (request, response){
        const { github_username, techs, latitude, longitude } = request.body;
        let dev = await Dev.findOne({ github_username });
        
        if(!dev){
            const techsArray = parseStringAsArray(techs);

            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const { avatar_url, name = login, bio } = apiResponse.data;
        
            const location = {
                type:'Point',
                coordinates: [longitude, latitude]
            }
    
            dev = await Dev.create({
                name,
                github_username, 
                bio,
                avatar_url, 
                techs: techsArray, 
                location,
            });
        }

        return response.json(dev);
    },

    async index(response, request){
        const devs = await Dev.find();
        return response.json(devs);
    },

    async update(response, request){
        const { _id } = request.query;

        const { avatar_url, name, bio, techs, latitude, longitude } = request.body;

        const techsArray = parseStringAsArray(techs);
        const location = {
            type:'Point',
            coordinates: [longitude, latitude]
        }

        const dev = await Dev.findByIdAndUpdate(_id, {
            name, bio, avatar_url, techsArray, location
        });

        return response.json(dev);
    },

    async destroy(response, request){
        const { _id } = request.query;

        const dev = await Dev.findByIdAndDelete(_id);

        return response.json(dev);
    }
}