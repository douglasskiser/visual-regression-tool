var Box = require('./db/box/box.model'),
    Device = require('./db/device/device.model'),
    Execution = require('./db/execution/execution.model'),
    ExecutionStatus = require('./db/execution-status/execution-status.model'),
    HealthCheck = require('./db/health-check/health-check.model'),
    Job = require('./db/job/job.model'),
    JobType = require('./db/job-type/job-type.model'),
    Script = require('./db/script/script.model'),
    logger = require('./logger');

console.log(Execution.prototype.schema)

Box.find({}).remove(function() {
    Box.create({
        id: 1,
        url: 'https://wl25-int.sabresonicweb.com/SSW2010/EYM0/#webqtrip',
        name: 'INT-WL25-EYM0',
        createdAt: 2014,
        updatedAt: 2014
    }, {
        id: 2,
        url: 'https://wl16-int.sabresonicweb.com/SSW2010/EYM0/#webqtrip',
        name: 'INT-WL16-EYM0',
        createdAt: 0,
        updatedAt: 1416255695903
    }, {
        id: 3,
        url: 'https://mobile1-b-test.sabresonicweb.com/SSW2010/EYM0/#webqtrip',
        name: 'CERT-B-EYM0',
        createdAt: 0,
        updatedAt: 0
    }, {
        id:4,
        url: 'https://mobile1-a-test.sabresonicweb.com/SSW2010/EYM0/#webqtrip',
        name: 'CERT-A-EYM0',
        createdAt: 0,
        updatedAt: 0
    }, {
        id: 5,
        url: 'https://wl23-int.sabresonicweb.com/SSW2010/EYM0/#webqtrip',
        name: 'INT-WL23 EYM0/BMF',
        createdAt: 1416241597371,
        updatedAt: 1416274882785
    }, {
        id: 7,
        url: 'https://wl13-int.sabresonicweb.com/SSW2010/EYM0/#webqtrip',
        name: 'WL13-INT EYM0 BMF',
        createdAt: 1416275180386,
        updatedAt: 1416275180386
    }, {
        id: 8,
        url: 'https://mobile1-b-test.sabresonicweb.com/SSW2010/EYM0/#checkin',
        name: 'mobile1-b-test.sabresonicweb.com - EYM0 - Check In',
        createdAt: 1416518806951,
        updatedAt: 1416518806951
    }, {
        id: 9,
        url: 'https://wl16-int.sabresonicweb.com/SSW2010/EYM0/#checkin',
        name: 'wl16-int.sabresonicweb.com - EYM0 - Check In',
        createdAt: 1416518852515,
        updatedAt: 1416518852515
    }, function() {
        logger.info('Populated Boxes');
    });
});

Device.find({}).remove(function() {
    Device.create({
        id: 1,
        name: 'Apple iPhone 5',
        width: 320,
        height: 568
    }, {
        id: 2,
        name: 'Apple iPad 3/4',
        width: 1024,
        height: 768
    }, function() {
        logger.info('Populated Devices');
    });
});

Execution.find({}).remove(function() {
    Execution.create({
        id: 2,
        jobId: 1,
        statusId: 3,
        createdAt: 1415943499592,
        updatedAt: 1415950119433
    }, {
        id: 3,
        jobId: 3,
        statusId: 3,
        createdAt: 1415950583413,
        updatedAt: 1415950672141
    }, {
        id: 4,
        jobId: 3,
        statusId: 3,
        createdAt: 1415950816449,
        updatedAt: 1415950905257
    }, {
        id: 5,
        jobId: 3,
        statusId: 3,
        createdAt: 1415950959849,
        updatedAt: 1415951045818
    }, {
        id: 6,
        jobId: 3,
        statusId: 3,
        createdAt: 1415951217180,
        updatedAt: 1415951311141
    }, {
        id: 7,
        jobId: 3,
        statusId: 4,
        createdAt: 1415951792372,
        updatedAt: 1415951885240
    }, {
        id: 8,
        jobId: 3,
        statusId: 5,
        createdAt: 1415951909661,
        updatedAt: 1415951914706
    }, {
        id: 9,
        jobId: 3,
        statusId: 3,
        createdAt: 1415952004494,
        updatedAt: 1415952091864
    }, {
        id: 10,
        jobId: 3,
        statusId: 3,
        createdAt: 1415952223248,
        updatedAt: 1415986099009
    }, {
        id: 12,
        jobId: 3,
        statusId: 4,
        createdAt: 1415980719593,
        updatedAt: 1415990847948
    }, {
        id: 13,
        jobId: 3,
        statusId: 3,
        createdAt: 1415991086317,
        updatedAt: 1415992728620
    }, {
        id: 14,
        jobId: 3,
        statusId: 3,
        createdAt: 1415993175147,
        updatedAt: 1415997895264
    }, {
        id: 15,
        jobId: 4,
        statusId: 3,
        createdAt: 1415998028264,
        updatedAt: 1418683151469
    }, {
        id: 16,
        jobId: 3,
        statusId: 3,
        createdAt: 1415999692821,
        updatedAt: 1415999716914
    }, {
        id: 17,
        jobId: 1,
        statusId: 3,
        createdAt: 1415999813671,
        updatedAt: 1415999839269
    }, {
        id: 18,
        jobId: 4,
        statusId: 3,
        createdAt: 1415999914326,
        updatedAt: 1415999939279
    }, {
        id: 19,
        jobId: 5,
        statusId: 3,
        createdAt: 1416000824866,
        updatedAt: 1416000849283
    }, {
        id: 20,
        jobId: 6,
        statusId: 3,
        createdAt: 1416001136003,
        updatedAt: 1416001162884
    }, {
        id: 21,
        jobId: 7,
        statusId: 3,
        createdAt: 1416002171331,
        updatedAt: 1416002193949
    }, {
        id: 22,
        jobId: 2,
        statusId: 3,
        createdAt: 1416002225387,
        updatedAt: 1416002438875
    }, {
        id: 23,
        jobId: 8,
        statusId: 3,
        createdAt: 1416003450395,
        updatedAt: 1416003474745
    }, {
        id: 24,
        jobId: 2,
        statusId: 3,
        createdAt: 1416003543934,
        updatedAt: 1416253651230
    }, {
        id: 25,
        jobId: 3,
        statusId: 3,
        createdAt: 1416255421120,
        updatedAt: 1416257469110
    }, {
        id: 26,
        jobId: 9,
        statusId: 3,
        createdAt: 1416257087994,
        updatedAt: 1416257231000
    }, {
        id: 27,
        jobId: 9,
        statusId: 3,
        createdAt: 1416258255282,
        updatedAt: 1416273704458
    }, {
        id: 28,
        jobId: 1,
        statusId: 3,
        createdAt: 1416273728457,
        updatedAt: 1416274012230
    }, {
        id: 29,
        jobId: 10,
        statusId: 4,
        createdAt: 1416274917306,
        updatedAt: 1416275014750
    }, {
        id: 30,
        jobId: 11,
        statusId: 3,
        createdAt: 1416275203100,
        updatedAt: 1416517382678
    }, {
        id: 32,
        jobId: 12,
        statusId: 3,
        createdAt: 1416518887072,
        updatedAt: 1416518916845
    }, {
        id: 33,
        jobId: 1,
        statusId: 3,
        createdAt: 1416872044200,
        updatedAt: 1416873172172
    }, {
        id: 34,
        jobId: 2,
        statusId: 3,
        createdAt: 1416925217334,
        updatedAt: 1416925455549
    }, {
        id: 35,
        jobId: 13,
        statusId: 5,
        createdAt: 1416926923909,
        updatedAt: 1418248360883
    }, {
        id: 36,
        jobId: 1,
        statusId: 3,
        createdAt: 1417824952837,
        updatedAt: 1418412829164
    }, {
        id: 37,
        jobId: 12,
        statusId: 3,
        createdAt: 1418413559678,
        updatedAt: 1418415255525
    }, {
        id: 38,
        jobId: 14,
        statusId: 4,
        createdAt: 1418662018699,
        updatedAt: 1418662051416
    }, {
        id: 39,
        jobId: 14,
        statusId: 3,
        createdAt: 1418662165744,
        updatedAt: 1418662400957
    }, {
        id: 40,
        jobId: 16,
        statusId: 3,
        createdAt: 1418702707785,
        updatedAt: 1418702975415
    }, {
        id: 41,
        jobId: 16,
        statusId: 3,
        createdAt: 1418802883012,
        updatedAt: 1418803154553
    }, {
        id: 42,
        jobId: 17,
        statusId: 4,
        createdAt: 1421422678333,
        updatedAt: 1421423064017
    }, {
        id: 44,
        jobId: 19,
        statusId: 4,
        createdAt: 1422038574790,
        updatedAt: 1422039053036
    }, function() {
        logger.info('Populated Executions');
    });
});

ExecutionStatus.find({}).remove(function() {
    ExecutionStatus.create({
        id: 1,
        name: 'Scheduled'
    }, {
        id: 2,
        name: 'Running'
    }, {
        id: 3,
        name: 'Completed'
    }, {
        id: 4,
        name: 'Error'
    }, {
        id: 5,
        name: 'Terminated'
    }, function() {
        logger.info('Populated ExecutionStatuses');
    });
});

HealthCheck.find({}).remove(function() {
    HealthCheck.create({
        id: 1,
        boxId: 1,
        status: 0,
        updatedAt: 1415220213552,
        createdAt: 1415119786318,
        script: 'var Utils = require(\'../utils\'),\n    startUrl = casper.cli.options.url,\n    casper = require(\'casper\').create({\n        logLevel: \'info\',\n        waitTimeout: 30000,\n        pageSettings: {\n            webSecurityEnabled: false,\n            loadImages: true,\n            loadPlugins: false\n        }\n    });\n\n\n\n//on resource.error, call error reporting and exit\ncasper.on(\'resource.error\', function(e) {\n    Utils.handleError(e);\n    casper.exit();\n});\n\n//start casper\ncasper.start(startUrl);\n\n/********************** YOUR SCRIPT STARTS HERE *******************************/\ncasper.waitFor(function() {\n    return casper.evaluate(function() {\n        return !$(\'#loading\').is(\':visible\') && !$(\'#overlay\').is(\':visible\') && $(\'#search-flights\').is(\':visible\') && $(\'#departure-airport>option\').size() > 0;\n    });\n});\n\ncasper.then(function() {\n    casper.evaluate(function() {\n        var e = $(\'#departure-airport\');\n        e.val(\'AUH\');\n        e.change();\n    });\n});\n/********************** YOUR SCRIPT ENDS HERE *******************************/\ncasper.run(function() {\n    Utils.handleSuccess();\n    casper.exit();\n});'
    }, function() {
        logger.info('Populated HealthChecks');
    });
});

Job.find({}).remove(function() {
    Job.create({
        id: 1,
        oldBoxId: 3,
        newBoxId: 2,
        scriptId: 8,
        deviceId: 1,
        createdAt: 1415941678354,
        updatedAt: 1415941678354,
        typeId: 1,
        type: 'Visual Regression'
    }, {
        id: 2,
        oldBoxId: 3,
        newBoxId: 2,
        scriptId: 8,
        deviceId: 2,
        createdAt: 1415942592721,
        updatedAt: 1415942592721,
        typeId: 1,
        type: 'Visual Regression'
    }, {
        id: 3,
        oldBoxId: 4,
        newBoxId: 2,
        scriptId: 8,
        deviceId: 1,
        createdAt: 1415950573386,
        updatedAt: 1415950573386,
        typeId: 1,
        type: 'Visual Regression'
    }, {
        id: 4,
        oldBoxId: 3,
        newBoxId:2,
        scriptId: 8,
        deviceId: 2,
        createdAt: 1415998026447,
        updatedAt: 1415998026447,
        typeId: 1,
        type: 'Visual Regression'
    }, {
        id: 5,
        oldBoxId: 3,
        newBoxId: 2,
        scriptId: 8,
        deviceId: 1,
        createdAt: 1416000820412,
        updatedAt: 1416000820412,
        typeId: 1,
        type: 'Visual Regression'
    }, {
        id: 6,
        oldBoxId: 3,
        newBoxId: 2,
        scriptId: 8,
        deviceId: 1,
        createdAt: 1416001132361,
        updatedAt: 1416001132361,
        typeId: 1,
        type: 'Visual Regression'
    }, {
        id: 7,
        oldBoxId: 3,
        newBoxId: 2,
        scriptId: 8,
        deviceId: 1,
        createdAt: 1416002169791,
        updatedAt: 1416002169791,
        typeId: 1,
        type: 'Visual Regression'
    }, {
        id: 8,
        oldBoxId: 3,
        newBoxId: 2,
        scriptId: 8,
        deviceId: 1,
        createdAt: 1416003446858,
        updatedAt: 1416003446858,
        typeId:1,
        type: 'Visual Regression'
    }, {
        id: 9,
        oldBoxId: 5,
        newBoxId: 2,
        scriptId: 8,
        deviceId: 1,
        createdAt: 1416257034316,
        deviceId: 1416257034316,
        typeId: 2,
        type: 'Visual Regression'
    }, {
        id: 10,
        oldBoxId: 5,
        newBoxId: 2,
        scriptId: 8,
        deviceId: 1,
        createdAt: 1416274915622,
        updatedAt: 1416274915622,
        typeId: 1,
        type: 'Visual Regression'
    }, {
        id: 11,
        oldBoxId: 2,
        newBoxId: 7,
        scriptId: 8,
        deviceId: 1,
        createdAt: 1416275201464,
        updatedAt: 1416275201464,
        typeId: 1,
        type: 'Visual Regression'
    }, {
        id: 12,
        oldBoxId: 8,
        newBoxId: 9,
        scriptId: 11,
        deviceId: 1,
        createdAt: 1416518600718,
        updatedAt: 1416518878087,
        typeId: 1,
        type: 'Visual Regression'
    }, {
        id: 13,
        oldBoxId: 2,
        newBoxId: 3,
        scriptId: 8,
        deviceId: 2,
        createdAt: 1416926908785,
        updatedAt: 1416926908785,
        typeId: 1,
        type: 'Visual Regression'
    }, {
        id: 14,
        oldBoxId: 3,
        newBoxId: 2,
        scriptId: 8,
        deviceId: 1,
        createdAt: 1418415266930,
        updatedAt: 1418662163014,
        typeId: 1,
        type: 'Visual Regression'
    }, {
        id: 15,
        oldBoxId: 3,
        newBoxId: 2,
        scriptId: 8,
        deviceId: 1,
        createdAt: 1418682863670,
        updatedAt: 1418682863670,
        typeId: 1,
        type: 'Visual Regression'
    }, {
        id: 16,
        oldBoxId: 3,
        newBoxId: 2,
        scriptId: 8,
        deviceId: 1,
        createdAt: 1418702705426,
        updatedAt: 1418702705426,
        typeId: 1,
        type: 'Visual Regression'
    }, {
        id: 17,
        oldBoxId: 1,
        newBoxId: 5,
        scriptId: 8,
        deviceId: 1,
        createdAt: 1421422676127,
        updatedAt: 1421422676127,
        typeId: 1,
        type: 'Visual Regression'
    }, {
        id: 18,
        oldBoxId: 1,
        newBoxId: 5,
        scriptId: 11,
        deviceId: 1,
        createdAt: 1421423191351,
        updatedAt: 1421423191351,
        typeId: 1,
        type: 'Visual Regression'
    }, {
        id: 19,
        oldBoxId: 1,
        newBoxId: 7,
        scriptId: 8,
        deviceId: 1,
        createdAt: 1422038573109,
        updatedAt: 1422038573109,
        typeId: 1,
        type: 'Visual Regression'
    }, function() {
        logger.info('Populated Jobs');
    });
});

JobType.find({}).remove(function() {
   JobType.create({
       id: 1,
       name: 'Visual Regression',
       scriptTemplate: null
   }, {
       id: 2,
       name: 'Health Check',
       scriptTemplate: null
   }, function() {
       logger.info('Populated JobTypes');
   });
});

Script.find({}).remove(function() {
    Script.create({
        id: 8,
        name: 'BMF',
        createdAt: 1415922026559,
        updatedAt: 1422038905447,
        nbOfScreenshots: 0,
        code: '',
        //code: 'var casper = require(\'casper\').create({\n        logLevel: \'info\',\n        waitTimeout: 30000,\n        pageSettings: {\n            webSecurityEnabled: false,\n            loadImages: true,\n            loadPlugins: false\n        }\n    }),\n    Camera = new require(\'../../camera\'),\n    camera = new Camera(casper, casper.cli.options.target),\n    startUrl = casper.cli.options.url;\n\ncasper.echo(\"Start requesting \" + startUrl);\ncasper.start(startUrl);\ncasper.viewport(casper.cli.options.width, casper.cli.options.height);\n\ncasper.waitFor(function() {\n    return casper.evaluate(function() {\n        return !$(\'#loading\').is(\':visible\') && !$(\'#overlay\').is(\':visible\') && $(\'#search-flights\').is(\':visible\') && $(\'#departure-airport>option\').size() > 0;\n    });\n});\n\ncasper.wait(5000);\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Air Search Page\');\n});\n\ncasper.then(function() {\n    casper.evaluate(function() {\n        var e = $(\'#departure-airport\');\n        e.val(\'AUH\');\n        e.change();\n    });\n});\n\ncasper.waitFor(function() {\n    return casper.evaluate(function() {\n        return !$(\'#loading\').is(\':visible\') && !$(\'#overlay\').is(\':visible\') && $(\'#arrival-airport\').find(\'option\').size() > 1;\n    })\n});\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Air Search Page - Departure Airport selected\');\n});\n\ncasper.then(function() {\n    casper.echo(\"Set the arrival airport to be the first item in the list\'\");\n    casper.evaluate(function() {\n        var arrivalAirport = $(\'#arrival-airport\');\n        arrivalAirport.val(\"DFW\");\n    });\n});\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Air Search Page - Arrival Airport selected\');\n});\n\n\ncasper.then(function() {\n    casper.echo(\"Set departure and arrival date click \'Search for Flights\'\");\n    casper.evaluate(function() {\n        //setting the dates 6 months from now\n        var start = new Date();\n        start.setMonth(start.getMonth() + 6);\n        start.setDate(1);\n        var end = new Date();\n        end.setMonth(end.getMonth()+7);\n        end.setDate(0);\n\n        $(\'#departure-date\').val(Sabre.app.formatDate(start, \"%Y/%m/%d\"));\n        $(\'#return-date\').val(Sabre.app.formatDate(end, \"%Y/%m/%d\"));\n        $(\'#search-flights\').click();\n    });\n});\n\ncasper.waitFor(function() {\n    return casper.evaluate(function() {\n        return !$(\'#loading\').is(\':visible\') && !$(\'#overlay\').is(\':visible\') && document.title === \'Air Select Page\' && $($(\'.d-outbound .choose-flight\')[0]).is(\':visible\');\n    })\n});\n\ncasper.wait(10000);\n\ncasper.then(function() {\n    casper.echo(\'Select the first OUTBOUND flight\');\n    casper.evaluate(function() {\n        $($(\'.d-outbound .choose-flight\')[0]).click();\n    });\n});\n\ncasper.wait(10000);\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Air Select Page - Outbound flight selected\');\n});\n\ncasper.then(function() {\n    casper.echo(\'Select the first class of service for OUTBOUND flight\');\n    casper.evaluate(function() {\n        $($(\'.d-outbound .select-flight\')[0]).click();\n    });\n});\n\ncasper.wait(10000);\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Air Select Page - Selected Outbound Class of Service\');\n\n});\n\ncasper.then(function() {\n    casper.echo(\'Select the first INBOUND flight\');\n    casper.evaluate(function() {\n        $($(\'.d-inbound .choose-flight\')[0]).click();\n    });\n});\n\ncasper.wait(10000);\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Air Select Page - Inbound Flight selected\');\n\n});\n\ncasper.then(function() {\n    casper.echo(\'Select the first class of service for INBOUND flight\');\n    casper.evaluate(function() {\n        $($(\'.d-inbound .select-flight\')[0]).click();\n    });\n});\n\ncasper.wait(10000);\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Air Select Page - Selected Inbound Class of Service\');\n\n});\n\n\ncasper.then(function() {\n    casper.echo(\'Click on \"Purchase Flight\"\');\n    casper.evaluate(function() {\n        $(\'#confirmFlights\').click();\n    });\n});\n\ncasper.waitFor(function() {\n    return casper.evaluate(function() {\n        return !$(\'#loading\').is(\':visible\') && !$(\'#overlay\').is(\':visible\') && document.title === \'Passengers Page\';\n    })\n});\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Passengers Page - Home\');\n});\n\ncasper.then(function() {\n    casper.echo(\'Click on add details\');\n    casper.evaluate(function() {\n        $(\'.show-psng-form\').click();\n       \n    });\n});\ncasper.wait(10000);\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Passengers Page - Passenger details form\');\n});\n\n\ncasper.then(function(){\n    casper.echo(\"Fill in the passenger form\");\n    casper.evaluate(function(){\n        var form = $(\'#psng-edit-form\');\n        form.find(\'.field-prefix\').val(\'MR\');\n        form.find(\'.field-firstName\').val(\'John\');\n        form.find(\'.field-lastName\').val(\'Doe\');\n        form.find(\'.field-dob\').val(\'1944-07-31\');\n        form.find(\'.field-phone\').val(\'8171112222\');\n        form.find(\'.field-email\').val(\'test@testsabre.com\');\n    })\n});\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Passengers Page - Filled passenger details form\');\n});\ncasper.then(function(){\n    casper.echo(\"Click on Continue\");\n    casper.evaluate(function(){\n        var form = $(\'#psng-edit-form\');\n        form.find(\'.save-psng\').click();\n    })\n});\n\ncasper.wait(10000);\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Passengers Page - Passenger details added\');\n});\n\ncasper.then(function() {\n    casper.echo(\'Click on \"Continue\"\');\n    casper.evaluate(function() {\n        $(\'.psng-section .btn-primary\').click();\n    });\n});\n\ncasper.waitFor(function() {\n    return casper.evaluate(function() {\n        return !$(\'#loading\').is(\':visible\') && !$(\'#overlay\').is(\':visible\') && document.title === \'Ancillary Page\';\n    });\n});\n\ncasper.wait(10000);\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Ancillary Page - Home\');\n});\n\n\n\ncasper.run(function() {\n    casper.echo(\"CASPER COMPLETED.\");\n    casper.exit();\n});',1),(11,'Check In',1415922326405,1418417933311,0,'var casper = require(\'casper\').create({\n        logLevel: \'info\',\n        waitTimeout: 30000,\n        pageSettings: {\n            webSecurityEnabled: false,\n            loadImages: true,\n            loadPlugins: false\n        }\n    }),\n    Camera = new require(\'../../camera\'),\n    camera = new Camera(casper, casper.cli.options.target),\n    startUrl = casper.cli.options.url;\n\ncasper.echo(\"Start requesting \" + startUrl);\ncasper.start(startUrl);\ncasper.viewport(casper.cli.options.width, casper.cli.options.height);\n\n\ncasper.waitFor(function() {\n    return casper.evaluate(function() {\n        return !$(\'#loading\').is(\':visible\') && !$(\'#overlay\').is(\':visible\') && $(\'#search\').is(\':visible\');\n    });\n});\n\ncasper.wait(5000);\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'CheckIn - Home Page\');\n});\n\ncasper.then(function(){\n    casper.echo(\"Setting PNR to ABC123\");\n    return casper.evaluate(function(){\n        $(\'[name=pnr]\').val(\'ABC\');\n    });\n});\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'CheckIn - Home Page After setting PNR\');\n});\n\ncasper.run(function() {\n    casper.echo(\"CASPER COMPLETED.\");\n    casper.exit();\n});',
        typeId: 1
    }, {
        id: 14,
        name: 'Test health check script',
        createdAt: 1415927120884,
        updatedAt: 1415939767391,
        nbOfScreenshots: 0,
        code: 'var x = new Y();',
        typeId: 2
    }, function() {
        logger.info('Populated Scrips');
    }); 
});