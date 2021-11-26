const h = require('./../utilities/helper');
const coreModel = require('../models/coreModel');

coreController = {};

coreController.getUsers = async (req, res) => {
    // const users = await Common.getUsers();
    // return res.status(200).send({data:'Data'});
    //res.render('index', { title: 'Express' });
    res.render('index', { title: 'Get usersssssss' });
}

coreController.getProfile = async (req, res) => {
    const users = await coreModel.getUsers();
    // return h.log(users);   
    return res.status(200).send(users);
    //res.render('index', { title: 'Express' });
    // res.render('index', {title: 'Get user profilees'});
}

module.exports = coreController;