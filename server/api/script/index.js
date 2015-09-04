var controller = require('./script.controller');

module.exports = function(app) {
    app.get('/rest/script', controller.get);
    app.get('/rest/script/:id', controller.getOne);
    app.post('/rest/script/create', controller.create);
    app.put('/rest/script/:id', controller.update);
    app.delete('/rest/script/:id', controller.delete);
    
    return app;
};