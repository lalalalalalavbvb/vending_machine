const express = require('express'), cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('/app/frontend-assets/uploads'))
app.use('/products', require('./routes/products'))
app.use('/admin/products', require('./routes/adminProducts'))
app.use('/orders', require('./routes/orders'))
app.use('/users', require('./routes/users'))
app.get('/health',(req, res) => res.json( {
    ok: true
}))
app.use(require('./middlewares/errorHandler'))
module.exports = app
