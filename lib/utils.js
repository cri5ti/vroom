var _ = require('underscore');


exports.jobs = {};

/**
 * Queues several async jobs and calls the done callback when all of them are done.
 */
exports.jobs.parallel = function() {
    var count = 0;
    var _done = null;

    var checkDone = function() {
        if (count==0 && _done) {
            _done();
            _done = null
        }
    }


    return {
        /**
         * starts a new job and returns the wrapped callback that marks this job as complete
         * @param call the callback to be wrapped
         * @returns {Function} the wrapped callback
         */
        queue: function(call) {
            count++;
            return function() {
                if (call) call.apply(this, arguments);
                count--;
                checkDone();
            }
        },

        /**
         * Sets the callback for all jobs complete.
         * @param {Function} done
         */
        done: function(done) {
            _done = done;
            checkDone();
        }
    };
};


/**
 * Chains several jobs, calling them sequentially
 */
exports.jobs.chain = function() {
    var queue = [];

    function unqueue() {
        var next = queue.shift();
        if (next) {
            next(unqueue);
        }
    }

    return {
        /**
         * Chain a new job
         * @param {Function(callback)} function to queue that accepts a callback parameter when it's done.
         */
        chain: function(call) {
            queue.push(partial(call, _.rest(arguments,1)))
        },
        run: function(done) {
            if (done)
                this.chain(done);
            unqueue();
        }
    }
};


/**
 * Underscore _.partial variant where the arguments are provided as an array
 */
var partial = exports.partial = function(func, args) {
    return function() {
        return func.apply(this, _.union(args, arguments));
    };
}