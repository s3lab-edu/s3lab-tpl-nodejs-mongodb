/**
 * Created by bioz on 1/13/2017.
 */
'use strict';

// third party components
const oFs = require('fs');

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

const sendSuccessDownload = function (res, absPath, isUrl) {
    if (!res) {
        return;
    }

    if(isUrl){
        if(absPath && typeof absPath === 'string'){
            const result = absPath.replace('storage.googleapis.com/', '');
            res.status(200);
            return res.redirect(result);
        }
    }else{
    if(oFs.existsSync(absPath)){
        res.status(200);
        return res.download(absPath);
        }
    }

    res.status(400);
    res.contentType('json');
    let out = {};
    out.code = 4002;
    out.message = 'download failed';
    out.description = 'file does not exist';
    console.log(JSON.stringify(out));
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
    sendSuccessDownload,
    sendSuccessWebContent
};
