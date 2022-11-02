/**
 * Created by s3lab. on 1/13/2017.
 */
// third party components
const JsonWebToken = require('jsonwebtoken');


// our components
const GConfig = require('../configs/gConfig');
const UserManager = require('../manager/userMng');
const Rest = require('../utils/restware');

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    let oToken = (req.body && req.body.access_token) || req.headers['access_token'] || (req.query && req.query.access_token);

    if (oToken) {
        try {
            JsonWebToken.verify(oToken, GConfig.authenticationkey, function(error, decoded) {
                if(error){
                    return Rest.sendError(res, 9, 'verify_token_fail', 400,  error);
                }
                UserManager.checkUserValidAvailable(decoded.id, decoded.userRight, decoded.loginName, function (errorCode, errorMessage, httpCode, errorDescription, user) {
                    if (errorCode) {
                        return Rest.sendError(res, errorCode, errorMessage,httpCode,errorDescription);
                    }
                    if (req.method === 'GET') {
                        req.query.accessUserId = decoded.id;
                        req.query.accessUserRight = decoded.userRight;
                        req.query.accessLoginName = decoded.loginName;
                    } else {
                        req.body.accessUserId = decoded.id;
                        req.body.accessUserRight = decoded.userRight;
                        req.body.accessLoginName = decoded.loginName;
                    }
                    next();
                });
            });
        } catch (error) {
            return Rest.sendError(res, 9, 'authentication_fail', 400, error);
        }
    } else {
        return Rest.sendError(res, 9, 'invalid_token', 400, null);
    }
};
