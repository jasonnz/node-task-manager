const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: "Mike Tee",
  email: "miket@testingapp.com",
  password: "save@25$!2asWE",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
}

const userTwo = {
  name: "Mike Dee",
  email: "miked@testingapp.com",
  password: "save@25$!2asWE"
}

const configureDatabase = async function() {
    await User.deleteMany()
    await new User(userOne).save()
}

module.exports = { userOneId, userOne, userTwo, configureDatabase }
