// third party components
let Express = require('express');
let BodyParser = require('body-parser');
let MethodOverride = require('method-override');
let Mongoose = require('mongoose');
const Morgan = require('morgan');
const cors = require('cors');

let App = Express();
// MongoDB Connect
Mongoose.connect('mongodb+srv://dientv:dientv@cluster0.c4eivn9.mongodb.net/?retryWrites=true&w=majority', ()=>{
    console.log('connected to DB');
});

// log by using morgan
App.use(Morgan('combined'));

// parse application/json
App.use(BodyParser.json({
    limit:'5mb'
}));

// parse application/vnd.api+json as json
App.use(BodyParser.json({
    type: 'application/vnd.api+json'
}));

// parse application/x-www-form-urlencoded
App.use(BodyParser.urlencoded({
    limit:'5mb',
    extended: true
}));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
App.use(MethodOverride('X-HTTP-Method-Override'));

App.use(cors());

// Routes ==================================================
require('./app/route')(App); // configure our routes

// Create App
let server = require('http').createServer(App);

// Start App: http://IP_Address:port
server.listen(3000, function () {
    console.log('API V2.1 started to listening on port %d', 3000);
});

// expose app
module.exports = App;
