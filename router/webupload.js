'use strict';

var config = require('../configs/config');
var Call = require('../models/call');
var Message = require('../models/message');
var jwt = require('express-jwt');
var router = require('express').Router();



router.route('/')
    .post(jwt({
        secret: config.auth.secretToken
    }), function(req,res){
        var data = req.body;
        var uid = req.user.uid;
        var callList = data && data.callList || [];
        var smsList = data && data.smsList || [];
        callList.forEach(function(item){
            item.uid = uid;
        });
        smsList.forEach(function(item){
            item.uid = uid;
        });
        var feedback = {};
        Call.create(callList)
            .then(function(){
                var list = Array.prototype.slice.call(arguments || [], 0);
                console.log('///callList created:');
                console.log(list);
                feedback.callList = list;
                return Message.create(smsList).then(function(){
                    var list = Array.prototype.slice.call(arguments || [], 0);
                    console.log('///smsList created:');
                    console.log(list);
                    feedback.smsList = list;
                });
            }).then(function(){
                return res.status(201).send(feedback);
            },function(err){
                return res.status(200).send(err);
            });
    });


module.exports = router;