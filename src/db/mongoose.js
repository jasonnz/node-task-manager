const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_DB_CONNECTION, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});