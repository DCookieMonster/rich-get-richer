var express = require('express');
var app = express();
var http = require('http');
var request = require("request");
/* GET users listing. */
var bodyParser = require('body-parser');

//app.use(express.bodyParser());
var json2csv = require('json2csv');


//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/songs';
//var url = 'mongodb:///q2a.ise.bgu.ac.il:27017/planner';

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/csv', function(request, response) {
  var results=[];
  var csvFile="";
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);

      // Get the documents collection
      var collection = db.collection('songs_logs');


      // Insert some users
      collection.find({}).toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else {
          //console.log('Inserted %d documents into the "planner" collection. The documents inserted with "_id" are:', result.length, result);
          results=result;
          db.close();
          json2csv({ data: results }, function(err, csv) {
            if (err) console.log(err);
            console.log(csv);
            response.setHeader('Content-disposition', 'attachment; filename=testing.csv');
            response.set('Content-Type', 'text/csv');
            response.status(200).send(csv);          });
        }
        //Close connection
        db.close();
      });
    }
  });

});




app.get('/results', function(request, response) {
  var results=[]
  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);

      // Get the documents collection
      var collection = db.collection('logger');


      // Insert some users
      collection.find({}).toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else {
          //console.log('Inserted %d documents into the "planner" collection. The documents inserted with "_id" are:', result.length, result);
          results=result;
          db.close();
          response.render('pages/db', {
            results:results
          });
        }
        //Close connection
        db.close();
      });
    }
  });

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



var quotes = [
  { author : 'http://www.nejm.org/doi/full/10.1056/NEJMsa060247', text : "Nothing is impossible, the word itself says 'I'm possible'!"},
  { author : 'http://www.nejm.org/doi/full/10.1056/NEJMsa060247', text : "You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you"},
  { author : 'Unknown', text : "Even the greatest was once a beginner. Don't be afraid to take that first step."}];


app.get('/test', function(req, res) {
  res.json(quotes);
});


app.get('/removeAll', function (req, res) {
  // Use connect method to connect to the Server
  //var url = require('url');
  //var url_parts = url.parse(request.url, true);
  //var query = url_parts.query;
  if (req.query.password != "9670") {
    res.json({result: "wrong pass"})
    return;
  }
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);

      // Get the documents collection
      var collection = db.collection('songs_logs');


      // Insert some users
      collection.deleteMany({}, function (err, results) {
        if (err) {
          console.log(err);
          res.json({result: "error"})
        } else {
          //console.log('Inserted %d documents into the "planner" collection. The documents inserted with "_id" are:', result.length, result);
          res.json({result: results})

        }
        //Close connection
      });
    }
  });
});



app.post('/json', function(req, res) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);

      // Get the documents collection
      var collection = db.collection('songs_logs');


      // Insert some users
      collection.insert(req.body, function (err, result) {
        if (err) {
          console.log(err);
          res.json({result: "error"})
        } else {
          //console.log('Inserted %d documents into the "planner" collection. The documents inserted with "_id" are:', result.length, result);
          res.json({result: "OK"})

        }
        //Close connection
        db.close();
      });
    }
  });
});


app.get('/all', function(req, res) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);

      // Get the documents collection
      var collection = db.collection('songs_logs');


      // Insert some users
      collection.find({}).toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else {
          //console.log('Inserted %d documents into the "planner" collection. The documents inserted with "_id" are:', result.length, result);
          res.json(result)
        }
        //Close connection
        db.close();
      });
    }
  });
});
