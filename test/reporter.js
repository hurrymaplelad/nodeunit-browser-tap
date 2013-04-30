var nodeunit = require('..'),
    fixtures = require('./fixtures'),
    testCase = nodeunit.testCase;
    noop = function() {};

function bufferStream(stream, done) {
  stream.pipe({
    output: '',
    writable: true,
    write: function (buf) {
      this.output += String(buf);
    },

    end: function (msg) {
      if (msg !== undefined) this.write(msg);
      done(this.output);
    },
    destroy: noop,

    // Event emitter
    emit: noop,
    on: noop,
    removeListener: noop
  });
}

function captureSuiteOutput(suite, done) {
  bufferStream(nodeunit.run(suite), done);
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
