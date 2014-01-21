// Load in dependencies
var assert = require('assert');
var fs = require('fs');
var BookmarkCollection = require('../');

function debugOutput(filename) {
  before(function (done) {
    if (process.env.DEBUG_TEST) {
      fs.writeFile(__dirname + '/actual_files/' + filename, JSON.stringify(this.output, null, 4), done);
    } else {
      process.nextTick(done);
    }
  });
}

// TODO: Test bookmark in menu

// Basic tests
describe('A simple set of bookmarks', function () {
  describe('parsed into `firefox-bookmarks`', function () {
    before(function () {
      // Parse the bookmarks
      var input = require('./test_files/simple.input.json');
      this.bookmarks = new BookmarkCollection(input, {
        folders: ['web dev code']
      });
    });

    describe('when output as JSON', function () {
      before(function () {
        this.output = this.bookmarks.toJSON();
      });
      debugOutput('simple.output.json');

      it('returns an matching array of bookmarks and folders', function () {
        // Compare actual output to expected output
        var expectedBookmarks = require('./expected_files/simple.output.json');
        assert.deepEqual(this.output, expectedBookmarks);
      });
    });

    describe('when flattened', function () {
      before(function () {
        this.output = this.bookmarks.flatten();
      });
      debugOutput('simple.flatten.json');

      it('returns an matching array of minimalist bookmarks', function () {
        // Compare actual output to expected output
        var expectedBookmarks = require('./expected_files/simple.flatten.json');
        assert.deepEqual(this.output, expectedBookmarks);
      });
    });
  });
});

describe('A nested set of bookmarks', function () {
  describe('parsed into `firefox-bookmarks`', function () {
    before(function () {
      // Parse the bookmarks
      var input = require('./test_files/nested.input.json');
      this.bookmarks = new BookmarkCollection(input, {
        "folders": ["web dev code"]
      });
    });

    describe('when output as JSON', function () {
      before(function () {
        this.output = this.bookmarks.toJSON();
      });
      debugOutput('nested.output.json');

      it('returns an matching array of bookmarks and folders', function () {
        // Compare actual output to expected output
        var expectedBookmarks = require('./expected_files/nested.output.json');
        assert.deepEqual(this.output, expectedBookmarks);
      });
    });

    describe.skip('when flattened', function () {
      it('', function () {

      });
    });
  });
});
