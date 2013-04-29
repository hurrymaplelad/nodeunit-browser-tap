# nodeunit-browser-tap
[Nodeunit](https://github.com/caolan/nodeunit) browser-side [TAP](http://testanything.org/) reporter for use with [Testling CI](http://ci.testling.com/).

[![browser support](https://ci.testling.com/hurrymaplelad/nodeunit-browser-tap.png)](https://ci.testling.com/hurrymaplelad/nodeunit-browser-tap)

Like Nodeunit's baked-in TAP reporter, but meant to run in the browser following Testling's convention of writing test results to `console.log`.

## Usage

    npm install nodeunit-browser-tap

Write your `test.js`

    var nodeunit = require('nodeunit-browser-tap');

    nodeunit.run([{
      "Ceci nes't pas une test": function(test) {
        test.notStrictEqual(this, 'une test');
        test.done();
      }
    }]);

And run it.  Browserify and Testling make this easy

    browserify test.js | testling


## Self Hosted Tests

    npm install && npm test
