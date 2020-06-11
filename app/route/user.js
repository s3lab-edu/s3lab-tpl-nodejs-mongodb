/**
 * Created by bioz on 1/13/2017.
 */
// our components
const oUserCtrl = require('../controllers/userCtrl');

module.exports = function (app) {
    /**
     * @api {POST} /v1/auth/users Create One
     * @apiVersion 1.0.0
     * @apiName createByAdmin
     * @apiGroup User
     * @apiPermission just administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Create user by admin or moderator
     *
     * @apiParam {string} loginName a unique string with 6 <= length <= 64
     * @apiParam {string} email unique email
     * @apiParam {String} password a string with 6 <= length <= 64
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/users
     *
     * @apiSuccess {String} id the ID of created user
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data":{
     *           "id": "abc"
     *       },
     *       "result": "ok",
     *       "message": "",
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "result": "fail",
     *       "message": "",
     *     }
     */
    app.post('/v1/auth/users', oUserCtrl.createByAdmin);
    /**
     * @api {POST} /v1/login Login
     * @apiVersion 1.0.0
     * @apiName login
     * @apiGroup User
     * @apiPermission Every one
     *
     * @apiDescription login and get access token
     *
     * @apiParam {string} loginName a string with length <= 64
     * @apiParam {String} password a string with 4 < length < 64
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/login
     *
     * @apiSuccess {object} data the user data with token
     * @apiSuccess {String} result ok or fail
     * @apiSuccess {String} message something from server
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data":{
     *          "token": "abc",
     *          "id":2,
     *          "loginName": "bioz",
     *          "displayName": "bioz",
     *          "email": ilovebioz@gmail.com
     *       },
     *       "result": "ok",
     *       "message":""
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "result": "fail",
     *       "message": "invalid input"
     *     }
     */
    app.post('/v1/login', oUserCtrl.login);
    app.post('/v1/login_google', oUserCtrl.loginGoogle);
    /**
     * @api {GET} /v1/auth/users/:id Get One
     * @apiVersion 1.0.0
     * @apiName getOne
     * @apiGroup User
     * @apiPermission Every type of user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get one user
     *
     * @apiParam {string} id ID of user, on params
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/users/2
     *
     * @apiSuccess {String} id the ID of group
     * @apiSuccess {String} loginName login name of user
     * @apiSuccess {String} displayName display name of user
     * @apiSuccess {String} email email of user
     * @apiSuccess {String} firstName first name of user
     * @apiSuccess {String} lastName last name of user
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data":{
     *              "id": "2",
     *              "loginName": "bioz",
     *              "email": "ilovebioz@gmail.com",
     *              "activated": "1",
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
    app.get('/v1/auth/users/:id', oUserCtrl.getOne);
    /**
     * @api {GET} /v1/auth/users Get List
     * @apiVersion 1.0.0
     * @apiName getAll
     * @apiGroup User
     * @apiPermission administrator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get all users
     *
     * @apiParam {Number} page Page which we want to get (N/A)
     * @apiParam {Number} perPage Item per page (N/A)
     * @apiParam {String} sort Sort the list by a field (N/A)
     * @apiParam {String} filter filter the query data (N/A)
     * @apiParam {String} q Text filter for data (N/A)
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/users
     *
     * @apiSuccess {Object[]} data the list of data
     * @apiSuccess {Object} items {begin, end, total}
     * @apiSuccess {Object} pages {current, prev, hasPrev, next, hasNext, total}
     * @apiSuccess {String} result ok or fail
     * @apiSuccess {String} message something from server
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data": [...],
     *       "items": {"begin": 1, "end": 3, "total": 5},
     *       "pages": {"current": 1, "prev": 3, "hasPrev": true, "next": 5, "hasNext": true, "total": 56},
     *       "result": "ok",
     *       "message": ""
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
    app.get('/v1/auth/users', oUserCtrl.getAll);
    /**
     * @api {PUT} /v1/auth/users/:id Update One
     * @apiVersion 1.0.0
     * @apiName update
     * @apiGroup User
     * @apiPermission Every type of user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update user information
     *
     * @apiParam {String} id ID of user, on params
     * @apiParam {String} loginName login name of user
     * @apiParam {String} email email of user
     * @apiParam {String} firstName first name of user
     * @apiParam {String} lastName last name of user
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/users/2
     *
     * @apiSuccess {String} id the ID of updated user
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data":{
     *              "id": "2"
     *          },
     *          "result":"ok",
     *          "message":""
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "result":"fail",
     *       "message": "invalid input"
     *     }
     */
    app.put('/v1/auth/users/:id', oUserCtrl.update);
    app.put('/v1/auth/users/deletes', oUserCtrl.update);
    app.put('/v1/auth/users/:id/password', oUserCtrl.updatePassword);
    /**
     * @api {DELETE} /v1/auth/users/:id Delete One
     * @apiVersion 1.0.0
     * @apiName delete
     * @apiGroup User
     * @apiPermission just admin user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription delete user
     *
     * @apiParam {String} id ID of user
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/users/2
     *
     * @apiSuccess {String} id Id of deleted user
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data":{
     *              "id": "2"
     *          },
     *          "result":"ok",
     *          "message":""
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "result":"fail",
     *       "message": "invalid input"
     *     }
     */
    app.delete('/v1/auth/users/:id', oUserCtrl.delete);
};