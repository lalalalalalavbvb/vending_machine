const r = require('express').Router(), c = require('../controllers/products');
r.get('/', c.getAll);
r.get('/:id', c.getById);
module.exports = r
