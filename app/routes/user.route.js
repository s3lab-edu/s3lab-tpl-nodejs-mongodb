/**
 * Created by bioz on 1/13/2017.
 */
// our components
const userService = require('../services/user.service');

module.exports = function (app) {
    app.post('/v1/auth/users', userService.create);
    // app.post('/v1/login', oUserCtrl.login);
    app.get('/v1/auth/users/:id', userService.getOne);
    // app.get('/v1/auth/users', oUserCtrl.getAll);
    // app.put('/v1/auth/users/:id', oUserCtrl.update);
    // app.delete('/v1/auth/users/:id', oUserCtrl.delete);
};
