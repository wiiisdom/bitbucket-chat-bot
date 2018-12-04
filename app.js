const express = require('express')
const bodyParser = require('body-parser')

require('dotenv').config()
const app = express()
app.use(bodyParser.json())
const port = 3000

var indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.listen(process.env.PORT || port, () => console.log(`Bitbucket Chat Bot started !`))