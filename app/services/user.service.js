/**
 * Created by bioz on 1/13/2017.
 */
// third party components
const Rest = require('../utils/restware');
const User = require('../models/user.model');

module.exports = {
    create: function (req, res) {
        let data = req.body || '';
        console.log(data);
        try {
            let oNewUser = new User();
            oNewUser.loginName = data.loginName;
            oNewUser.displayName = data.displayName;
            oNewUser.save(function (error) {
                if (error) {
                    console.log(error);
                    return Rest.sendError(res, 7, 'create_user_fail', 400, error);
                }
                let oResData = {};
                oResData.id = oNewUser._id;
                console.log(oResData);
                return Rest.sendSuccess(res, oResData, 200);
            });
        }catch(error){
            console.log(error);
            return Rest.sendError(res, 7, 'create_user_fail', 400, error);
        }
    },

    getOne: function (req, res) {
        let id = req.params.id || '';

        let query = {};
        query._id = id;
        let options = {'createdAt': 0};
        try {
            User.findOne(query, options, function (error, user) {
                if (error) {
                    return Rest.sendError(res, 420, error, 400, null);
                }
                if(!user){
                    return Rest.sendError(res, 420, 'unavailable', 400, null);
                }else{
                    return Rest.sendSuccess(res, user, 200);
                }
            });
        } catch(error){
                return Rest.sendError(res, 420, 'get_one_fail', 400, error);
        }
    },
}
