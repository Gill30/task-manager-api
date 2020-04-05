const express = require("express")
require('./db/mongoose')
const UserRouter = require("./routers/user")
const TaskRouter = require("./routers/task")
const AssigneeRouter = require("./routers/assignee")
const filesRouter = require("./routers/file")

const app = express()


app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)
app.use(AssigneeRouter)
app.use(AssigneeRouter)
app.use(filesRouter)

module.exports = app