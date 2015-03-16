'use strict';

var config = require('../configs/config');
var Call = require('../models/call');
var jwt = require('express-jwt');
var router = require('express').Router();


router.param('callIds',function(req,res,next,callIds){
    req.callIds = callIds.split('|');
    next();
});

router.route('/')
    .get(jwt({
        secret: config.auth.secretToken
    }), function(req, res) {
        Call.find({
            uid: req.user.uid
        },function(err, call) {
            return call ? res.status(200).send({
                status: 1,
                list: call
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
        var call = new Call({
            uid: req.user.uid,
            caller_name: data.caller_name,
            caller_phone: data.caller_phone,
            status: data.status || 'P',
            date: data.date || (new Date()).getTime()
        });
        call.save(function(err,c){
            return c ? res.status(200).send({
                status: 1,
                call: c
            }) : res.status(404).send({
                status: 0,
                error: err
            });
        });
    })
    .delete(jwt({
        secret: config.auth.secretToken
    }),function(req,res){
        var cids = req.body.callIds.split('|');
        Call.remove({
            _id: {
                $in: cids
            }
        }, function (err,numAffected) {
            return numAffected ? res.status(200).send({
                status: 1,
                numAffected:numAffected,
                deletedIds: req.body.callIds
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
        var cids = req.body.callIds.split('|');
        var toStatus = req.body.status === 'P' ? 'P' : 'R';
        Call.update({
            _id: {
                $in: cids
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
                callIds: req.body.callIds,
                toStatus: toStatus
            }) : res.status(400).send({
                status: 0,
                error: err
            });
        });
    });


module.exports = router;