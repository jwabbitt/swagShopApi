var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var port = 3004;
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product');
var WishList = require('./model/wishlist');

//Allow all request from all domains & local host
app.all('/*', function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Get all products
app.get('/product', function(request, response) {
    Product.find({}, function (err, products) {
        if (err) {
            response.status(500).send({error: "Could not find products"})
        } else {
            response.status(200).send(products);
        }
    })
});

app.post('/product', function(request, response) {
    var product = new Product(); 
    product.title = request.body.title;
    product.price = request.body.price;
    product.imgUrl = request.body.imgUrl;
    product.save(function(err, savedProduct) {
        if (err) {
            response.status(500).send({error: "Could not save product"});
        } else {
            response.status(200).send(savedProduct);
        }
    });
});

app.get('/wishlist', function(request, response){
    WishList.find({}).populate({path: 'products', model: 'Product'}).exec(function(err, wishLists){
        if (err) {
            response.status(500).send({error: "Could not find wishlists"});
        } else {
            response.status(200).send(wishLists);
        }
    });
});

app.post('/wishlist', function(request, response){
    var wishList = new WishList();
    wishList.title = request.body.title;

    wishList.save(function(err, newWishList){
        if (err) {
            response.status(500).send({error: "Could not create wish list"});
        } else {
            response.status(200).send(newWishList);
        }
    });
});

app.put('/wishlist/product/add', function(request, response){
    Product.findOne({_id: request.body.productId}, 
        function(err, product){
            if (err) {
                response.status(500).send({error: "Could not find productId to add to wish list"});
            } else {
                WishList.update({_id: request.body.wishListId},
                    {$addToSet: {
                        products: product._id
                    }}, function(err, wishList){
                        if (err) {
                            response.status(500).send({error: "Could not find wish list to add product to"})
                        } else {
                            response.send(wishList);
                        }
                    })
            }
        });
});

app.listen(port, function() {
    console.log("Swag Shop API running on port " + port);
});