/*
 * GET home page.
 */

module.exports = function (app) {
    var controller = app.controllers.rest;

    // app.post('/rest/model/:name', controller.create);
    // app.get('/rest/model/:name/:id', controller.fetchOne);
    // app.delete('/rest/model/:name/:id', controller.delete);
    
    app.get('/rest/collection/:name', controller.fetchMany);
    
};