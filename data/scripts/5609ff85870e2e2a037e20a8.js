var casper = require('casper').create({
    logLevel: 'debug',
    waitTimeout: 50000,
    pageSettings: {
		webSecurityEnabled: false,
		loadImages: true,
		loadPlugins: false
	},
    clientScripts:["socket.io.js"]
});

casper.log('Test Log====================================>');

casper.savePageContent = casper.savePageContent || function(targetFile) {
  var fs = require('fs');
  var f  = require('utils').format;
  var utils = require('utils');

  // Get the absolute path.
  targetFile = fs.absolute(targetFile);
  // Let other code modify the path.
  targetFile = this.filter('page.target_filename', targetFile) || targetFile;
  this.log(f("Saving page html to %s", targetFile), "debug");
  // Try saving the file.
  try {
    fs.write(targetFile, utils.dump(casper.logs), 'w');
  } catch(err) {
    this.log(f("Failed to save page html to %s; please check permissions", targetFile), "error");
    this.log(err, "debug");
    return this;
  }

  this.log(f("Page html saved to %s", targetFile), "info");
  // Trigger the page.saved event.
  this.emit('page.saved', targetFile);

  return this;
};

casper.start('http://dev-dougkiser.c9.io/');

casper.page.onConsoleMessage = function(msg) {
  console.log(msg);
};
casper.then(function(){
    var that = this;
    this.evaluate(function(){
        var socket = io.connect();
        casper.log('maybe socket? ');

        socket.on('data:job:read', function (data) {
            casper.log('Got some data from the socket!!!!!');
        });
        socket.emit('job:read');
    });
});
casper.wait(10000);

casper.then(function() {
    casper.savePageContent('./data/logs/hello-log.txt');
    casper.exit();
});

casper.run();
// var casper = require('casper').create({
// 	logLevel: 'debug',
// 	waitTimeout: 50000,
// 	pageSettings: {
// 		webSecurityEnabled: false,
// 		loadImages: true,
// 		loadPlugins: false
// 	}
// }),
// Camera = new require('../../camera'),
// camera = new Camera(casper, casper.cli.options.target),
// x = require('casper').selectXPath,
// startUrl = casper.cli.options.url;

// casper.echo("Start requesting" + startUrl);
// casper.start(startUrl);
// casper.viewport(casper.cli.options.width, casper.cli.options.height);

casper.on('resource.error', function(resource) {
	casper.echo(JSON.stringify(resource));
});

casper.on('remote.message', function(message) {
	this.echo('remote.message: ' + message);
});

casper.on('waitFor.timeout', function(details, err) {
	casper.echo(details + " -> Time out " + Object.keys(err) + " <-> " + err['testFx']);
});

casper.on('complete.error', function(err) {
	this.die("Complete callback has failed: " + err);
});

// casper.on('log', function(details){
//     casper.echo(JSON.stringify(details));
// });

casper.on("page.error", function(msg, trace) {
	casper.echo("Error: " + msg + "\nTRACE: " + trace, "ERROR");
});

casper.on('error', function(msg, trace) {
	casper.echo("Error: " + msg + "\nTRACE: " + trace, "ERROR");
})

casper.on("mouse.click", function(args) {
	casper.echo(" --------------" + JSON.stringify(args));
});

