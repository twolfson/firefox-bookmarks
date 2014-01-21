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

// Basic test
describe('bookmarks', function () {
  describe('formatting a simple set of bookmarks', function () {
    before(function () {
      // Parse the bookmarks
      var input = require('./test_files/simple.input.json');
      this.bookmarks = new BookmarkCollection(input, {
        "folders": ["web dev code"]
      });
      this.output = this.bookmarks.toJSON();
    });
    debugOutput('simple.output.json');

    it('returns an matching array of bookmarks', function () {
      // Compare actual output to expected output
      var actualBookmarks = this.output;
      var expectedBookmarks = require('./expected_files/simple.output.json');
      assert.deepEqual(actualBookmarks, expectedBookmarks);
    });
  });

  describe('formatting a nested set of bookmarks', function () {
    before(function () {
      // Parse the bookmarks
      var input = require('./test_files/nested.input.json');
      this.bookmarks = new BookmarkCollection(input, {
        "folders": ["web dev code"]
      });
      this.output = this.bookmarks.toJSON();
    });
    debugOutput('nested.output.json');

    it('returns an matching array of bookmarks', function () {
      // Compare actual output to expected output
      var actualBookmarks = this.output;
      var expectedBookmarks = require('./expected_files/nested.output.json');
      assert.deepEqual(actualBookmarks, expectedBookmarks);
    });
  });
});
