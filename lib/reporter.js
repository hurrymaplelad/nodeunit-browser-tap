var tape = require('tape'),
    // Too bad CommonJS nodeunit isn't browerifiable, and browser nodeunit isn't CommonJS :(
    // Just assume the browser version has attached itself to window.
    nodeunit = window.nodeunit;

module.exports = nodeunit;

nodeunit.run = function(modules) {
  var harness = tape.createHarness();

  // defer a tick to give users an oppourtunity to pipe output
  process.nextTick(function() {
    harness(' ', function(t) {
      nodeunit.runModules(modules, {

        moduleStart: function(name) {
          t.comment(name.toString());
        },

        testStart: function(name) {
          t.comment(name.toString());
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
  });
  return harness.stream;
};
