/**
 * Created by bioz on 1/13/2017.
 */
// our components
const userService = require('../services/user.service');

module.exports = function (app) {
    /**
     * @api {POST} /v1/users Register
     * @apiVersion 1.0.0
     * @apiName create
     * @apiGroup User
     * @apiPermission Every one
     *
     * @apiDescription Create user or register
     *
     * @apiParam {string} loginName unique name, 6 < character + digit < 64
     * @apiParam {string} displayName the display name of user
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/users
     *
     * @apiSuccess {String} loginName the loginName
     * @apiSuccess {String} displayName set as default = loginName
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": "fdyewyoedfksdkfcdc"
     *       ...
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "code": 4178,
     *       "message": "invalid input"
     *     }
     */
    app.post('/v1/users', userService.create);
    /**
     * @api {GET} /v1/auth/users/:id Get One
     * @apiVersion 1.0.0
     * @apiName getOne
     * @apiGroup User
     * @apiPermission Every type of user
     *
     * @apiDescription Get one user
     *
     * @apiParam {string} id ID of user, on params
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/users/2
     *
     * @apiSuccess {String} id the ID of user
     * @apiSuccess {String} loginName login name of user
     * @apiSuccess {String} displayName display name of user
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data":{
     *              "id": "2",
     *              "loginName": "bioz",
     *              "displayName": "ilovebioz@gmail.com",
     *              ...
     *          },
     *          "result": "ok",
     *          "message" ""
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "result": "fail",
     *       "message": "invalid input"
     *     }
     */
    app.get('/v1/auth/users/:id', userService.getOne);
};
