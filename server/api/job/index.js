var controller = require('./job.controller');

module.exports = function(app) {
    app.get('/rest/model/job', controller.get);
    app.get('/rest/job', controller.get);
    
    app.get('/rest/model/job/:id', controller.getOne);
    app.get('/rest/job/:id', controller.getOne);
    
    app.post('/rest/model/job/create', controller.create);
    app.post('/rest/job/create', controller.create);
    
    app.put('/rest/model/job/:id', controller.update);
    app.put('/rest/job/:id', controller.update);
    
    app.delete('/rest/model/job/:id', controller.delete);
    app.delete('/rest/job/:id', controller.delete);
    
    return app;
};