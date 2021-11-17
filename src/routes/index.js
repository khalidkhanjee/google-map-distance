const router = require('express').Router();
const auth = require('../middlewares/Auth');

const authRoutes = require('./auth');
const userRoutes = require('./user');
const jobRoutes = require('./job');

//index route
router.get('/', function (req, res) { res.render('index', { title: 'Doctor app is running thank you.' }); });

//auth route
router.use('/auth', authRoutes);

//shifa-doctor-app routes
router.use(auth.check);
router.use('/user', userRoutes);
router.use('/job', jobRoutes);

module.exports = router;
