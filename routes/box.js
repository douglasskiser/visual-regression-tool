/*
 * GET home page.
 */

module.exports = function (app) {
    var controller = app.controllers.box;

    app.get('/rest/collection/box', controller.fetchMany);
    app.get('/rest/model/box/:id', controller.fetchOne);
};