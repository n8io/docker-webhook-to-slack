var bodyParser = require('body-parser');

module.exports = function(app) {
  // configure app to use bodyParser()
  // this will let us get the data from a POST
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
};
