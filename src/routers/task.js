const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.get('/tasks', async (req, res) => {
    // Task.find({}).then((task) => {
    //   res.status(200)
    //   res.send(task)
    // }).catch((error) => {
    //   res.status(400)
    //   res.send(`${error}`)
    // })

    try {
        const task = await Task.find({})
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }

})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    if (!_id.match(/^[0-9a-fA-F]{24}$/)) return res.status(404).send({ error: 'Not a valid _id!' })
    // Task.findById(_id).then((task) => {
    //   if (!task) return res.status(404).send({ error: 'No task found!' })
    //   res.status(200)
    //   res.send(task)
    // }).catch((error) => {
    //   res.status(500)
    //   res.send(`${error}`)
    // })

    try {
        const task = await Task.findById(_id)
        if (!task) return res.status(404).send({ error: 'No task found!' })
        res.status(200)
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'description']
    const isValidOperation = updates.every((item) => {
        return allowedUpdates.includes(item)
    })

    if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' })

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!task) return res.status(404).send()

        res.status(201).send(task)

    } catch (error) {
        res.status(400).send(error)
    }
})

router.post("/tasks", async (req, res) => {

    // const task = new Task(req.body)
    //   task.save().then(() => {
    //     res.status(201)
    //     res.send(task)
    //   }).catch(error => {
    //     res.status(400)
    //     res.send(`${error}`)
    //   })

    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }

})

router.delete('/tasks/:id', async (req, res) => {

    try {

        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) return res.status(404).send()

        res.status(202).send(task)

    } catch (error) {
        res.status(400).send(error)
    }

})

module.exports = router