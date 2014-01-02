var nodeunit = require('..'),
    fixtures = require('./fixtures'),
    tape = require('tape'),
    stream = require('stream'),
    noop = function() {};

function bufferStream(s, done) {
  var output = '',
      writable = new stream.Writable();

  writable._write = function(buffer, encoding, done) {
    output += buffer;
    done();
  }

  writable.on('finish', function() {
    done(output);
  });

  s.pipe(writable);
}

function captureSuiteOutput(suite, done) {
  var harness = tape.createHarness(),
      stream = harness.createStream();
  bufferStream(stream, done);
  nodeunit.run(suite, {harness: harness});
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
