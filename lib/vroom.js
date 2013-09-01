
//var express = require('express');
//var _ = require('underscore');
//
//var path = require('path');
//var debug = require('debug')('vroom');
//var mime = express.mime;
//



var vroom = {};

vroom.dev = require('./dev/');

exports = module.exports = function() {

    var app = {};

    app.startDevServer = function(opt) {
        var Context = require('./context');
        var context = new Context();

        vroom.dev.server.start(context, opt);
    }

    return app;
};