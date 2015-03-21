;
'use strict';

var config = require('../configs/config');
var Profile = require('../models/profile');
var User = require('../models/user');
var router = require('express').Router();
var jwt = require('express-jwt');


router.route('/')
    .get(jwt({
        secret: config.auth.secretToken
    }),function(req, res) {
        Profile.findOne({uid:req.user.uid},function(err, profile) {
            return profile ? res.status(200).send({status: 1,profile: profile}) : res.status(200).send({status: 0, error: err});
        });
    });

module.exports = router;