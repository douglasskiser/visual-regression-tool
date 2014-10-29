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
        db: {
            client: 'mysql',
            connection: {
                host: '127.0.0.1',
                user: 'vrt',
                password: 'vrtsabre',
                database: 'vrt'
            },
            debug: true
        },
        casper: {
            absolutePath: '/usr/bin/casperjs'
        }
    }
};