var bodyParser = require('body-parser');
var express = require('express');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine','ejs');
require('dotenv').config();

var mongo = require('mongodb').MongoClient;
var mongoClient;

const PORT = process.env.PORT || 5000;
const user = encodeURIComponent( process.env.DBUSER );
const pass = encodeURIComponent( process.env.DBPASS );
var dbConStr = "mongodb+srv://root:root@cluster0-wj5pi.mongodb.net/appRestaurant";

mongo.connect( dbConStr, function( err, _client )  {
  if( err ) throw err;
  mongoClient = _client;
  app.listen(PORT, function(){
    console.log('Exameple app listening on port 5000');
  });
});

app.get('/', function (req, res) {
    var db = mongoClient.db("appRestaurant");
    var opcions = {};
    var query = {};
    db.collection('restaurantes').find( query, opcions ).toArray(function( err, docs ) {
        if( err ) {
            res.render( 'error', {msg:"error a la query"} );
            return;
        }
        res.render( 'showRestaurants', {"restaurantes":docs} );
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
  var db = mongoClient.db("appRestaurant");
  var myobj = {nombre:inputName,categoria:inputCategory,codigo_postal:inputZipCode,telefono:inputPhone};
  db.collection("restaurantes").insertOne(myobj, function(err, res){
    if (err) throw err;
    console.log("1 document inserted");
    
    //db.close();
  });
});
