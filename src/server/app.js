var express = require('express');
var app = express();
var port;
var listeningIp;
var router;
var server;

// Setup useful middlewares
require('./middlewares')(app);

// Setup app routes
require('./routes')(app);

port = process.env.PORT || 4000;
listeningIp = process.env.HOST || '0.0.0.0';

// START THE SERVER
// =============================================================================
server = app.listen(port, listeningIp, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('%s@%s listening at http://%s:%s on NodeJs',
    process.env.npm_package_name,
    process.env.npm_package_version,
    host,
    port,
    process.version
  );
});
