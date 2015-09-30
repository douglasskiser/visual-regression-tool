var casper = require('casper').create({
	logLevel: 'debug',
	waitTimeout: 50000,
	pageSettings: {
		webSecurityEnabled: false,
		loadImages: true,
		loadPlugins: false
	}
}),
Camera = new require('../../camera'),
camera = new Camera(casper, casper.cli.options.target),
x = require('casper').selectXPath,
startUrl = casper.cli.options.url;

casper.echo("Start requesting" + startUrl);
casper.start(startUrl);
casper.viewport(casper.cli.options.width, casper.cli.options.height);

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