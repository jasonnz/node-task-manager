const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.get('/users', async (req, res) => {

    // User.find({}).then((users) => {
    //   res.status(200)
    //   res.send(users)
    // }).catch((error) => {
    //   res.status(400)
    //   res.send(`${error}`)
    // })

    try {
        const user = await User.find({})
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }

})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    if (!_id.match(/^[0-9a-fA-F]{24}$/)) return res.status(404).send({ error: 'Not a valid _id!' })

    // User.findById(_id).then((user) => {
    //   if (!user) return res.status(404).send({ error: 'No user found!' })
    //   res.status(200)
    //   res.send(user)
    // }).catch((error) => {
    //   res.status(500)
    //   res.send(`${error}`)
    // })

    try {
        const user = await User.findById(_id)
        if (!user) return res.status(404).send({ error: 'No user found!' })
        res.status(200)
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }

})

router.patch('/users/:id', async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((item) => {
        return allowedUpdates.includes(item)
    })

    if (!isValidOperation) res.status(400).send({ error: 'Invalid updates!' })

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!user) return res.status(404).send()

        res.status(201).send(user)

    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    // user.save().then((user) => {
    //     res.status(201)
    //     res.send(user)
    // }).catch((error) => {
    //     res.status(500)
    //     res.send(`${error}`)
    // })

    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }

})

router.delete('/users/:id', async (req, res) => {

    try {

        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) return res.status(404).send()

        res.status(202).send(user)

    } catch (error) {
        res.status(400).send(error)
    }

})

module.exports = router