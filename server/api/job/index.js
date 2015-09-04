var controller = require('./job.controller');

module.exports = function(app) {
    app.get('/rest/job', controller.get);
    app.get('/rest/job/:id', controller.getOne);
    app.post('/rest/job/create', controller.create);
    app.put('/rest/job/:id', controller.update);
    app.delete('/rest/job/:id', controller.delete);
    
    return app;
};