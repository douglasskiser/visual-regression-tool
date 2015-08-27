var controller = require('./health-check.controller');

module.exports = function(app) {
    app.get('/rest/model/healthcheck', controller.get);
    app.get('/rest/model/healthcheck/:id', controller.getOne);
    app.post('/rest/model/healthcheck/create', controller.create);
    app.put('/rest/model/healthcheck/:id', controller.update);
    app.delete('/rest/model/healthcheck/:id', controller.delete);
};