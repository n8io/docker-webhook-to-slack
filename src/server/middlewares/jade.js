var path = require('path');
var jade = require('jade');

module.exports = function(app) {
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'jade');
};
