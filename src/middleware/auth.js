const jwt = require('jsonwebtoken')
const User = require('../models/user') 

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log('token = ' + token)
        const decoded = jwt.verify(token, 'abc1234')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token});
        // console.log('user = ' + user)
        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()

    } catch (e) {
        res.status(401).send(e)
    }
}

module.exports = auth