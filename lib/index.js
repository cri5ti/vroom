
var express = require('express');
var _ = require('underscore');

var parse = require('url').parse;
var fs = require('fs');
var path = require('path');
var debug = require('debug')('vroom');
var mime = express.mime;

var cheerio = require('cheerio');

var vroom = {};


var feature = function(feature, root, options) {
    var options = _.defaults(options || {}, {
        index: 'index.html'
    });

    if (!root) throw new Error('feature() root path required');

    return function(req, res, next) {
        if ('GET' != req.method && 'HEAD' != req.method) return next();

        var pathname = parse(req.url).pathname;

        function error(err) {
            if (404 == err.status) return next();
            next(err);
        }

        if (pathname.substring(pathname.length-1,1) == '/')
            pathname += options.index

        if (pathname.substring(0,1) == '/')
            pathname = pathname.substring(1);

        var dir = root + feature + '/';
        var fullpath = dir + pathname;

        debug('dir', dir);
        debug('fullpath', fullpath);

        parseHtml(dir, fullpath, function(err, data) {
            if (err) {
                error(err);
                return;
            }

            if (res.getHeader('Content-Type')) return;
            var type = mime.lookup(fullpath);
            var charset = mime.charsets.lookup(type);
            debug('content-type %s', type);
            res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));

            res.send(data);
        });

    };
};


var remapClass = function(className) {
    return "x-renamed-" + className;
}

var remapClasses = function(classes) {
    classes = classes.split(' ');
    classes = classes.map(function(cls) {
        return remapClass(cls);
    });
    console.log(classes);
    return classes.join(' ');
};


var parseHtml = function(dir, fullpath, done) {

    debug(fullpath);

    fs.readFile( fullpath, function(err, data) {
        if (err) done(err);

        var $ = cheerio.load(data);

        var sync = async();

        $('*[class]').each(function(i, el) {
            $(this).attr('class', remapClasses(el.attribs.class));
        });

        $('import').each(function(i, el) {
            var src = el.attribs.src;
            var self = this;
            parseHtml(dir, dir + src, sync.queue(function(err, data) {
                console.log(data);
                $(self).replaceWith($(data));
            }));
        });

        sync.done(function() {
            done(null, $.html());
        });
    });

}


var async = function() {
    var count = 0;
    var _done = null;

    var checkDone = function() {
        if (count==0 && _done) {
            _done();
            _done = null
        }
    }

    return {
        queue: function(call) {
            count++;
            return function() {
                if (call) call.apply(this, arguments);
                count--;
                checkDone();
            }
        },
        done: function(done) {
            _done = done;
            checkDone();
        }
    };
};


/**
 * @param opt
 * @param opt.port
 * @param opt.featuresDir
 * @param opt.mainFeature
 */
vroom.devServer = function(opt) {

    opt = _.defaults(opt, {
        port: 8080
    });

    var app = express();

    app.use(feature(opt.mainFeature, opt.featuresDir));

    var server = app.listen(opt.port);

    console.log("Development server started on port :" + opt.port);
}

module.exports = vroom;