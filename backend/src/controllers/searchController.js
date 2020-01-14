const Dev = require('../models/dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {

    async index(response, request) {
        const { latitude, longitude, techs } = request.query;

        const techAsArray = parseStringAsArray(techs);

        const devs = await Dev.find({
             techs: { $in: techAsArray},
             location: { 
                 $near: {
                    geometry:{
                         type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000, 
                },
            }
         });

        return response.json(devs);
    }
}