// Declaración de variables necesarias. 
var express = require ('express');
var app = express();
var mongoose = require ('mongoose');
var port = 1556;
var morgan = require ('morgan');
var bodyParser = require ('body-parser');
var methodOverride = require ('method-override');
var database = require('./config/database.js');
var favicon = require ('serve-favicon');

// Apartado de configuración. 
mongoose.connect (database.url);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// Routes section. 
require ('./app/enterprise/routes/routes.js')(app);
require ('./app/feed/routes/routes.js')(app);

app.listen (port)
console.log ("Listening on port: " + port);
