;
'use strict';

var router = require('express').Router();
var User = require('../models/user');
var config = require('../configs/config');

var jwt = require('jsonwebtoken');
var validator = require('../utils/validator');
var ERROR = require('../configs/ERROR');


router.route('/')
    .post(function(req, res) {
        var error = {};
        error.status = 0;


        error.msg = req.body.phone ? undefined : ERROR.PHONE_REQUIRED;
        error.msg = error.msg || (req.body.password ? undefined : ERROR.PASSWORD_REQUIRED);

        if (error.msg) {
            return res.status(400).send(error);
        }

        User.findOne({
            phone: req.body.phone
        }).exec(function(err, user) {
            if (!user) {
                error.msg = ERROR.ACCOUNT_NOT_EXISTS;
                return res.status(400).send(error);
            }
            user.comparePassword(req.body.password, function(err, isMatch) {
                error.msg = err ? 'terminal error' : undefined;
                error.msg = error.msg || (!isMatch ? ERROR.ACCOUNT_NOT_MATCH : undefined);
                if (error.msg) {
                    return res.status(400).send(error);
                } else {
                    // sign a jwt token.
                    var token = jwt.sign({
                        uid: user.id,
                        phone: user.phone
                    }, config.auth.secretToken, {
                        expiresInMinutes: config.auth.expiresInMinutes
                    });
                    return res.status(201).send({
                        status: 1,
                        //user: user,
                        token: token
                    });
                }
            });

        });

    });


module.exports = router;