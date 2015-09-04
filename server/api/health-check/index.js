var controller = require('./health-check.controller');

module.exports = function(app) {
    app.get('/rest/healthcheck', controller.get);
    app.get('/rest/healthcheck/:id', controller.getOne);
    app.post('/rest/healthcheck/create', controller.create);
    app.put('/rest/healthcheck/:id', controller.update);
    app.delete('/rest/healthcheck/:id', controller.delete);
    
    return app;
};