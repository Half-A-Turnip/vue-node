var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var goods = new mongoose.Schema({
  _id: String,
  productId: String,
  productName: String,
  salePrice: Number,
  productImage: String,
  productUrl: String
})
mongoose.connect('mongodb://localhost:27017/db_demo', { useMongoClient: true }, function(err) {
  if (err) {
    return err
  }
  console.log('数据库连接成功！')
})
var Goods = mongoose.model('good', goods)
mongoose.connection.on('fail', function() {
  console.log('MongoDB connected fail')
})

mongoose.connection.on('discounncted', function() {
  console.log('MongoDB connected discounncted')
})

router.get('/', function(req, res, next) {
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let priceLeval = req.param('priceLeval')
  let skip = (page - 1) * pageSize
  let sort = req.param('sort')
  let params = {}
  /* no-unused-vars */
  var priceGt = ''
  let priceLte = ''
  if (priceLeval !== 'all') {
    switch (priceLeval) {
      case '0':
        priceGt = 0
        priceLte = 100
        break
      case '1':
        priceGt = 100
        priceLte = 500
        break
      case '2':
        priceGt = 500
        priceLte = 1000
        break
      case '3':
        priceGt = 1000
        priceLte = 5000
        break
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }

  let goodModel = Goods.find(params).skip(skip).limit(pageSize)
  goodModel.sort({ 'salePrice': sort })
  goodModel.exec(function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      console.log(doc)
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})
module.exports = router
