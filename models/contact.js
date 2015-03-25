;'use strict';

var mongoose = require('mongoose');
var config = require('../configs/config');
var Schema = mongoose.Schema;


var Contact = new Schema({
    uid: {type: Schema.Types.ObjectId, required: true},
    name: String,
    phone: {type:String,trim: true}
});





module.exports = mongoose.model('Contact',Contact);