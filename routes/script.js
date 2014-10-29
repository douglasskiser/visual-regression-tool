/*
 * GET home page.
 */

module.exports = function (app) {
    var controller = app.controllers.script;

    app.get('/rest/collection/script', controller.fetchMany);
    app.get('/rest/model/script/:id', controller.fetchOne);
};