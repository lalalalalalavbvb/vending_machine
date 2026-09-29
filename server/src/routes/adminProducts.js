const r = require('express').Router(), multer = require('multer'), path = require('path'), m = require('../models/products')
const upload = multer( {
    storage: multer.diskStorage( {
        destination: '/app/frontend-assets/uploads', filename:(q, f, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(f.originalname).toLowerCase()}`)
    }), limits: {
        fileSize: 5 * 1024 * 1024
    }
})
const admin =(req, res, next) => {
    const t = req.headers.authorization || '';
    if(t === `Bearer ${process.env.ADMIN_USER||'admin'}:${process.env.ADMIN_PASS||'admin123'}`)next();
    else res.status(401).json( {
        message: 'กรุณาเข้าสู่ระบบ Admin'
    })
}
r.get('/', admin, async(req, res, next) => {
    try {
        res.json(await m.getAllAdmin())
    }
    catch(e) {
        next(e)
    }
})
r.post('/upload', admin, upload.single('image'),(req, res) => {
    if( ! req.file)return res.status(400).json( {
        message: 'กรุณาเลือกรูปภาพ'
    }); res.json( {
        image_url: `http://localhost:8000/uploads/${req.file.filename}`
    })
})
r.post('/', admin, async(req, res, next) => {
    try {
        res.json(await m.create(req.body))
    }
    catch(e) {
        next(e)
    }
})
r.put('/:id', admin, async(req, res, next) => {
    try {
        res.json(await m.update(req.params.id, req.body))
    }
    catch(e) {
        next(e)
    }
})
r.delete('/:id', admin, async(req, res, next) => {
    try {
        await m.remove(req.params.id); res.json( {
            message: 'ลบสินค้าเรียบร้อย'
        })
    }
    catch(e) {
        next(e)
    }
})
module.exports = r
