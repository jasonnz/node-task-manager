const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_CONNECTION, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});