'use strict';

var ERROR = {


    // ensure equired
    PHONE_REQUIRED: 'phone is required',
    PASSWORD_REQUIRED: 'password is required',

    // ensure pattern
    PASSWORD_INVALID:'password pattern invalid',
    PASSWORD_CONFIRMATION_INVALID: 'password confirmation invalid',

    // ensure match
    ACCOUNT_NOT_MATCH: 'account info not match',

    // ensure unique
    PHONE_TAKEN: 'email taken',

    // existance
    ACCOUNT_NOT_EXISTS: 'account not exist.'
};

module.exports = ERROR;