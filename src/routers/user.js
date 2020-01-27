const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const multer = require('multer')
const router = new express.Router()
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");

const upload = multer({
  limits : {
      fileSize: 1000000
  },
  fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            console.log('Should be an error')
            return cb(new Error('PLEASE UPLOAD AN IMAGE FILE'))
        }
        cb(undefined, true)
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

router.get('/users/me', auth, async (req, res) => {

    // User.find({}).then((users) => {
    //   res.status(200)
    //   res.send(users)
    // }).catch((error) => {
    //   res.status(400)
    //   res.send(`${error}`)
    // })

    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((item) => {
        return allowedUpdates.includes(item)
    })

    if (!isValidOperation) res.status(400).send({ error: 'Invalid updates!' })

    try {
        
        // const user = await User.findById(req.params.id)
        const user = req.user
        updates.forEach((prop) => user[prop] = req.body[prop])
        
        await user.save() // Invokes moongose middleware

        // By passes mongoose middleware
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        // if (!user) return res.status(404).send()

        res.status(201).send(user)

    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        
        await req.user.save()
        res.status(201).send()

    } catch (error) {
        res.status(500).send()
    }
})

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = []

    await req.user.save();
    res.status(201).send();
  } catch (error) {
    res.status(500).send();
  }
});

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
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken();
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }

})


router.post('/users/login', async (req, res) => {
    
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.send({user, token})

    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }

})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
    next()
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
    next()
})

router.delete('/users/me', auth,  async (req, res) => {

    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) return res.status(404).send()
        // res.status(202).send(user)
        sendCancelationEmail(req.user.email, req.user.name);
        await req.user.remove()
        res.status(202).send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }

})

module.exports = router