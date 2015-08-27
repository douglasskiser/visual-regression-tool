var controller = require('./script.controller');

module.exports = function(app) {
    app.get('/rest/model/script', controller.get);
    app.get('/rest/script', controller.get);
    app.get('/rest/model/script/:id', controller.getOne);
    app.post('/rest/model/script/create', controller.create);
    app.put('/rest/model/script/:id', controller.update);
    app.delete('/rest/model/script/:id', controller.delete);
};