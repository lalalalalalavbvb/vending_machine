require('dotenv').config()
const app = require('./src/app')
const port = Number(process.env.PORT || 8000)
app.listen(port,() => console.log(`Server running on ${port}`))
