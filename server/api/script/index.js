var controller = require('./script.controller');

module.exports = function(app) {
    app.get('/rest/model/script', controller.get);
    app.get('/rest/script', controller.get);
    
    app.get('/rest/model/script/:id', controller.getOne);
    app.get('/rest/script/:id', controller.getOne);
    
    app.post('/rest/model/script/create', controller.create);
    app.post('/rest/script/create', controller.create);
    
    app.put('/rest/model/script/:id', controller.update);
    app.put('/rest/script/:id', controller.update);
    
    app.delete('/rest/model/script/:id', controller.delete);
    app.delete('/rest/script/:id', controller.delete);
    
    return app;
};