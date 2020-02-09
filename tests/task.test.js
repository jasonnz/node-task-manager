const request = require('supertest')
const Task = require('../src/models/task')
const app = require("../src/app");
const { userOneId, userOne, userTwo, configureDatabase } = require('./fixtures/db')

beforeEach(configureDatabase)

test('Should create a task for a User', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)

        const task = await Task.findById(response.body._id)
        expect(task).not.toBeNull()
        expect(task.completed).toEqual(false)
})
