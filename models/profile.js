;'use strict';

var mongoose = require('mongoose');
var config = require('../configs/config');
var Schema = mongoose.Schema;


var genderEnum = ['female,male','private'];

var Profile = new Schema({
    uid: {type: Schema.Types.ObjectId},
    phone: {type: String, required: true, index: {unique: true}, trim: true},
    name: {type:String,trim: true}
});





module.exports = mongoose.model('Profile',Profile);