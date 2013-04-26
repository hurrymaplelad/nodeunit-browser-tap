var assert = require('tap-assert'),
    TapProducer = require('tap-producer'),
    // Too bad CommonJS nodeunit isn't browerifiable, and browser nodeunit isn't CommonJS :(
    // Just assume the browser version has attached itself to window.
    nodeunit = window.nodeunit;

module.exports = nodeunit;

function formatFailedAssertion(assertion) {
  var error = assertion.error;
  return {
    wanted: error.expected,
    found: error.actual,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    }
  };
}

nodeunit.run = function(modules, done) {
  var output = new TapProducer();

  output.on('data', function(x) {
    console.log(x.toString());
  });

  nodeunit.runModules(modules, {

    moduleStart: function(name) {
      output.write(name.toString());
    },

    testStart: function(name) {
      output.write(name.toString());
    },

    testDone: function(name, assertions) {
      var assertion,
          extra,
          i;

      for (i = 0; i < assertions.length; i++) {
        assertion = assertions[i];
        extra = assertion.failed() ? formatFailedAssertion(assertion) : null;
        output.write(assert(assertion.passed(), assertion.message, extra));
      }
    },

    done: function(assertions) {
      output.end();
      done && done();
    }
  });
};
