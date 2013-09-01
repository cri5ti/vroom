var _ = require('underscore');
var connect = require('connect');


var feature = require('./feature');

/**
 * @param opt
 * @param opt.port
 * @param opt.featuresDir
 * @param opt.mainFeature
 */
exports.start = function(context, opt) {

    opt = _.defaults(opt, {
        port: 8080
    });

    var app = connect();

    // setup main app
    app.use(feature(opt.mainFeature, opt.featuresDir, context, {main: true}));

    var server = app.listen(opt.port);

    console.log("Development server started on port :" + opt.port);
}