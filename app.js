var bodyParser = require('body-parser');
var express = require('express');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine','ejs');

var mongo = require('mongodb').MongoClient;
var mongoClient;


mongo.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, function( err, _client ) {
  if( err ) throw err;
  mongoClient = _client;
  app.listen(3000, function(){
    console.log('Exameple app listening on port 3000');
  });
});

app.get('/', function (req, res) {
    var db = mongoClient.db("restaurants");
    var opcions = {};
    var query = {};
    db.collection('restaurants').find( query, opcions ).toArray(function( err, docs ) {
        if( err ) {
            res.render( 'error', {msg:"error a la query"} );
            return;
        }
        res.render( 'showRestaurants', {"restaurants":docs} );
    });
});

app.get('/createRestaurant', function (req, res) {
  res.render('newRestaurant');
});


app.post('/createRestaurant', function (req, res){
  var inputName = req.body.name;
  var inputCategory = req.body.category;
  var inputZipCode = req.body.zipCode;
  var inputPhone = req.body.phone;
  var db = mongoClient.db("restaurants");
  var myobj = {nombre:inputName,categoria:inputCategory,codigo_postal:inputZipCode,telefono:inputPhone};
  db.collection("restaurants").insertOne(myobj, function(err, res){
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
