module.exports =(err, req, res, next) => res.status(err.status || 500).json( {
    message: err.message || 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์'
})
