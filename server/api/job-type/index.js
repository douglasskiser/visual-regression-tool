var controller = require('./job-type.controller');

module.exports = function(app) {
    app.get('/rest/model/jobtype', controller.get);
    app.get('/rest/job-type', controller.get);
    
    app.get('/rest/model/jobtype/:id', controller.getOne);
    app.get('/rest/job-type/:id', controller.getOne);
    
    app.post('/rest/model/jobtype/create', controller.create);
    app.post('/rest/jobtype/create', controller.create);
    
    app.put('/rest/model/jobtype/:id', controller.update);
    app.put('/rest/jobtype/:id', controller.update);
    
    app.delete('/rest/model/jobtype/:id', controller.delete);
    app.delete('/rest/model/jobtype/:id', controller.delete);
    
    return app;
};