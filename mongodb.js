const { MongoClient, ObjectID } = require("mongodb")
const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionUrl, { useUnifiedTopology: true  }, (error, client) => {

    if (error) return console.log('Unable to connect to Database: ' + databaseName)
    console.log('Connected to Database: ' + databaseName)

    const db = client.db(databaseName) 

    db.collection('tasks').deleteOne({
        "description": "Open Presents"
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
    
    client.close()
});
