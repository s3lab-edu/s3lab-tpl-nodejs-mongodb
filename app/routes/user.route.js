/**
 * Created by bioz on 1/13/2017.
 */
// our components
const userService = require('../services/user.service');

module.exports = function (app) {
    app.get('/v1/users', userService.getAll);
    app.get('/v1/users/:id', userService.getOne);
};
