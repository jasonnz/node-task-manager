const express = require("express");

// calling require runs the mongod connection code
require("./db/mongoose");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app
