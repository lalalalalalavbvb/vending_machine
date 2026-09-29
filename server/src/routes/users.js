const r = require('express').Router();
r.post('/login',(req, res) => {
    const {
        email, password
    }
    = req.body; if(email ===(process.env.ADMIN_USER || 'admin') && password ===(process.env.ADMIN_PASS || 'admin123'))return res.json( {
        id: 1, name: 'Admin', role: 'admin', token: `Bearer ${process.env.ADMIN_USER||'admin'}:${process.env.ADMIN_PASS||'admin123'}`
    }); res.status(401).json( {
        message: 'Username หรือ Password ไม่ถูกต้อง'
    })
});
module.exports = r
