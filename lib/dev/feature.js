var debug = require('debug')('vroom:feature');
var _ = require('underscore');
var parse = require('url').parse;
var path = require('path');
var mime = require('connect').mime;


/**
 * @param feature feature name
 * @param root feature root dir
 * @param {Context} context
 * @param options
 * @returns {Function} connect handler
 */
var feature = function(feature, root, context, options) {
    options = _.defaults(options || {}, {
        index: 'index.html',
        main: false
    });

    if (!root) throw new Error('feature() root path required');

    return function(req, res, next) {
        if ('GET' != req.method && 'HEAD' != req.method) return next();

        var pathname = parse(req.url).pathname;

        function error(err) {
            if (404 == err.status) next();
            else next(err);
        }

        var handlerOpt = {};

        if (pathname.substring(pathname.length-1,1) == '/') {
            pathname += options.index;
            if (options.main)
                handlerOpt.mainIndex = true;
        }

        if (pathname.substring(0,1) == '/')
            pathname = pathname.substring(1);

        var file = root + feature + '/' + pathname;
        var ext =  path.extname(file);

        debug('file %s (%s)', file, ext);

        if (handlers.hasOwnProperty(ext)) {
            var handler = handlers[ext];

            var type = mime.lookup(file);
            var charset = mime.charsets.lookup(type);
            res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
            return handler(file, handlerOpt, context, function(err, data, extra) {
                if (err) {
                    error(err);
                    return;
                }
                if (extra && extra.header) {
                    res.setHeader.apply(res, extra.header)
                }
                res.end(data);
            });
        } else {
            debug("unhandled type '%s'", ext);
            return next();
        }
    };
};


var handlers = {
    '.html': require('../html').parse,
    '.js': require('../script').parse,
    '.jsmap': require('../script').parseMap
}



module.exports = feature;