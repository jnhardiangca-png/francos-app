const menu = require('../data/menu');

exports.getMenu = (req, res) => {
    res.json(menu);
};