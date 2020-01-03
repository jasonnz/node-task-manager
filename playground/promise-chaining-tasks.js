require('../src/db/mongoose')
const Task = require('../src/models/task')

Task.findByIdAndDelete('5e08567fcd237c13cdec7849').then((task) => {
    console.log(task)
    return Task.countDocuments({ completed:true })
}).then((task) => {
    console.log(task)  
}).catch((error) => {
    console.log(error)
})
