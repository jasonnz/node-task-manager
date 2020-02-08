const request = require('supertest')
const app = require('../src/app')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../src/models/user')

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
};

const userTwo = {
    name: 'Mike Dee',
    email: 'miked@testingapp.com',
    password: 'save@25$!2asWE'
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Jason',
        email: 'jason3456@example.com',
        password: 'Mypass777!12'
    }).expect(201)

    // console.log('The response is ' + JSON.stringify(response.body))
    const user = await User.findById(response.body.user._id)
    // console.log(user)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
      user: {
        name: 'Jason'
      },
      token: user.tokens[0].token
    })

    expect(user.password).not.toBe('Mypass777!12')
})

test('Should login an existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id);

    expect(response.body).toMatchObject({
       token: user.tokens[1].token
    })

})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userTwo.email,
        password: userTwo.password
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for an unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete the account for the user', async () => {
    await request(app)
        .delete('/users/me')
        .set('authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(202)

    const user = await User.findById(userOneId)

    expect(user).toBeNull()
})


test('Should not delete account for unauthenticated user', async () => {
  await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
      .post('/users/me/avatar')
      .set('authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('avatar','tests/fixtures/profile-pic.jpg')
      .expect(200)

    const user = await User.findById(userOneId)  
    expect(user.avatar).toMatchObject(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Michael',
            age: 5
        })
        .expect(201)

        const user = await User.findById(userOneId) 
        expect(user.name).toBe('Michael')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            invalidField: 'something'
        })
        .expect(400)
})