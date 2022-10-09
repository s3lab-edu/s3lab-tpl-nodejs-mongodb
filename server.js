// third party components
const Express = require('express');
const BodyParser = require('body-parser');
const MethodOverride = require('method-override');
const Console = require("console");
const morgan = require('morgan');
const mongoose = require("mongoose");
const Config = require('./app/configs/gConfig');

let App = Express();

// get all data/stuff of the body (POST) parameters
// parse application/json

App.use(BodyParser.json({
    limit: '5mb'
}));

// parse application/vnd.api + json as json
App.use(BodyParser.json({
    type: 'application/vnd.api+json'
}));

// parse application/x-www-form-urlencoded
App.use(BodyParser.urlencoded({
    limit: '5mb',
    extended: true
}));

App.use(morgan('common'));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
App.use(MethodOverride( 'X-HTTP-Method-Override'));

App.all('/*',[require('./app/middlewares/allowCrossDomain')]);


// Public location

App.use(Express.static(__dirname + 'public'));

// Auth Middleware - This will check if the token is valid
App.all('/v1/auth/*', [require('./app/middlewares/validateRequest')]);

// Route for API
require('./app/routes')(App); // configure our routes

mongoose.connect(Config.mongodb.uri, ()=>{
    console.log('connected to DB');
})

const Port = parseInt(Config.port) + (process.env.NODE_APP_INSTANCE ? parseInt(process.env.NODE_APP_INSTANCE) : 0);

// Create App
// Start App: http:IP_Address:port
App.listen(Port, ()=>{
    Console.log('API started to listening on port %d', Port);
});
