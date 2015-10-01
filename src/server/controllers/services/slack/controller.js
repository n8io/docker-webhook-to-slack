var request = require('request');
var async = require('async');

var slackController = function() {};

module.exports = slackController;

slackController.dockerWebhook = dockerWebhook;

function dockerWebhook(req, res) {
  async.series([
    acknowledgeWebhookCallback,
    postToSlack
  ],
  function(err, results) {
    var statusCode = 200;

    if(err) {
      statusCode = results && results.statusCode ? results.statusCode : 500;
    }

    return res.status(statusCode).json({
      team: req.params.team,
      channel: req.params.channel,
      token: req.params.token,
      query: req.query,
      slack: {
        hookUrl: results[1].uri,
        payload: results[1].json
      }
    });
  });

  function acknowledgeWebhookCallback(callback) {
    var webhookOptions = {
      method: 'POST',
      uri: req.body.callback_url,
      json: request.body
    };

    console.log('Posting to callback_url for webhook...');
    request(webhookOptions, function onComplete(err, results) {
      if(err) {
        console.log(err);

        return callback(err);
      }

      return callback(null, results);
    });
  }

  function postToSlack(callback) {
    var DEFAULTS = {
      url: 'https://hooks.slack.com/services',
      username: 'DockerHub',
      icon_url: 'https://dl.dropboxusercontent.com/u/452959/hosted/docker.png',
      color: '#22b8eb',
      attachments: [
        {
          pretext: 'A docker image build has completed successfully.',
          fields: [
            {
              title: 'Source',
              value: 'Docker Hub',
              short: true
            },
            {
              title: 'Author',
              value: req.body.push_data.pusher,
              short: true
            }
          ],
          mrkdwn_in: ['text', 'fields', 'pretext']
        }
      ]
    };

    var fmtPretext;
    var tags = DEFAULTS.attachments[0].fields[1].value;

    if(req.body.push_data.images) {
      var images = req.body.push_data.images;
      var msg = 'The [ *';

      if(images instanceof Array) {
        tags = req.body.push_data.images.join(', ');
        msg += tags + ' *] image';
        msg += req.body.push_data.images.length > 1 ? 's have' : ' has';
        msg += ' been built successfully.';
      }
      else if(typeof images === 'string') {
        msg += req.body.push_data.images + ' *] image has been built successfully.';
        tags = images;
      }

      fmtPretext = msg;
    }

    var pretext = req.query.pretext || fmtPretext || DEFAULTS.attachments[0].pretext;

    tags = req.query.tag || tags;
    DEFAULTS.attachments[0].fallback = pretext;

    var validMrkDwnFields = {
      pretext: 'pretext',
      pretxt: 'pretext',
      text: 'text',
      txt: 'text',
      fields: 'fields',
      field: 'fields'
    };

    var mrkdwn_in = [];

    if(req.query['mrkdwn_in'] instanceof Array) {
      mrkdwn_in = req.query['mrkdwn_in'];
    }
    else if(typeof req.query['mrkdwn_in'] === 'string') {
      var foundValue = validMrkDwnFields[req.query['mrkdwn_in'].toLowerCase()];

      if(foundValue) {
        mrkdwn_in.push(foundValue);
      }
      else {
        mrkdwn_in = null;
      }
    }
    else {
      mrkdwn_in = null;
    }

    var slackPayload = {
      username: req.query.username || DEFAULTS.username,
      'icon_url': req.query['icon_url'] || DEFAULTS['icon_url'],
      attachments: [
        {
          fallback: req.query.fallback || DEFAULTS.attachments[0].fallback,
          pretext: pretext,
          title: req.query.title || req.body.repository['repo_name'],
          'title_link': req.query['title_link'] || req.body.repository['repo_url'],
          text: req.query.text || null,
          color: req.query.color || DEFAULTS.color,
          fields: [
            DEFAULTS.attachments[0].fields[0],
            DEFAULTS.attachments[0].fields[1]
          ],
          'mrkdwn_in': mrkdwn_in  || DEFAULTS.attachments[0]['mrkdwn_in']
        }
      ]
    };

    var slackOptions = {
      method: 'POST',
      uri: [
        req.params.slack_url || DEFAULTS.url,
        req.params.team,
        req.params.channel,
        req.params.token
      ].join('/'),
      json: slackPayload
    };

    console.log('Posting to Slack channel...');
    request(slackOptions, function onComplete(err, results) {
      if(err) {
        console.log(err);

        return callback(err);
      }

      return callback(null, slackOptions);
    });
  }
}
