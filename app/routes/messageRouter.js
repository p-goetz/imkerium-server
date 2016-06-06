var express = require('express');
var bodyParser = require('body-parser');
var postmark = require('postmark');
var client = new postmark.Client('a71f5ba8-11ac-4750-8098-9b7d1f6e7be9');

var verify = require('./verify');

var router = express.Router();
router.use(bodyParser.json());

router.route('/')

.post(verify.verifyOrdinaryUser, function(req, res, next) {
  console.log(req.body);
  client.sendEmail({
    'From': 'pgoetz@imkerium.de',
    'ReplyTo': req.body.from,
    'To': req.body.to,
    'Subject': req.body.subject,
    'TextBody': req.body.message
  }, function(err, result) {
    if (err) return next(err);
    res.json({message: 'sent message "' + req.body.subject + '" from ' + req.body.from + ' to ' + req.body.to});
  });
});

module.exports = router;
