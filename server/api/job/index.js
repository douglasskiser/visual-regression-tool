var controller = require('./job.controller');

module.exports = function(app) {
    app.get('/rest/model/job/', controller.get);
    app.get('/rest/model/job/:id', controller.getOne);
    app.post('/rest/model/job/create', controller.create);
    app.put('/rest/model/job/:id', controller.update);
    app.delete('/rest/model/job/:id', controller.delete);
};