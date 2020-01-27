const express = require('express')

// calling require runs the mongod connection code
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})