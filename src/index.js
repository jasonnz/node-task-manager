const express = require('express')

// calling require runs the mongod connection code
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})

const Task = require('./models/task')
const User = require("./models/user");

// const main = async () => {
// //     const task = await Task.findById('5e1989eb44ae340cf51ce72f')
// //     await task.populate('owner').execPopulate()
// //     console.log(task.owner)

//     //5e1989d444ae340cf51ce72d

//     // const user = await User.findById("5e1989d444ae340cf51ce72d")
//     // await user.populate("tasks").execPopulate()
//     // console.log(user.tasks)

// }

// main()