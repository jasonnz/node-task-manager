require('../src/db/mongoose')
const User = require('../src/models/user')

User.findByIdAndUpdate('5e0c629037fb0c1291b02b3b', {
    age: 1
}).then((user) => {
    console.log(user)
    return User.countDocuments({ age:1 })
}).then((user) => {
    console.log(user)  
}).catch((error) => {
    console.log(error)
})
