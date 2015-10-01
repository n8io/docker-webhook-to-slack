var express = require('express');
var slackController = require('../../../controllers/services/slack/controller');

module.exports = function(app) {
  var router = express.Router();

  router
    .post('/:team/:channel/:token', slackController.dockerWebhook)
    ;

  app.use('/services', router);
};
