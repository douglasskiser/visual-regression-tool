var controller = require('./execution.controller');

module.exports = function(app) {
    app.get('/rest/execution', controller.get);
    
    app.get('/rest/model/execution', controller.get);
    app.get('/rest/model/execution/:id', controller.getOne);
    app.post('/rest/model/execution/', controller.create);
    app.put('/rest/model/execution/:id', controller.update);
    app.delete('/rest/model/execution/:id', controller.delete);
    
    app.post('/execution/:id/run', controller.run);
    app.get('/execution/:id/screenshots', controller.screenshots);
};