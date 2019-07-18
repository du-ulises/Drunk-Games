module.exports = app => {
    require('./admins')(app);
    require('./users')(app);
    require('./eventos')(app);
    require('./inicio')(app);
}