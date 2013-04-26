var nodeunit = require('..'),
    sinon = require('sinon'),
    fixtures = require('./fixtures'),
    testCase = nodeunit.testCase;

function captureSuiteOutput(suite, done) {
  var output = '';
  sinon.stub(console, 'log', function(str) {
    output += str;
  });
  nodeunit.run(suite, function() {
    console.log.restore();
    done(output);
  });
}

nodeunit.run({'Browser TAP reporter': {

  'given a suite of passing tests': function(test) {
    captureSuiteOutput([fixtures.passing], function(output) {
      test.ok(
        /# tests 1/.test(output),
        'should report test completion'
      );

      test.ok(
        /# pass  1/.test(output),
        'should report passed tests'
      );

      test.done();
    });
  },

  'given a suite with failing tests': function(test) {
    captureSuiteOutput([fixtures.failing], function(output) {
      test.ok(
        /# fail  1/.test(output),
        'should report failed tests'
      );

      test.done();
    });
  },

  'given a suite that throws': function(test) {
    captureSuiteOutput([fixtures.throwing], function(output) {
      test.ok(
        /not ok.*thrown from a test/.test(output),
        'should fail throwing tests with thrown error message'
      );

      test.done();
    });
  }
}});
