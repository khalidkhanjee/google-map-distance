const router = require('express').Router();

const map = require('./map');
//index route
router.get('/', function (req, res) { res.render('index', { title: 'App working' }); });

router.use('/map', map);

module.exports = router;
