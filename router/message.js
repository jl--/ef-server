'use strict';

var config = require('../configs/config');
var Message = require('../models/message');
var jwt = require('express-jwt');
var router = require('express').Router();
var archive = require('../utils/archive');

router.route('/')
    .get(jwt({
        secret: config.auth.secretToken
    }), function(req, res) {
        var conditions = {};
        var fields = null;
        var opts = {};

        conditions.uid = req.user.uid;

        if(req.query.status) conditions.status = req.query.status;
        if(req.query.page){
            opts.limit = config.app.perPage;
            opts.skip = (req.query.page - 1) * config.app.perPage;
        }
        opts.sort = {
            date: -1
        };

        var query = Message.find(conditions,fields,opts);
        query.exec(function(err, message) {
            if(message && req.query.archive){
                message = archive.withDate(message);
                return res.status(200).send({
                    status: 1,
                    archive: message
                });
            }
            return message ? res.status(200).send({
                status: 1,
                currentPage: req.query.page || 1,
                count: message.length,
                list: message
            }) : res.status(200).send({
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
            }) : res.status(200).send({
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
            }) : res.status(200).send({
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
            }) : res.status(200).send(err || {});
        });
    });

router.route('/page_count')
    .get(jwt({
        secret: config.auth.secretToken
    }),function(req,res){
        var query = {};
        Message.count(query,function(err,count){
            return count !== undefined ? res.status(200).send({
                status: 1,
                pageCount: Math.ceil(count / config.app.perPage)
            }) : res.status(200).send({
                status: 0,
                error: err
            });
        });
    });


module.exports = router;