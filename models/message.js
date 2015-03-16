;'use strict';

var mongoose = require('mongoose');
var config = require('../configs/config');
var Schema = mongoose.Schema;

var MESSAGE_STATUS = ['R','P']; // read, pending

var Message = new Schema({
    // user id, receiver
    uid: {type: Schema.Types.ObjectId, required: true},
    sender_phone: {type:String,trim: true},
    sender_name: {type: String, trim: true},
    content: {type: String, trim: true},
    date: {type: Number},
    status: {type: String, enum: MESSAGE_STATUS}
});





module.exports = mongoose.model('Message',Message)