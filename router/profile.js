;
'use strict';

var config = require('../configs/config');
var Profile = require('../models/profile');
var router = require('express').Router();


router.route('/')
    .get(function(req, res) {
        Profile.findOne(function(err, profile) {
            return profile ? res.status(200).send(profile) : res.status(404).send(err || {});
        });
    });

module.exports = router;