const express = require('express')

// calling require runs the mongod connection code
require('./db/mongoose')

const User = require('./models/user')
const Task = require("./models/task");
const app = express()
const port = process.env.PORT || 3000

app.use(express.json());

app.get('/users', (req, res) => {
  User.find({}).then((users) => {
    res.status(200);
    res.send(users)
  }).catch((error) => {
    res.status(400)
    res.send(`${error}`)
  })
})

app.get('/users/:id', (req, res) => {
  const _id = req.params.id
  if (!_id.match(/^[0-9a-fA-F]{24}$/)) return res.status(404).send({ error: 'Not a valid _id!' })
  User.findById(_id).then((user) => {
    if (!user) return res.status(404).send({ error: 'No user found!' })
    res.status(200);
    res.send(user)
  }).catch((error) => {
    res.status(500)
    res.send(`${error}`)
  })
})

app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save().then((user) => {
        res.status(200);
        res.send(user)
    }).catch((error) => {
        res.status(500)
        res.send(`${error}`)
    })
})

app.get('/users', (req, res) => {
  User.find({}).then((users) => {
    res.status(200);
    res.send(users)
  }).catch((error) => {
    res.status(400)
    res.send(`${error}`)
  })
})

app.get('/users/:id', (req, res) => {
  const _id = req.params.id
  if (!_id.match(/^[0-9a-fA-F]{24}$/)) return res.status(404).send({ error: 'Not a valid _id!' })
  User.findById(_id).then((user) => {
    if (!user) return res.status(404).send({ error: 'No user found!' })
    res.status(200);
    res.send(user)
  }).catch((error) => {
    res.status(500)
    res.send(`${error}`)
  })
})

app.post("/tasks", (req, res) => {
  const task = new Task(req.body)
    task.save().then(() => {
      res.status(201);
      res.send(task);
    }).catch(error => {
      res.status(400);
      res.send(`${error}`);
    });
}); 

app.get('/tasks', (req, res) => {
  Task.find({}).then((task) => {
    res.status(200);
    res.send(task)
  }).catch((error) => {
    res.status(400)
    res.send(`${error}`)
  })
})

app.get('/tasks/:id', (req, res) => {
  const _id = req.params.id
  if (!_id.match(/^[0-9a-fA-F]{24}$/)) return res.status(404).send({ error: 'Not a valid _id!' })
  Task.findById(_id).then((task) => {
    if (!task) return res.status(404).send({ error: 'No task found!' })
    res.status(200);
    res.send(task)
  }).catch((error) => {
    res.status(500)
    res.send(`${error}`)
  })
})


app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
})