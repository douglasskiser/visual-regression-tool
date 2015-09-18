var auth = require('../../auth/auth.service');
var ctrl = require('./user.controller');

module.exports = function(app) {
    app.get('/rest/user', auth.hasRole('admin'), ctrl.get);
    app.delete('/rest/user/:id', auth.hasRole('admin'), ctrl.delete);
    app.get('/rest/user/me', auth.isAuthenticated(), ctrl.me);
    app.put('/rest/user/:id/account', auth.isAuthenticated(), ctrl.update);
    app.get('/rest/user/:id', auth.isAuthenticated(), ctrl.getOne);
    app.post('/rest/user/', auth.isAuthenticated(), ctrl.create);
};