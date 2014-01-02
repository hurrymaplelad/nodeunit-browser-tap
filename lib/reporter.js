var async = window.async = require('./nodeunit'),
    // Too bad CommonJS nodeunit isn't browerifiable, and browser nodeunit isn't CommonJS :(
    // Just assume the browser version has attached itself to window and exported async for some reason.
    nodeunit = window.nodeunit,
    tape = require('tape');

module.exports = nodeunit;

nodeunit.run = function(modules, options) {
  options = options || {};
  var harness = options.harness || tape;

  harness(' ', function(t) {
    // forked from tape to avoid str.trim()
    var comment = function(msg) {
      t.emit('result', msg.replace(/^#\s*/, ''));
    };

    nodeunit.runModules(modules, {

      moduleStart: function(name) {
        comment(name.toString());
      },

      testStart: function(name) {
        comment(name.toString());
      },

      testDone: function(name, assertions) {
        var assertion,
            i;

        for (i = 0; i < assertions.length; i++) {
          assertion = assertions[i];
          t._assert(assertion.passed(), {
            message: assertion.message,
            operator: assertion.method || 'error',
            expected: assertion.expected,
            actual: assertion.actual || assertion.error,
            error: assertion.error
          });
        }
      },

      done: function(assertions) {
        t.end();
      }
    });
  });
};
