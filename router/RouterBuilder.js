/**
 *
 * Created by jl on 3/17/15.
 */

var config = require('../configs/config');
var jwt = require('express-jwt');

function RouterBuilder(Entity){
    this.router = require('express').Router();
    this.routes = [];
    this.entity = Entity;
}

/**
 *
 * @param route: path, handlers
 *
 * var route = {
 *  path: '/',
 *  handlers: [{
 *      method: 'get',
 *      isPublic: false,
 *      callback: func
 *  }]
 * }
 *
 *
 */
RouterBuilder.prototype.addRoute = function(route){
    function isRouteExisted(r){
        return r.path === route.path;
    }
    if(!this.routes.some(isRouteExisted)){
        this.routes.push(route);
    }
};

RouterBuilder.prototype.build = function(){
    var entity = this.entity;
    var router = this.router;
    this.routes.forEach(function(route){
        var r = router.route(route.path);
        route.handlers.forEach(function(handler){
            r[handler.method](handler.isPublic ? validationFunc : jwt({
                secret: config.auth.secretToken
            }),handler.callback.bind(entity));
        });
    });
    return this.router;
};


function validationFunc(req,res,next){
    next();
}




module.exports = Record;
