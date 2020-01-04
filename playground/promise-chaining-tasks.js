require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5e08567fcd237c13cdec7849').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed:true })
// }).then((task) => {
//     console.log(task)  
// }).catch((error) => {
//     console.log(error)
// })


const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteTaskAndCount('5e0c64cec3d3aa13048330c6').then((count) => {
    console.log(count)
}).catch((error) => {
    console.log(error)
})
