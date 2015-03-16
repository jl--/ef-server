;'use strict';

var mongoose = require('mongoose');
var config = require('../configs/config');
var Schema = mongoose.Schema;

var CALL_STATUS = ['R','P']; // read, pending

var Call = new Schema({
    uid: {type: Schema.Types.ObjectId, required: true},
    caller_name: {type:String,trim: true},
    caller_phone: {type: String,trim: true},
    date: {type: Number},
    status: {type: String, enum: CALL_STATUS}
});





module.exports = mongoose.model('Call',Call);