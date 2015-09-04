var controller = require('./job-type.controller');

module.exports = function(app) {
    app.get('/rest/job-type', controller.get);
    app.get('/rest/job-type/:id', controller.getOne);
    app.post('/rest/jobtype/create', controller.create);
    app.put('/rest/jobtype/:id', controller.update);
    app.delete('/rest/jobtype/:id', controller.delete);
    
    return app;
};