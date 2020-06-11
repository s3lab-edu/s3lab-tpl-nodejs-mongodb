/**
 * Created by bioz on 1/13/2017.
 */
// third party components
const JsonWebToken = require('jsonwebtoken');

// our components
const GConfig = require('../configs/gConfig');
const UserManager = require('../manager/userMng.js');
const Rest = require('../utils/restware');

module.exports = {

    ////// POST

    createByAdmin: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRight = req.body.accessUserRight || '';
        let accessLoginName = req.body.accessLoginName || '';

        let data = req.body || '';

        UserManager.createByAdmin(accessUserId, accessUserRight, accessLoginName, data, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let oResData = {};
            oResData.id = result._id;
            return Rest.sendSuccess(res, oResData, httpCode);
        })
    },



    /////// GET

    getOne: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserRight = req.query.accessUserRight || '';

        let id = req.params.id || '';

        UserManager.getOne(accessUserId, accessUserRight, id, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            return Rest.sendSuccess(res, result, httpCode);
        })
    },

    getAll: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserRight = req.query.accessUserRight || '';
        let query = req.query || '';

        UserManager.getAll(accessUserId, accessUserRight, query, function (errorCode, errorMessage, httpCode, errorDescription, results) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            return Rest.sendSuccess(res, results, httpCode);
        });
    },



    ////// PUT

    update: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRight = req.body.accessUserRight || '';

        let id = req.params.id || '';

        if( id === 'deletes' ){
            let ids = req.body.ids || '';
            UserManager.deleteList(accessUserId, accessUserRight, ids, function (errorCode, errorMessage, httpCode, errorDescription) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccess(res, null, httpCode);
            });
        }else {
            let accessLoginName = req.body.accessLoginName || '';
            let data = req.body || '';
            UserManager.update( accessUserId, accessUserRight, accessLoginName, id, data, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                let oResData = {};
                oResData.id = result._id;
                return Rest.sendSuccess(res, oResData, httpCode);
            });
        }
    },

    updatePassword: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRight = req.body.accessUserRight || '';
        let accessLoginName = req.body.accessLoginName || '';

        let id = req.params.id || '';
        let oldPass = req.body.oldPass || '';
        let newPass = req.body.newPass || '';

        UserManager.updatePassword( accessUserId, accessUserRight, accessLoginName, id, oldPass, newPass, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }

            JsonWebToken.sign({ id: result._id, loginName: result.loginName, email: result.email, userRight: result.userRight }, GConfig.authenticationkey, { expiresIn: '25 days' }, function(error, token) {
                if(error)
                {
                    return Rest.sendError( res, 1, 'create_token_error', 400, error );
                }else{
                    let oResData = {};
                    oResData.id = result._id;
                    oResData.token = token;
                    return Rest.sendSuccess(res, oResData, httpCode);
                }
            });
        });
    },


    ////// DELETE

    delete: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserRight = req.body.accessUserRight || '';
        let id = req.params.id || '';

        UserManager.delete( accessUserId, accessUserRight, id, function (errorCode, errorMessage, httpCode, errorDescription) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let oResData = {};
            oResData.id = id;
            return Rest.sendSuccess(res, oResData, httpCode);
        });
    },

    login: function (req, res) {
        let loginName = req.body.loginName || '';
        let password = req.body.password || '';

        UserManager.authenticate(loginName, password, function (errorCode, errorMessage, httpCode, errorDescription, user) {
            if (errorCode) {
                return Rest.sendError( res, errorCode, errorMessage, httpCode, errorDescription );
            }
            JsonWebToken.sign({ id: user._id, loginName: user.loginName, email: user.email, userRight: user.userRight }, GConfig.authenticationkey, { expiresIn: '25 days' }, function(error, token) {
                if(error)
                {
                    return Rest.sendError( res, 1, 'create_token_error', 400, error );
                }else{
                    return Rest.sendSuccessToken(res, token, user);
                }
            });
        });
    },

    loginGoogle: function (req, res) {
        let idToken = req.body.idToken || '';
        const {OAuth2Client} = require('google-auth-library');

        let oAuth2Client = new OAuth2Client(GConfig.socialNetwork.google.key, GConfig.socialNetwork.google.secret, '');
        oAuth2Client.verifyIdToken({idToken:idToken, audience: GConfig.socialNetwork.google.key}, function(error, result) {
            if (error) {
                return Rest.sendError( res, 1, 'verify_google_id_token_error', 401, error );
            }

            if(result){
                let payload = result.getPayload();
                UserManager.loginGoogle(payload, function (errorCode, errorMessage, httpCode, errorDescription, token, user) {
                    if(errorCode){
                        return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                    }
                    return Rest.sendSuccessToken(res, token, user);
                });
            }else{
                return Rest.sendError( res, 1, 'verify_google_id_token_fail', 401, null );
            }
        });
    }
};
