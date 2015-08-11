var path = require('path'),
    pkg = require('./package.json'),
    env = process.env.NODE_ENV || 'development';



module.exports = {
    development: {
        rootPath: __dirname,
        app: {
            name: pkg.name,
            fullName: 'Visual Regression Tool',
            version: pkg.version
        },
        mongo: {
            uri: 'mongodb://dkiser:1234567890@ds031893.mongolab.com:31893/heroku_p11z4r5g',
            options: {
                db: {
                    safe: true
                }
            }
        },
        seedDB: true,
        db: {
            client: 'mysql',
            connection: {
                host: process.env.IP,
                user: process.env.C9_USER,
                password: '',
                database: 'vrt'
            },
            debug: false
        },
        casper: {
            absolutePath: '/home/ubuntu/.nvm/v0.10.35/lib/node_modules/casperjs/bin/casperjs'
        }
    }
};