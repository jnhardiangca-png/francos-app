const { v4: uuidv4 } = require('uuid');

const orders = require('../data/orders');

exports.createOrder = (req, res) => {
    const { items, total } = req.body;

    const order = {
        id: uuidv4(),
        items,
        total,
        date: new Date()
    };

    orders.push(order);

    res.json({
        message: 'Order placed successfully',
        order
    });
};

exports.getOrders = (req, res) => {
    res.json(orders);
};