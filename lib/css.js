var debug = require('debug')('vroom:css');

var css = module.exports = {};





css.Context = function Context() {
    this.remap = {};
}

css.Context.prototype.remapClass = function(from) {
    if (this.remap.hasOwnProperty(from))
        return this.remap[from];

    var to = "x-renamed-" + from;
    debug("remap '%s' -> '%s'", from, to);

    // cache
    this.remap[from] = to;

    return to;
}

css.Context.prototype.remapClasses = function(classes) {
    var self = this;
    classes = classes.split(' ');
    classes = classes.map(function(cls) {
        return self.remapClass(cls);
    });
    return classes.join(' ');
};