var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var verify = require('./verify');

var Beekeeper = require('../models/beekeeper');
var Site = require('../models/site');

var router = express.Router();
router.use(bodyParser.json());

router.route('/')

.get(verify.verifyOrdinaryUser, function (req, res, next) {
  Beekeeper.find({}, function (err, beekeeper) {
    if (err) return next(err);
    res.json(beekeeper);
  });
})

.post(verify.verifyOrdinaryUser, function (req, res, next) {
  Beekeeper.create(req.body, function (err, beekeeper) {
    console.log(req.body);
    if (err) return next(err);
    console.log('Beekeeper created!');
    var id = beekeeper._id;

    res.json(beekeeper);
  });
})

.delete(verify.verifyOrdinaryUser, function (req, res, next) {
  Beekeeper.remove({}, function (err, resp) {
    if (err) return next(err);
    res.json(resp);
  });
});

router.route('/:beekeeperId')

.get(function (req, res, next) {
  Beekeeper.findById(req.params.beekeeperId)
  .select("name information")
  .exec(function (err, beekeeper) {
    if (err) return next(err);
    res.json(beekeeper);
  });
})

.put(verify.verifyOrdinaryUser, function (req, res, next) {
  Beekeeper.findByIdAndUpdate(req.params.beekeeperId, {
    $set: req.body
  }, {
    new: true
  }, function (err, beekeeper) {
    if (err) return next(err);
    res.json(beekeeper);
  });
})

.delete(verify.verifyOrdinaryUser, function (req, res, next) {
  Beekeeper.findByIdAndRemove(req.params.beekeeperId, function (err, resp) {
    if(err) return next(err);
    res.json(resp);
  });
});

router.route('/:beekeeperId/products')

.get(function (req, res, next) {
  Beekeeper.findById(req.params.beekeeperId)
  .select("name products")
  .exec(function (err, beekeeper) {
    if (err) return next(err);
    res.json(beekeeper);
  });
});

router.route('/:beekeeperId/contact')

.get(function (req, res, next) {
  Beekeeper.findById(req.params.beekeeperId)
  .select("name address phone email facebook twitter")
  .exec(function (err, beekeeper) {
    if (err) return next(err);
    res.json(beekeeper);
  });
});

router.route('/:beekeeperId/hives')

.get(verify.verifyOrdinaryUser, function (req, res, next) {
  Beekeeper.findById(req.params.beekeeperId)
  .select("name sites")
  .populate('sites')
  .exec(function (err, beekeeper) {
    if (err) return next(err);
    res.json(beekeeper);
  });
})

.post(verify.verifyOrdinaryUser, function (req, res, next) {
  var siteName = req.body.site_name;
  var hiveName = req.body.hive_name;

  Beekeeper.findById(req.params.beekeeperId)
  .populate({
    path: 'sites',
    match: { name: siteName }
  })
  .exec(function (err, beekeeper) {
    if (err) return next(err);
    var hive = { name: hiveName };
    if(beekeeper.sites.length == 0) {
      var site = new Site({ name: siteName, hives: [ hive ] });
      site.save(function (err, site) {
        if (err) return next(err);
        beekeeper.sites.push(site._id);
        beekeeper.save(function (err, beekeeper) {
          if (err) return next(err);
          res.json(site);
        });
      });
    } else {
      Site.findById(beekeeper.sites[0], function (err, site) {
        if (err) return next(err);
        site.hives.push(hive);
        site.save(function (err, site) {
          if (err) return next(err);
          res.json(site);
        });
      });
    }
  });
});

router.route('/:beekeeperId/hives/:hiveId')

.get(verify.verifyOrdinaryUser, function (req, res, next) {
  Beekeeper.findById(req.params.beekeeperId)
  .select('name sites')
  .populate('sites')
  .exec(function (err, beekeeper) {
    if (err) return next(err);
    for(i = 0; i < beekeeper.sites.length; i++) {
      var site = beekeeper.sites[i];
      for(j = 0; j < site.hives.length; j++) {
        var hive = site.hives[j];
        if(hive._id == req.params.hiveId) {
          site.hives = [ hive ]
          beekeeper.sites = [ site ];
        }
      }
    }
    res.json(beekeeper);
  });
})

.post(verify.verifyOrdinaryUser, function (req, res, next) {
  Beekeeper.findById(req.params.beekeeperId)
  .populate('sites')
  .exec(function (err, beekeeper) {
    if (err) return next(err);
    for(i = 0; i < beekeeper.sites.length; i++) {
      var site = beekeeper.sites[i];
      for(j = 0; j < site.hives.length; j++) {
        var hive = site.hives[j];
        if(hive._id == req.params.hiveId) {
          Site.findById(site._id, function (err, foundSite) {
            console.log(foundSite, req.body);
            if (err) return next(err);
            console.log(foundSite);
            for(k = 0; k < foundSite.hives.length; k++) {
              if(foundSite.hives[k]._id == req.params.hiveId) {
                foundSite.hives[k].logbook.push(req.body);
              }
            }
            foundSite.save(function (err, savedSite) {
              if (err) return next(err);
              res.json(savedSite);
            });
          });
        }
      }
    }
  });
});

module.exports = router;
