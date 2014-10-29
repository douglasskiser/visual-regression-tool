var Super = require('./base'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    env = process.env.NODE_ENV || 'development',
    config = require('../config')[env],
    Promise = require('bluebird'),
    logger = require('../logger'),

    Model = Super.extend({
        tableName: 'User',
        hasTimestamps: ['createdAt', 'updatedAt']
    });


Model.prototype.validators = {
    email: [
        function(val) {
            var that = this;
            //make sure that the name and workflow id is unique
            return Model.forge()
                .query(function(qb) {
                    qb.whereRaw('lower("email") = ?', _s.trim(val).toLowerCase());

                })
                .fetch()
                .then(function(doc) {
                    if (doc  && (doc.id != that.target.id)) {
                        throw new Error('Duplicate email "' + that.target.email + '"');
                    }
                });
    }]
};

Model.prototype.initialize = function() {
    Super.prototype.initialize.apply(this, arguments);
    this.on('creating', this.onCreating);
};

// Model.prototype.onCreating = function(model, attrs, options) {
//     var that = this;
//     var GClient = require('../gclient');
//     var owner = options.creator;

//     if (!owner) {
//         throw new Error("Admin account is required to create a new user!");
//     }
//     var gclient = new GClient({
//         tokens: owner.get('tokens')
//     });

//     var admin = gclient.google.admin('directory_v1');
//     return Promise.resolve()
//         .then(function() {
//             //setting the domain to the email address
//             if (!model.get('domain')) {
//                 model.set('domain', model.get('email').split('@').shift());
//             }

//             return Promise.resolve();
//         })
//         .then(function() {
//             return new Promise(function(resolve, reject) {
//                 var key = _s.trim(model.get('email'));
//                 logger.info('User::onCreating()->user key to send to google is %s', key);
//                 admin.users.get({
//                         userKey: key
//                     },
//                     function(err, body) {
//                         if (err) {
//                             if (err.code == 404) {
//                                 reject(_s.sprintf('Email %s is not found.', key));
//                             }
//                             reject(err.message || err);
//                             return;
//                         }
//                         logger.info("User::onCreating()-> %s is a user", key);
//                         resolve(body);
//                     });
//             });
//         })
//         .then(function(u) {
//             if (!model.get('name') && u.name && u.name.fullName) {
//                 model.set('name', u.name.fullName);
//             }
//             if (u.isAdmin || u.isDelegatedAdmin) {
//                 model.set('isAdmin', true);
//             }
//             if (!model.get('uid') && u.id) {
//                 model.set('uid', u.id);
//             }
            
//             //TODO: further update the User table
//         });
// };

Model.prototype.export = function(viewerId) {
    var fields = ['id', 'name', 'email', 'domain', 'profileUrl', 'avatarUrl', 'isAdmin', 'isActive', 'lastLoggedIn', 'createdAt', 'updatedAt'];
    var params = this.pick(fields);
    params.domain = _s.trim(params.domain);


    return params;
};


Model.prototype.parse = function(attrs) {
    if (attrs.tokens) {
        attrs.tokens = JSON.parse(attrs.tokens);
    }

    if (attrs.profile) {
        attrs.profile = JSON.parse(attrs.profile);
    }

    _.forEach(['uid', 'email', 'homeFolderId', 'domain', 'taskListId'], function(key) {
        attrs[key] = attrs[key] ? attrs[key].trim() : attrs[key];

    });

    return attrs;
};

Model.prototype.initFlexWorkflowFolder = function() {
    var GClient = require('../gclient'),
        that = this,
        gclient = new GClient({
            tokens: that.get('tokens')
        }),
        drive = gclient.drive();

    return (function() {
            if (that.get('homeFolderId') && that.get('homeFolderUrl')) {
                return new Promise(function(resolve, reject) {
                    drive.files.get({
                            fileId: _s.trim(that.get('homeFolderId'))
                        },
                        function(err, body) {
                            if (err) {
                                resolve(false);
                                return;
                            }
                            resolve(body);
                        });
                });
            }
            return Promise.resolve(false);
        })()
        .then(function(folder) {
            if (!folder) {
                return (function() {
                        logger.info('User::initFlexWorkflowFolder() -> Checking if the user has FlexWorkflow folder');

                        //region check to make sure that FlexWorkflow is available
                        return new Promise(function(resolve, reject) {
                            drive.files.list({
                                    q: "title = '" + config.app.fullName + "' and mimeType = 'application/vnd.google-apps.folder'"
                                },
                                function(err, body) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    resolve(body.items[0]);
                                })
                        });
                    })()
                    .then(function(flexWorkflowFolder) {
                        if (!flexWorkflowFolder) {
                            logger.info('User::initFlexWorkflowFolder() -> There is no Flex Workflow folder in Drive of the owner, attempt to create one.');
                            //region if Flex Workflow is not found, then create one
                            return new Promise(function(resolve, reject) {
                                drive.files.insert({
                                        resource: {
                                            "title": config.app.fullName,
                                            "mimeType": 'application/vnd.google-apps.folder'
                                        }
                                    },
                                    function(err, body) {
                                        if (err) {
                                            reject(err);
                                            return;
                                        }
                                        resolve(body);
                                    })
                            });
                            //endregion
                        }
                        else {
                            logger.info('User::initFlexWorkflowFolder() -> The owner already has Flex Workflow folder in Drive');
                        }
                        return flexWorkflowFolder;
                    })
                    .then(function(flexWorkflowFolder) {
                        return that.save({
                            homeFolderId: flexWorkflowFolder.id,
                            homeFolderUrl: flexWorkflowFolder.alternateLink
                        }, {
                            patch: true
                        });
                    });

                //endregion
            }
            else {
                logger.info('User::initFlexWorkflowFolder() -> User still have %s folder in GDrive', config.app.fullName);
            }
        });
};

// Model.prototype.initTaskList = function() {
//     var GClient = require('../gclient'),
//         that = this,
//         gclient = new GClient({
//             tokens: that.get('tokens')
//         });
//     var client = gclient.google.tasks({
//         version: 'v1',
//         auth: gclient.oauth
//     });
//     if (that.get('taskListId') && that.get('taskListId').trim().length > 0) {
//         return Promise.resolve();
//     }

//     return new Promise(function(resolve, reject) {
//             client.tasklists.list({},
//                 function(err, body) {
//                     if (err) {
//                         logger.error('User::initTaskList()-> %s', err);
//                         reject(err);
//                         return;
//                     }
//                     logger.info('Document::start()->tasks');
//                     resolve(body.items);
//                 })
//         })
//         .then(function(tasklists) {
//             var taskList = _.find(tasklists, function(t) {
//                 return t.title === config.app.fullName
//             });
//             if (_.isEmpty(taskList)) {
//                 logger.info("User::initTaskList() -> Flex Workflow task list if not found. Attempt to create one.");
//                 return new Promise(function(resolve, reject) {
//                     client.tasklists.insert({
//                             resource: {
//                                 "title": config.app.fullName
//                             }
//                         },
//                         function(err, body) {
//                             if (err) {
//                                 logger.error("User::initTaskList() -> %s");

//                                 reject(err);
//                                 return;
//                             }
//                             resolve(body);
//                         })
//                 });
//             }
//             else {
//                 logger.info("User::initTaskList() -> User already have Flex Workflow task list.");
//             }
//         })
//         .then(function(taskList) {
//             if (taskList) {
//                 return that.save({
//                     taskListId: taskList.id
//                 }, {
//                     patch: true
//                 });
//             }
//         });
// };

module.exports = Model;
