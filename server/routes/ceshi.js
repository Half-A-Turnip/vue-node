var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.set('debug', true)
mongoose.connect('mongodb://localhost:27017/ceshi', {useMongoClient: true}, function (err) {
  if (err) {
    console.log('数据库连接失败！')
  } else {
    console.log('数据库连接成功！')
  }
})
mongoose.connection.on('fail', function() {
  console.log('MongoDB connected fail')
})

mongoose.connection.on('discounncted', function() {
  console.log('MongoDB connected discounncted')
})

var Schema = mongoose.Schema

var MyStudent = mongoose.model('Student', {
  name: String,
  id: Number,
  phone: String,
  date: Date
})
