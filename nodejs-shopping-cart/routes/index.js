var express = require('express');
var router = express.Router();

var fs = require('fs');

var Cart = require('../models/cart');
var products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));

router.get('/', function (req, res, next) {
  var productId = products && products[0].id;

  res.render('index', 
  { 
    title: 'Canteen Order Cart',
    products: products
  }
  );
});




router.get('/add/:id', function(req, res, next) {

  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var product = products.filter(function(item) {
    return item.id == productId;
  });
  cart.add(product[0], productId);
  req.session.cart = cart;
  res.redirect('/');
  inline();
});

router.get('/cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('cart', {
      products: null
    });
  }
  var cart = new Cart(req.session.cart);
  res.render('cart', {
    title: 'Canteen Order Cart',
    products: cart.getItems(),
    totalPrice: cart.totalPrice
  });
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

router.get('/user/signup', function(req,res,next){
  res.render('user/signup');
})

router.post('/user/signup', function(req,res,next){
  res.redirect('/');
})

module.exports = router;
