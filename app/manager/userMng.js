/**
 * Created by bioz on 1/13/2017.
 */
// third party components
const BCrypt = require('bcryptjs');
const Validator = require('validator');
const JsonWebToken = require('jsonwebtoken');

// our components
const Constant = require('../configs/constant');
const User = require('../models/user');

const GConfig = require('../configs/gConfig');
const Pieces = require('../utils/pieces');

module.exports = {

    /////// GET

    getOne: function(accessUserId, accessUserRight, userId, callback) {
        try {
            if ( !Pieces.VariableBaseTypeChecking(userId,'string')
                    || !Validator.isMongoId(userId) ) {
                return callback(8, 'invalid_id', 400, 'user id is not a mongo id string', null);
            }

            if ( (accessUserId !== userId)
                    && (Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserRight) < 0) ) {
                return callback(8, 'invalid_right', 403, null, null);

            }

            let query = {};
            let options = {'password': 0, 'resetPasswordToken': 0, 'updater': 0};
            let userRightIdx = Constant.USER_RIGHT_ENUM.indexOf(accessUserRight);
            let lowerUserRightList=[];
            if(userRightIdx > 0){
                lowerUserRightList = Constant.USER_RIGHT_ENUM.slice(0, userRightIdx);
            }

            if(accessUserId !== userId) {
                query.userRight = {$in: lowerUserRightList};
            }
            query._id = userId;

            User.findOne(query, options, function (error, user) {
                if (error) {
                    return callback(8, 'find_fail', 420, error, null);
                }

                if(!user){
                    return callback(8, 'unavailable', 404, null, null);
                }else{
                    return callback(null, null, 200, null, user);
                }
            });
        }catch(error){
            return callback(8, 'get_fail', 400, error, null);
        }
    },

    getAll: function(accessUserId, accessUserRight, queryContent, callback){
        try {
            if ( (Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserRight) < 0) ) {
                return callback(8, 'invalid_right', 400, null, null);
            }

            let condition = {};
            let userRightIdx = Constant.USER_RIGHT_ENUM.indexOf(accessUserRight);
            let lowerUserRightList=[];
            if(userRightIdx > 0){
                lowerUserRightList = Constant.USER_RIGHT_ENUM.slice(0, userRightIdx);
            }

            let statusWithoutDel = Constant.STATUS_ENUM.slice(0, Constant.STATUS_ENUM.length);
            statusWithoutDel.splice(2,1);

            condition.userRight = {$in: lowerUserRightList };

            this.parseFilter(accessUserId, accessUserRight, condition, queryContent.filter);
            if( Pieces.VariableBaseTypeChecking(queryContent.q, 'string') ){
                condition['$text'] = {$search: queryContent.q};
            }

            let options = {};
            options.criteria = condition;
            options.keys = {'password': 0, 'resetPasswordToken': 0};

            User.pagedFind(options, queryContent, function (error, results) {
                if (error) {
                    return callback(8, 'finds_fail', 420, error, null);
                }
                return callback(null, null, 200, null, results);
            });
        }catch(error){
            return callback(8, 'gets_fail', 400, error, null);
        }
    },



    ////// UPDATE

    update: function (accessUserId, accessUserRight, accessLoginName, userId, updateData, callback) {
        try {
            if (!Pieces.VariableBaseTypeChecking(userId,'string')
                    || !Validator.isMongoId(userId)) {
                return callback(8, 'invalid_id', 400,'user id is not a mongo id string', null);
            }

            if ( accessUserId !== userId
                    && Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserRight) < 0 ) {
                return callback(8, 'invalid_right', 403, null, null);
            }

            /////////////////////
            let query = {};
            let userRightIdx = Constant.USER_RIGHT_ENUM.indexOf(accessUserRight);
            let lowerUserRightList=[];
            if( userRightIdx > 0 ){
                lowerUserRightList = Constant.USER_RIGHT_ENUM.slice(0, userRightIdx);
            }

            if(accessUserId !== userId) {
                query.userRight = {$in: lowerUserRightList};
            }
            query._id = userId;


            //////////////////////
            let update = {};

            update.updater=accessUserId;

            if ( Pieces.VariableBaseTypeChecking(updateData.loginName, 'string')
                    && Validator.isAlphanumeric(updateData.loginName)
                    && Validator.isLowercase(updateData.loginName)
                    && Validator.isLength(updateData.loginName, {min: 4, max: 64}) ) {
                update.loginName = updateData.loginName;
            }

            if ( Pieces.VariableBaseTypeChecking(updateData.displayName, 'string')
                    && Validator.isLength(updateData.displayName, {min: 4, max: 64}) ) {
                update.displayName = updateData.displayName;
            }

            if (Pieces.VariableBaseTypeChecking(updateData.avatarUrl, 'string')) {
                update.avatarUrl = updateData.avatarUrl;
            }

            if (Pieces.VariableBaseTypeChecking(updateData.group,'string')
                && Validator.isMongoId(updateData.group)) {
                update.group = updateData.group;
            }

            if ( Pieces.VariableBaseTypeChecking(updateData.password, 'string')
                    && Validator.isLength(updateData.password, {min: 4, max: 64}) ) {
                update.password = BCrypt.hashSync(updateData.password, 10);
            }

            if (Pieces.VariableBaseTypeChecking(updateData.email, 'string')
                    && Validator.isEmail(updateData.email)) {
                update.email = updateData.email;
            }

            if ( (Pieces.VariableBaseTypeChecking(updateData.eCoinX, 'string') && Validator.isInt(updateData.eCoinX))
                    || (Pieces.VariableBaseTypeChecking(updateData.eCoinX, 'number')) ) {
                update.eCoinX = updateData.eCoinX;
            }

            if ( (Pieces.VariableBaseTypeChecking(updateData.eCoinF, 'string') && Validator.isInt(updateData.eCoinF))
                    || (Pieces.VariableBaseTypeChecking(updateData.eCoinF, 'number')) ) {
                update.eCoinF = updateData.eCoinF;
            }

            if ( (Pieces.VariableBaseTypeChecking(updateData.grade, 'string') && Validator.isInt(updateData.grade))
                    || (Pieces.VariableBaseTypeChecking(updateData.grade, 'number')) ) {
                update.grade = updateData.grade;
            }

            if(Pieces.VariableEnumChecking(updateData.status, Constant.STATUS_ENUM)){
                update.status = updateData.status;
            }

            if(Pieces.VariableEnumChecking(updateData.userRight, Constant.USER_RIGHT_ENUM)){
                update.userRight = updateData.userRight;
            }

            /// User profile
            update.profile = {};
            if(Pieces.VariableBaseTypeChecking(updateData.socialId, 'string')){
                update.profile.socialId = updateData.socialId;
            }

            if( Pieces.VariableBaseTypeChecking(updateData.givenName, 'string')
                    && Validator.isLength(updateData.givenName, {min: 1, max: 32}) ){
                update.profile.givenName = updateData.givenName;
            }

            if( Pieces.VariableBaseTypeChecking(updateData.lastName, 'string')
                    && Validator.isLength(updateData.lastName, {min: 1, max: 32}) ){
                update.profile.lastName = updateData.lastName;
            }

            if( Pieces.VariableBaseTypeChecking(updateData.nationality, 'string')
                    && Validator.isLength(updateData.nationality, {min: 1, max: 64}) ){
                update.profile.nationality = updateData.nationality;
            }

            if( Pieces.VariableBaseTypeChecking(updateData.address, 'string')
                    && Validator.isLength(updateData.address, {min: 0, max: 128}) ){
                update.profile.address = updateData.address;
            }

            if( Pieces.VariableBaseTypeChecking(updateData.birthday, 'string')
                    && Validator.isISO8601(updateData.birthday) ){
                update.profile.birthday = updateData.birthday;
            }

            if( Pieces.VariableBaseTypeChecking(updateData.website, 'string')
                    && Validator.isLength(updateData.website, {min: 0, max: 128}) ){
                update.profile.website = updateData.website;
            }

            if( Pieces.VariableBaseTypeChecking(updateData.language, 'string')
                    && Validator.isLength(updateData.language, {min: 2, max: 2}) ){
                update.profile.language = updateData.language;
            }


            let options = {
                upsert: false,
                new: true,
                setDefaultsOnInsert: true,
                projection: {password: false, socialNetwork: false}
            };

            User.findOneAndUpdate(query, update, options, function (error, user) {
                if (error) {
                    return callback(8, 'find_update_fail', 420, error, null);
                }

                if(user){
                    return callback(null, null, 200, null, user);
                }else{
                    return callback(8, 'unavailable', 400, null, null);
                }
            });
        }catch(error){
            return callback(8, 'update_fail', 400, error, null);
        }
    },

    updatePassword: function (accessUserId, accessUserRight, accessLoginName, loginName, oldPassword, newPassword, callback) {
        try {
            if (!Pieces.VariableBaseTypeChecking(loginName,'string')) {
                return callback(8, 'invalid_login_name', 400, 'loginName is empty', null);
            }

            let query = {};

            if ( accessLoginName !== loginName
                    && Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserRight) < 0 ) {
                return callback(8, 'invalid_right', 403, null, null);
            }else if ( accessLoginName === loginName ){
                if ( Pieces.VariableBaseTypeChecking( oldPassword, 'string' )
                        && Validator.isLength( oldPassword, {min: 4, max: 64}) ) {
                    query.password  = oldPassword;
                }else{
                    return callback(8, 'invalid_old_password', 400, 'old password in empty or over length', null);
                }
            }


            /////////////////////
            let userRightIdx = Constant.USER_RIGHT_ENUM.indexOf(accessUserRight);
            let lowerUserRightList=[];
            if( userRightIdx > 0 ){
                lowerUserRightList = Constant.USER_RIGHT_ENUM.slice(0, userRightIdx);
            }

            if(accessLoginName !== loginName) {
                query.userRight = {$in: lowerUserRightList};
            }
            query.loginName = loginName;

            //////////////////////
            let update = {};

            update.updater = accessUserId;

            if ( Pieces.VariableBaseTypeChecking(newPassword, 'string')
                && Validator.isLength(newPassword, {min: 4, max: 64}) ) {
                let hashOfNewPass = BCrypt.hashSync(newPassword, 10);
                update.password = hashOfNewPass;
            }else{
                return callback(8, 'invalid_new_password', 400, 'new password is empty or over length', null);
            }


            let options = {
                upsert: false,
                new: true,
                setDefaultsOnInsert: true,
                projection: {password: false, socialNetwork: false}
            };

            if(accessLoginName === loginName) {
                this.authenticate(query.loginName, query.password, function (errorCode, errorMessage, httpCode, errorDescription, user) {
                    if (errorCode) {
                        return callback(errorCode, errorMessage, httpCode, null);
                    }
                    user.password = hashOfNewPass;
                    user.save(function (error) {
                        if (error) {
                            return callback(8, 'save_fail', 420, error, null);
                        }
                        return callback(null, null, 200, null, user);
                    });
                });
            }else{
                User.findOneAndUpdate(query, update, options, function (error, user) {
                    if (error) {
                        return callback(8, 'find_update_fail', 420, error, null);
                    }
                    if(user){
                        return callback(null, null, 200, null, user);
                    }else{
                        return callback(8, 'unavailable', 404, null, null);
                    }
                });
            }
        }catch(error){
            return callback(8, 'update_password_fail', 400, error, null);
        }
    },



    ////// DELETE

    delete: function(accessUserId, accessUserRight, userId, callback) {
        try {
            if (!Pieces.VariableBaseTypeChecking(userId,'string')
                    || !Validator.isMongoId(userId)) {
                return callback(8, 'invalid_id', 400, 'user id is not a mongo id string');
            }

            if(Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserRight) < 0){
                return callback(8, 'invalid_right', 403, null);
            }

            let userRightIdx = Constant.USER_RIGHT_ENUM.indexOf(accessUserRight);
            let lowerUserRightList=[];
            if(userRightIdx > 0){
                lowerUserRightList = Constant.USER_RIGHT_ENUM.slice(0, userRightIdx);
            }

            let query = {_id: userId, userRight: {$in: lowerUserRightList}};
            let update = {status: Constant.STATUS_ENUM[2]};
            let options = {upsert: false, new: false, setDefaultsOnInsert: true};

            User.findOneAndUpdate(query, update, options, function (error, user) {
                if (error) {
                    return callback(8, 'find_update_fail', 420, error);
                } else {
                    if ( user && user.status === Constant.STATUS_ENUM[2] ){
                        user.remove(function(error) {
                            if(error){
                                return callback(8, 'remove_fail', 420, error);
                            }
                            return callback(null, null, 200, null);
                        });
                    }else {
                        return callback(null, null, 200, null);
                    }
                }
            });
        }catch(error){
            return callback(8, 'delete_fail', 400, error);
        }
    },

    deleteList: function (accessUserId, accessUserRight, idList, callback) {
        try {
            if ( !Pieces.VariableBaseTypeChecking(idList,'string')
                    || !Validator.isJSON(idList) ) {
                return callback(8, 'invalid_ids', 400, 'user id list is not a json array string');
            }
            if(Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserRight) < 0){
                return callback(8, 'invalid_right', 403, null);
            }

            let userRightIdx = Constant.USER_RIGHT_ENUM.indexOf(accessUserRight);
            let lowerUserRightList=[];
            if(userRightIdx > 0){
                lowerUserRightList = Constant.USER_RIGHT_ENUM.slice(0, userRightIdx);
            }

            let idLists = Pieces.safelyParseJSON(idList);
            let query = {_id: {$in: idLists}, userRight: {$in: lowerUserRightList}};

            let update = {status: Constant.STATUS_ENUM[2]};

            User.update(query, update, {multi: true}, function (error, updatedCount) {
                if (error) {
                    return callback(8, 'update_fail', 420, error);
                }else {
                    if ( updatedCount && (updatedCount.n > 0) ) {
                        return callback(null, null, 200, null);
                    } else {
                        return callback(8, 'unavailable', 404, null);
                    }
                }
            });
        }catch(error){
            return callback(8, 'deletes_fail', 400, error);
        }
    },


    authenticate: function (loginName, password, callback) {
        try {
            if (!Pieces.VariableBaseTypeChecking(loginName,'string') ) {
                return callback(8, 'invalid_login_name', 422, 'loginName is not a string', null);
            }

            if (!Pieces.VariableBaseTypeChecking(password,'string')) {
                return callback(8, 'invalid_password', 422, 'password is not a string', null);
            }

            User.findOne( {loginName: loginName, status: Constant.STATUS_ENUM[0], isEmailVerify: true}, function (error, user) {
                if (error) {
                    return callback(8, 'find_fail', 420, error, null);
                }

                if (user) {
                    BCrypt.compare(password, user.password, function (error, result) {
                        if (result === true) {
                            return callback(null, null, 200, null, user);
                        } else {
                            return callback(8, 'incorrect_password', 422, null, null);
                        }
                    });
                } else {
                    return callback(8, 'unavailable', 404, null, null);
                }
            });
        }catch(error){
            return callback(8, 'authenticate_fail', 400, error, null);
        }
    },

    checkUserValidAvailable: function (accessUserId, accessUserRight, accessLoginName, callback) {
        try {
            if ( !Pieces.VariableBaseTypeChecking(accessUserId,'string')
                    || !Validator.isMongoId(accessUserId)
                    || !Pieces.VariableBaseTypeChecking(accessUserRight,'string')
                    || !Pieces.VariableBaseTypeChecking(accessLoginName,'string') ) {
                return callback(8, 'invalid_data', 400, 'user information is incorrect', null);
            }

            User.findOne({loginName: accessLoginName, _id: accessUserId, userRight: accessUserRight, status: Constant.STATUS_ENUM[0]}, function (error, user) {
                if (error) {
                    return callback(8, 'find_fail', 420, error, null);
                }

                if(user){
                    return callback(null, null, 200, null, user);
                }else{
                    return callback(8, 'unavailable', 404, 'has no user match to your condition', null);
                }
            });
        }catch(error){
            return callback(8, 'check_valid_available_fail', 400, error, null);
        }
    },

    createByAdmin: function(accessUserId, accessUserRight, accessLoginName, userData, callback){
        try {
            if (Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserRight) < 0 ) {
                return callback(8, 'invalid_right', 403, 'you must be admin to do this process', null);
            }

            if ( !Pieces.VariableBaseTypeChecking(userData.loginName, 'string')
                    || !Validator.isAlphanumeric(userData.loginName)
                    || !Validator.isLowercase(userData.loginName)
                    || !Validator.isLength(userData.loginName, {min: 4, max: 128}) ) {
                return callback(8, 'invalid_loginName', 400, 'login name should be alphanumeric, lowercase and length 4-128', null);
            }

            if ( !Pieces.VariableBaseTypeChecking(userData.password, 'string') ) {
                return callback(8, 'invalid_password', 400,'password is not a string', null);
            }

            if ( !Pieces.VariableBaseTypeChecking(userData.email, 'string')
                    || !Validator.isEmail(userData.email) ) {
                return callback(8, 'invalid_email', 400, 'email is incorrect format', null);
            }

            let oNewUser = new User();

            let hashOfPass = BCrypt.hashSync(userData.password, 10);
            oNewUser.loginName = userData.loginName;
            oNewUser.email = userData.email;
            oNewUser.password = hashOfPass;

            if (Pieces.VariableEnumChecking(userData.status, Constant.STATUS_ENUM)) {
                oNewUser.status = userData.status;
            }else{
                oNewUser.status = Constant.STATUS_ENUM[0];
            }

            if (Pieces.VariableEnumChecking(userData.userRight, Constant.USER_RIGHT_ENUM)) {
                if(Constant.USER_RIGHT_ENUM.indexOf(accessUserRight) <= Constant.USER_RIGHT_ENUM.indexOf(userData.userRight)){
                    return callback(8, 'invalid_right', 403, 'you have no right to do this', null);
                }

                oNewUser.userRight = userData.userRight;
            }

            if (Pieces.VariableBaseTypeChecking(userData.displayName, 'string')) {
                oNewUser.displayName = userData.displayName;
            }else{
                oNewUser.displayName = userData.loginName;
            }

            oNewUser.creator = accessUserId;
            oNewUser.updater = accessUserId;

            oNewUser.save(function (error) {
                if (error) {
                    return callback(8, 'save_fail', 420, error, null);
                }
                return callback(null, null, 200, null, oNewUser);
            });
        }catch(error){
            return callback(8, 'create_by_admin_fail', 400, error, null);
        }
    },


    loginGoogle: function (ggProfile, callback){
        try {
            let query = {
                $or:[
                    {'socialNetwork.googleId': ggProfile.sub},
                    {'socialNetwork.googleEmail': ggProfile.email}
                ]
            };
            User.findOne(query, function (error, user) {
                if(error){
                    return callback(8, 'find_fail', 420, error, null, null);
                }
                if (user) {
                    if(user.status === Constant.STATUS_ENUM[0]){
                        JsonWebToken.sign( { id: user._id, loginName: user.loginName, displayName: user.displayName,
                            avatarUrl: user.avatarUrl, email: user.email, userRight: user.userRight }, GConfig.authenticationkey, { expiresIn: '23h' }, function(error, token) {
                            if(error)
                            {
                                return callback(8,'create_token_fail', 400, error, null, null);
                            }else{
                                return callback(null, null, 200, null, token, user);
                            }
                        });
                    }else{
                        return callback(8,'invalid_status', 401,null, null, null);
                    }
                }else {
                    let oNewUser = new User();
                    oNewUser.socialNetwork.googleId = ggProfile.sub;
                    oNewUser.socialNetwork.googleEmail = ggProfile.email;
                    oNewUser.socialNetwork.googleName = ggProfile.name;
                    oNewUser.socialNetwork.email = ggProfile.email;
                    oNewUser.socialNetwork.googleAvatarUrl = ggProfile.picture;
                    oNewUser.displayName = ggProfile.name;
                    oNewUser.loginName = ggProfile.sub;
                    oNewUser.email = ggProfile.email;
                    oNewUser.isEmailVerify = true;

                    if (global.CLOUD_API.Config.SDSS_USER_ACTIVATE === false) {
                        oNewUser.status = 'ACTIVATED';
                    }

                    if (global.CLOUD_API.AnonymousId) {
                        oNewUser.creator = global.CLOUD_API.AnonymousId;
                        oNewUser.updater = global.CLOUD_API.AnonymousId;
                    }

                    let newPassword = Pieces.genRandomString(8);
                    oNewUser.password = BCrypt.hashSync(newPassword, 10);

                    oNewUser.save(function (error, user) {
                        if (error) {
                            return callback(8, 'save_fail', 420, error, null, null);
                        } else {
                            if (user) {
                                if(user.status === Constant.STATUS_ENUM[0]){
                                    JsonWebToken.sign({
                                        id: user._id, loginName: user.loginName, displayName: user.displayName,
                                        email: user.email, avatarUrl: user.avatarUrl, userRight: user.userRight
                                    }, GConfig.authenticationkey, {expiresIn: '23h'}, function (error, token) {
                                        if (error) {
                                            return callback(8,'create_token_fail', 400, error, null, null);
                                        } else {
                                            return callback(null, null, 200, null, token, user);
                                        }
                                    });
                                }else{
                                    return callback(8,'invalid_status', 401,'', null, null);
                                }
                            } else {
                                return callback(8, 'save_fail', 420, null, null, null);
                            }
                        }
                    });
                }
            });
        }catch(error){
            return callback(8, 'login_google_fail', 400, error, null, null);
        }
    },

    // --------- others ----------
    parseFilter: function (accessUserId, accessUserRight, condition, filters) {
        try {
            if ( !Pieces.VariableBaseTypeChecking(filters,'string')
                || !Validator.isJSON(filters) ) {
                return false;
            }

            let aDataFilter = Pieces.safelyParseJSON1(filters);
            if( aDataFilter && (aDataFilter.length > 0) ){
                for(let i = 0; i < aDataFilter.length; i++ ){
                    if ( !Pieces.VariableBaseTypeChecking(aDataFilter[i].key, 'string')
                        || !Pieces.VariableBaseTypeChecking(aDataFilter[i].operator, 'string')
                        || aDataFilter[i].value === null
                        || aDataFilter[i].value === undefined ){
                        continue;
                    }

                    if ( aDataFilter[i].key === 'isAlive'
                        && ( (aDataFilter[i].operator === '=') || (aDataFilter[i].operator === '!=') )
                        && Pieces.VariableBaseTypeChecking(aDataFilter[i].value, 'boolean') ) {
                        switch(aDataFilter[i].operator){
                            case '=':
                                condition[aDataFilter[i].key] = aDataFilter[i].value;
                                break;
                            case '!=':
                                condition[aDataFilter[i].key] = {$ne: aDataFilter[i].value};
                                break;
                        }
                        continue;
                    }

                    if ( aDataFilter[i].key === 'status'
                        && ( (aDataFilter[i].operator === '=') || (aDataFilter[i].operator === '!=') )
                        && Pieces.VariableEnumChecking(aDataFilter[i].value, Constant.STATUS_ENUM) ) {
                        switch(aDataFilter[i].operator){
                            case '=':
                                condition[aDataFilter[i].key] = aDataFilter[i].value;
                                break;
                            case '!=':
                                condition[aDataFilter[i].key] = {$ne: aDataFilter[i].value};
                                break;
                        }
                        continue;
                    }

                    if ( aDataFilter[i].key === 'createdAt'
                        && ( (aDataFilter[i].operator === '=') || (aDataFilter[i].operator === '!=')
                            || (aDataFilter[i].operator === '<') || (aDataFilter[i].operator === '>')
                            || (aDataFilter[i].operator === '<=') || (aDataFilter[i].operator === '>=')
                            || (aDataFilter[i].operator === 'in'))
                    ) {
                        if( aDataFilter[i].operator !== 'in'
                            && Pieces.VariableBaseTypeChecking(aDataFilter[i].value, 'string')
                            && Validator.isISO8601(aDataFilter[i].value) ){
                            switch(aDataFilter[i].operator){
                                case '=':
                                    condition[aDataFilter[i].key] = {$eq: aDataFilter[i].value};
                                    break;
                                case '!=':
                                    condition[aDataFilter[i].key] = {$ne: aDataFilter[i].value};
                                    break;
                                case '>':
                                    condition[aDataFilter[i].key] = {$gt: aDataFilter[i].value};
                                    break;
                                case '>=':
                                    condition[aDataFilter[i].key] = {$gte: aDataFilter[i].value};
                                    break;
                                case '<':
                                    condition[aDataFilter[i].key] = {$lt: aDataFilter[i].value};
                                    break;
                                case '<=':
                                    condition[aDataFilter[i].key] = {$lte: aDataFilter[i].value};
                                    break;
                            }
                        }else if(aDataFilter[i].operator === 'in'){
                            if(aDataFilter[i].value.length === 2
                                && Pieces.VariableBaseTypeChecking(aDataFilter[i].value[0], 'string')
                                && Pieces.VariableBaseTypeChecking(aDataFilter[i].value[1], 'string')
                                && Validator.isISO8601(aDataFilter[i].value[0])
                                && Validator.isISO8601(aDataFilter[i].value[1]) ){
                                condition[aDataFilter[i].key] = { $gte: aDataFilter[i].value[0], $lte: aDataFilter[i].value[1] };
                            }
                        }
                        continue;
                    }

                    if ( aDataFilter[i].key === 'updatedAt'
                        && ( (aDataFilter[i].operator === '=') || (aDataFilter[i].operator === '!=')
                            || (aDataFilter[i].operator === '<') || (aDataFilter[i].operator === '>')
                            || (aDataFilter[i].operator === '<=') || (aDataFilter[i].operator === '>=')
                            || (aDataFilter[i].operator === 'in') )
                    ) {
                        if( aDataFilter[i].operator !== 'in'
                            && Pieces.VariableBaseTypeChecking(aDataFilter[i].value, 'string')
                            && Validator.isISO8601(aDataFilter[i].value) ){
                            switch(aDataFilter[i].operator){
                                case '=':
                                    condition[aDataFilter[i].key] = {$eq: aDataFilter[i].value};
                                    break;
                                case '!=':
                                    condition[aDataFilter[i].key] = {$ne: aDataFilter[i].value};
                                    break;
                                case '>':
                                    condition[aDataFilter[i].key] = {$gt: aDataFilter[i].value};
                                    break;
                                case '>=':
                                    condition[aDataFilter[i].key] = {$gte: aDataFilter[i].value};
                                    break;
                                case '<':
                                    condition[aDataFilter[i].key] = {$lt: aDataFilter[i].value};
                                    break;
                                case '<=':
                                    condition[aDataFilter[i].key] = {$lte: aDataFilter[i].value};
                                    break;
                            }
                        }else if(aDataFilter[i].operator === 'in'){
                            if(aDataFilter[i].value.length === 2
                                && Pieces.VariableBaseTypeChecking(aDataFilter[i].value[0], 'string')
                                && Pieces.VariableBaseTypeChecking(aDataFilter[i].value[1], 'string')
                                && Validator.isISO8601(aDataFilter[i].value[0])
                                && Validator.isISO8601(aDataFilter[i].value[1]) ){
                                condition[aDataFilter[i].key] = { $gte: aDataFilter[i].value[0], $lte: aDataFilter[i].value[1] };
                            }
                        }
                    }
                }
            }else{
                return false;
            }
        }catch (error){
            return false;
        }
    }
};
