const router = require('express').Router();
const mapController = require('../controllers/mapController');

router.post('/distance', mapController.distance);
module.exports = router;