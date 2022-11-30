// third party components
let Express = require('express');
let BodyParser = require('body-parser');
let MethodOverride = require('method-override');
const cors = require('cors');

let App = Express();

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

// support CORS from API
App.use(cors());

// Routes ==================================================
App.get('/v1/users/:id', (req, res) => {
    let id = req.params.id || '';
    res.send('Hello World: ' + id);
});

App.get('/v1/users', (req, res) => {
    const out = { message: 'helloWorld!'};
    res.status(200);
    res.contentType('json');
    return res.json(out);
});

// Create App
let server = require('http').createServer(App);

// Start App: http://IP_Address:port
server.listen(3000, function () {
    console.log('API V2.1 started to listening on port %d', 3000);
});

// expose app
module.exports = App;
