/**
 *
 * Created by jl on 3/15/15.
 */
var router = require('express').Router();
var User = require('../models/user');
var Profile = require('../models/profile');

var config = require('../configs/config');
var ERROR = require('../configs/ERROR');

router.route('/')
    .post(function(req,res){
        var data = req.body || {};
        var error = {};
        error.status = 0;
        error.msg = data.phone ? undefined : ERROR.PHONE_REQUIRED;
        error.msg = error.msg || (data.password ? undefined : ERROR.PASSWORD_REQUIRED);
        error.msg = error.msg || (data.passwordConfirmation === data.password ? undefined : ERROR.PASSWORD_CONFIRMATION_INVALID);
        if(error.msg){
            return res.status(200).send(error);
        }

        User.findOne({
            phone: data.phone
        },function(err,u){
            if(u){
                error.msg = ERROR.PHONE_TAKEN;
                return res.status(200).send(error);
            }
            var user = new User({
                phone: data.phone,
                password: data.password
            });
            user.save(function(err,u){
                if(u){
                    var profile = new Profile();
                    profile.uid = u._id;
                    profile.phone = u.phone;
                    profile.save(function(err,p){
                        return res.status(201).send({
                            status: 1
                        });
                    });
                }
            });
        });

    });

module.exports = router;
