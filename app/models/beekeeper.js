var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var addressSchema = new Schema({
  name:  {
    type: String,
    required: true
  },
  street:  {
    type: String,
    required: true
  },
  city:  {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

var informationSchema = new Schema({
  title:  {
    type: String,
    required: true
  },
  description:  {
    type: String,
    required: true
  },
  image:  {
    type: String
  }
}, {
  timestamps: true
});

var productSchema = new Schema({
  title:  {
    type: String,
    required: true
  },
  description:  {
    type: String,
    required: true
  },
  size:  {
    type: String,
    required: true
  },
  price:  {
    type: String,
    required: true
  },
  image:  {
    type: String
  }
}, {
  timestamps: true
});

var beekeeperSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: addressSchema,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  facebook: {
    type: String,
  },
  twitter: {
    type: String,
  },
  information: [ informationSchema ],
  products: [ productSchema ],
  sites: [{ type: Schema.Types.ObjectId, ref: 'Site' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Beekeeper', beekeeperSchema);
