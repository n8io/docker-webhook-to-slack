var express = require('express');

module.exports = function(app) {
  var router = express.Router();

  router
    .get('/', function(req, res) {
      return res.render('index');
    })
    ;

  app.use('/', router);
};
