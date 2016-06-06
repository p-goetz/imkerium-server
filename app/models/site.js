var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logbookSchema = new Schema({
  date:  {
    type: Date,
    required: true
  },
  combs_total:  {
    type: Number,
    required: true
  },
  combs_brood:  {
    type: Number,
    required: true
  },
  combs_food:  {
    type: Number,
    required: true
  },
  queen_present:  {
    type: Boolean,
    required: true
  },
  notes:  {
    type: String,
    required: true
  }
});

var hiveSchema = new Schema({
  name:  {
    type: String,
    required: true,
    unique: true
  },
  logbook: [ logbookSchema ]
});

var siteSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  hives: [ hiveSchema ]
});

module.exports = mongoose.model('Site', siteSchema);
