const h = require('./../utilities/helper');
const constants = require("../utilities/constants");

var distance = require('google-distance-matrix');
// var origins = ['Islamabad', '33.6844,73.0479'];
// var destinations = ['Mardan', '34.1986,72.0404'];
mapController = {};

mapController.distance = async (req, res) => {
    const origins = req.body.origins;
    const destinations = req.body.destinations;

    distance.key('AIzaSyCIndejiZye8WjzOpl7ZIBe1VKjOIqilhY');
    distance.units('imperial');
    distance.matrix(origins, destinations, function (err, distances) {

        if (err) {
            returnObj = h.resultObject(null, false, 500, err);
        } else if (!distances) {
            returnObj = h.resultObject(null, true, 200, 'no distances');
        } else if (distances.status == 'OK') {
            let ret = [];
            for (var i = 0; i < origins.length; i++) {
                for (var j = 0; j < destinations.length; j++) {
                    var origin = distances.origin_addresses[i];
                    var destination = distances.destination_addresses[j];
                    if (distances.rows[0].elements[j].status == 'OK') {
                        var distance = distances.rows[i].elements;
                        console.log('Distance from ' + origin + ' to ' + destination + ' is ' + distance);
                        ret.push(distance)
                    } else {
                        ret.push(destination + ' is not reachable by land from ' + origin)

                    }
                }
            }

            returnObj = h.resultObject(ret, true, 200, '');
        }
        res.status(returnObj.statusCode).send(returnObj);
    });
};

module.exports = mapController;



