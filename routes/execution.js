/*
 * GET home page.
 */

module.exports = function (app) {
    var controller = app.controllers.execution;

    app.post('/rest/model/execution', controller.create);
    app.get('/rest/model/execution/:id', controller.fetchOne);
    // app.get('/rest/collection/execution', controller.fetchMany);
    app.delete('/rest/model/execution/:id', controller.delete);
    
    
    
    app.post('/execution/:id/run', controller.run);
    app.get('/execution/:id/screenshots', controller.screenshots);
    app.post('/execution/:id/approve', controller.approve);
    app.post('/execution/:id/reject', controller.reject);
};