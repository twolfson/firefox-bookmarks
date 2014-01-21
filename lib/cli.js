// Load in dependencies
var fs = require('fs');
var util = require('util');
var _ = require('underscore');
var Command = require('commander-completion').Command;

function FirefoxBookmarksCli() {
  // Set up program
  Command.apply(this, arguments);

  // Bind our commands
  this.bindCommands();
}
util.inherits(FirefoxBookmarksCli, Command);
_.extend(FirefoxBookmarksCli.prototype, {
  name: 'firefox-bookmarks',
  bindCommands: function () {
    var program = this;
    var that = this;

    program
      .command('to-json [filepath]')
      .description('Parse a bookmarks file into simplified JSON')
      .action(function convertToJson (filepath, argv) {
        that.toJSON(filepath, argv, function handleJson (err, json) {
          if (err) {
            throw err;
          } else {
            console.log(JSON.stringify(json));
          }
        });
      });

    program
      .command('flatten [filepath]')
      .description('Flatten a bookmarks file into simplified bookmarks')
      .action(function flattenBookmarks (filepath, argv) {
        that.flatten(filepath, argv, function handleJson (err, json) {
          if (err) {
            throw err;
          } else {
            console.log(JSON.stringify(json));
          }
        });
      });
  },

  loadCollection: function (filepath, options, cb) {
    fs.readFile(filepath, 'utf8', function (err, rawBookmarksJson) {
      if (err) {
        return cb(err);
      } else {
        var rawBookmarks = JSON.parse(rawBookmarksJson);
        var collection = new BookmarkCollection(rawBookmarks, options);
        cb(null, collection);
      }
    });
  },

  toJSON: function (filepath, options, cb) {
    this.loadCollection(filepath, options, function (err, collection) {
      if (err) {
        return cb(err);
      } else {
        cb(null, collection.toJSON());
      }
    });
  },

  flatten: function (filepath, options, cb) {
    this.loadCollection(filepath, options, function (err, collection) {
      if (err) {
        return cb(err);
      } else {
        cb(null, collection.flatten());
      }
    });
  }
});

// Export our FirefoxBookmarksCli
module.exports = FirefoxBookmarksCli;