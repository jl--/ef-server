;
'use strict';

var config = require('./config');
var db = require('./db');
var User = require('../models/user');
var Profile = require('../models/profile');


// init
module.exports = function init() {
    db.start();

    User.findOne()
        .exec(function(err, user) {
            if (user) {
                return;
            }
            var me = new User({
                phone: config.account.phone,
                password: config.account.password
            });
            me.save(function(err,u){
                if(u){
                    var profile = new Profile();
                    profile.uid = u._id;
                    profile.phone = u.phone;
                    profile.save();
                }
            });
        });

};