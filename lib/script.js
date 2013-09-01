var debug = require('debug')('vroom:script');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var UglifyJS = require("uglify-js");

var script = module.exports = {};


/**
 * @param file file to parse
 * @param opt
 * @param {bool} opt.sourceMap true renders the sourceMap instead of the script
 * @param context context
 * @param done callback(err,done,extra)
 */
function parse(file, opt, context, done) {

    debug("parse()", file);

    var sourceMap = !!opt.sourceMap;
    if (sourceMap) {
        file = path.join(path.dirname(file), path.basename(file, '.jsmap') + '.js');
        debug("sourcemap of %s", file);
    }


    fs.readFile( file, function(err, data) {
        if (err) return done(err);

        var code = data.toString();

        var toplevel = UglifyJS.parse(code, {
            filename: '?',
            toplevel: null
        });


//        function visitor(node, descend) {
////            if (node instanceof UglifyJS.AST_Function) {
//                s += node.TYPE
//                    + (node.value ? ' ' + node.value : '')
//                    + (node.name ? ' ' + node.name : '')
//                    + '\n';
//                console.log(node.name);
////                console.log(UglifyJS.string_template("Found function {name} at {line},{col}", {
////                    name: node.name.name,
////                    line: node.start.line,
////                    col: node.start.col
////                }));
////            }
//        };
//        toplevel.walk(new UglifyJS.TreeWalker(visitor));


        var source_map = UglifyJS.SourceMap({
//            file : null, // the compressed file name
//            root : null, // the root URL to the original sources
//            orig : null, // the input source map
        });


        var stream = UglifyJS.OutputStream({
//            indent_start  : 0,     // start indentation on every line (only when `beautify`)
//            indent_level  : 4,     // indentation level (only when `beautify`)
//            quote_keys    : false, // quote all keys in object literals?
//            space_colon   : true,  // add a space after colon signs?
//            ascii_only    : false, // output ASCII-safe? (encodes Unicode characters as ASCII)
//            inline_script : false, // escape "</script"?
//            width         : 80,    // informative maximum line width (for beautified output)
//            max_line_len  : 32000, // maximum line length (for non-beautified output)
//            ie_proof      : true,  // output IE-safe code?
            beautify      : true, // beautify output?
            source_map    : source_map,  // output a source map
//            bracketize    : false, // use brackets every time?
//            comments      : false, // output comments?
//            semicolons    : true,  // use semicolons to separate statements? (otherwise, newlines
        });


        toplevel.print(stream);


        if (sourceMap) {
            var map = source_map.toString();
            done(null, map);
        } else {
            var code = stream.toString();
            done(null, code, { header: ['SourceMap', path.basename(file, '.js') + '.jsmap'] });
        }
    });
};



script.parse = parse;
script.parseMap = function(file, opt, context, done) {
    parse(file, _.extend(opt, {sourceMap: true}), context, done);
}