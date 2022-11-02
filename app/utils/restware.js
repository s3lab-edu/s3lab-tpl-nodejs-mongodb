/**
 * Created by bioz on 1/13/2017.
 */
'use strict';
const sendSuccess = function (res, data, iHttpCode) {
    if (!res) {
        return;
    }

    let httpStatus = iHttpCode ? iHttpCode : 200;
    let out = null;

    if(data){
        out = data;
    }

    res.status(httpStatus);
    res.contentType('json');

    return res.json(out);
};

const sendSuccessWebContent = function (res, data, iHttpCode) {
    if (!res) {
        return;
    }

    let httpStatus = iHttpCode ? iHttpCode : 200;
    let out = null;

    if( data ){
        out = data;
    }

    res.status(httpStatus);
    res.contentType('text/html');
    return res.end(out);
};

const sendSuccessToken = function (res, token, user) {
    if (!res) {
        return;
    }

    let out = {};

    out.token = token;
    out.id = user._id;
    out.loginName = user.loginName;
    out.displayName = user.displayName;
    out.email = user.email;
    out.userRight = user.userRight;
    out.avatarUrl = user.avatarUrl;

    res.status(200);
    res.contentType('json');
    return res.json(out);
};

const sendError = function (res, code, message, httpCode, description, errors) {
    if (!res) {
        return;
    }

    let out = {};
    out.code = code;
    out.message = message ? message.toString() : "unidentified error";

    if(description){
        out.description = description.toString();
    }else if (errors){
        out.errors = errors;
    }

    console.log(out);

    let status = httpCode ? httpCode : 500;

    res.status(status);
    res.contentType('json');
    return res.json(out);
};

module.exports = {
    sendSuccess,
    sendError,
    sendSuccessToken,
    sendSuccessWebContent
};
