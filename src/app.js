const express = require("express")
require('./db/mongoose')
const UserRouter = require("./routers/user")
const TaskRouter = require("./routers/task")
const filesRouter = require("./routers/file")

const app = express()

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH ");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    next();
});

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)
app.use(filesRouter)

module.exports = app