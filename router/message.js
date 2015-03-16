'use strict';

var config = require('../configs/config');
var Message = require('../models/message');
var jwt = require('express-jwt');
var router = require('express').Router();


router.param('messageIds',function(req,res,next,messageIds){
    req.messageIds = messageIds.split('|');
    next();
});

router.route('/')
    .get(jwt({
        secret: config.auth.secretToken
    }), function(req, res) {
        Message.find({
            uid: req.user.uid
        },function(err, message) {
            return message ? res.status(200).send({
                status: 1,
                list: message
            }) : res.status(404).send({
                status: 0,
                error: err
            });
        });
    })
    .post(jwt({
        secret: config.auth.secretToken
    }), function(req,res){
        var data = req.body;
        var message = new Message({
            uid: req.user.uid,
            sender_phone: data.sender_phone,
            sender_name: data.sender_name,
            content: data.content,
            status: data.status || 'P',
            date: data.date || (new Date()).getTime()
        });
        message.save(function(err,m){
            return m ? res.status(200).send({
                status: 1,
                message: m
            }) : res.status(404).send({
                status: 0,
                error: err
            });
        });
    })
    .delete(jwt({
        secret: config.auth.secretToken
    }),function(req,res){
        var mids = req.body.messageIds.split('|');
        Message.remove({
            _id: {
                $in: mids
            }
        }, function (err,numAffected) {
            return numAffected ? res.status(200).send({
                status: 1,
                numAffected:numAffected,
                deletedIds: req.body.messageIds
            }) : res.status(400).send({
                status: 0,
                error: err
            });
        });
    });

router.route('/status')
    .put(jwt({
        secret: config.auth.secretToken
    }),function(req,res){
        var mids = req.body.messageIds.split('|');
        var toStatus = req.body.status === 'P' ? 'P' : 'R';
        Message.update({
            _id: {
                $in: mids
            }
        },{
            $set: {
                status: toStatus
            }
        },{
            multi: true
        },function(err, numAffected){
            return numAffected ? res.status(200).send({
                status: 1,
                numAffected:numAffected,
                messageIds: req.body.messageIds,
                toStatus: toStatus
            }) : res.status(400).send(err || {});
        });
    });


module.exports = router;