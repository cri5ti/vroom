
/**
    Represents the context, or session.
 */

function Context() {
    this.css = new (require('./css').Context)();
}

module.exports = Context;



