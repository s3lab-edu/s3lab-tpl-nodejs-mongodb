// third party components
let Express = require('express');
let BodyParser = require('body-parser');
let MethodOverride = require('method-override');
let Mongoose = require('mongoose');
let Fs = require('fs');
let Path = require('path');
const Morgan = require('morgan');

// our components
const GConfig = require('./app/configs/gConfig');


let App = Express();

global.CLOUD_API = {};

global.CLOUD_API.AnonymousId = '592d13b838d9f5dcdbc573fe';
global.CLOUD_API.rootPath = __dirname;
global.CLOUD_API.Config = {};
global.CLOUD_API.Config.SDSS_USER_ACTIVATE = false;

// MongoDB Connect
Mongoose.Promise = global.Promise;
Mongoose.connect(GConfig.mongodb.uri);

// log by using morgan
App.use(Morgan('combined'));

// HTTP Logger
let logDir = Path.join(global.CLOUD_API.rootPath, 'logs');
Fs.existsSync(logDir) || Fs.mkdirSync(logDir);

// get all data/stuff of the body (POST) parameters
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

App.all('/*', [require('./app/middlewares/allowCrossDomain')]);

// Public Location
App.use(Express.static(global.CLOUD_API.rootPath + GConfig.paths.public));

// Auth Middleware - This will check if the token is valid
App.all('/v1/auth/*', [require('./app/middlewares/validateRequest')]);

// Routes ==================================================
require('./app/routes')(App); // configure our routes

// Create App
let server = require('http').createServer(App);

// Start App: http://IP_Address:port
server.listen(GConfig.port, function () {
    console.log('API V2.1 started to listening on port %d', GConfig.port);
});

// expose app
module.exports = App;
