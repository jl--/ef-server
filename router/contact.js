'use strict';

var config = require('../configs/config');
var Contact = require('../models/contact');
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

        var query = Contact.find(conditions,fields,opts);
        query.exec(function(err, contact) {
            contact = archive.withField(contact,'name');
            return contact ? res.status(200).send({
                status: 1,
                currentPage: req.query.page || 1,
                count: contact.length,
                list: contact
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
        var contact = new Contact({
            uid: req.user.uid,
            name: data.name,
            phone: data.phone
        });
        contact.save(function(err,c){
            return c ? res.status(200).send({
                status: 1,
                contact: c
            }) : res.status(200).send({
                status: 0,
                error: err
            });
        });
    })
    .delete(jwt({
        secret: config.auth.secretToken
    }),function(req,res){
        var cids = req.body.contactIds.split('|');
        Contact.remove({
            _id: {
                $in: cids
            }
        }, function (err,numAffected) {
            return numAffected ? res.status(200).send({
                status: 1,
                numAffected:numAffected,
                deletedIds: req.body.contactIds
            }) : res.status(200).send({
                status: 0,
                error: err
            });
        });
    });

router.route('/page_count')
    .get(jwt({
        secret: config.auth.secretToken
    }),function(req,res){
        var query = {};
        Contact.count(query,function(err,count){
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