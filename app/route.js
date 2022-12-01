module.exports = function (app) {
    require('./routes/user.route')(app);
    // require('./books')(app);
};
