const express = require('express')

const router = require('./routers/router')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(router)

app.listen(3333, () => {
    console.log('listen in port 3333')
})
