var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var debug = require('debug')('vroom:html');
var cheerio = require('cheerio');

var css = require('./css');
var utils = require('./utils');


var html = module.exports = {};

html.parse = function(file, opt, context, done) {

    debug("parse()", file);

    fs.readFile( file, function(err, data) {
        if (err) done(err);

        var thisContext = _.extend(context, {
            file: file
        });

        var $ = cheerio.load(data);

        var jobs = utils.jobs.chain();

        if (opt.mainIndex) {
            jobs.chain(processMainIndex, $, opt, thisContext);
        }

        jobs.chain(processRemapClasses, $, opt, thisContext);

        jobs.chain(processImports, $, opt, thisContext);

        jobs.run(function() {
            done(null, $.html());
        });
    });

}

function processMainIndex($, opt, context, next) {
    debug('process main index');

    $('head').prepend($('<script src="*/lib/require.js"></script>'));

    next();
}

function processRemapClasses($, opt, context, next) {
    debug('process remap classes');
    // remap classes
    $('*[class]').each(function(i, el) {
        $(this).attr('class', context.css.remapClasses(el.attribs.class));
    });
    next();
}

function processImports($, opt, context, next) {
    var jobs = utils.jobs.parallel()
    var dir = path.dirname(opt.file);

    $('import').each(function(i, el) {
        var src = el.attribs.src;
        var self = this;

        html.parse(path.join(dir, src), opt, context, jobs.queue(function(err, data) {
            $(self).replaceWith($(data));
        }));
    });

    jobs.done(function() {
        next();
    });
}