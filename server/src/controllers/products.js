const m = require('../models/products')
exports.getAll = async(req, res, next) => {
    try {
        res.json(await m.getAll())
    }
    catch(e) {
        next(e)
    }
}
exports.getById = async(req, res, next) => {
    try {
        const x = await m.getById(req.params.id);
        if( ! x)return res.status(404).json( {
            message: 'ไม่พบสินค้า'
        });
        res.json(x)
    }
    catch(e) {
        next(e)
    }
}
