// Load in dependencies
var fs = require('fs');
var util = require('util');
var _ = require('underscore');
var Command = require('commander-completion').Command;

function FirefoxBookmarks() {
  // Set up program
  Command.apply(this, arguments);

  // Bind our commands
  this.bindCommands();
}
util.inherits(FirefoxBookmarks, Command);
_.extend(FirefoxBookmarks, {
  name: 'firefox-bookmarks',
  bindCommands: function () {
    var program = this;
    var that = this;

    program
      .command('to-json [filepath]')
      .description('Parse a bookmarks file into simplified JSON')
      .action(function convertToJson (filepath, argv) {
        that.convertToJson(filepath, argv, function handleJson (err, json) {
          if (err) {
            throw err;
          } else {
            console.log(JSON.stringify(json));
          }
        });
      });
  },

  convertToJson: function (filepath, options, cb) {
    fs.readFile(filepath, 'utf8', function (err, rawBookmarksJson) {
      if (err) {
        return cb(err);
      } else {
        var rawBookmarks = JSON.parse(rawBookmarksJson);
        var collection = new BookmarkCollection(rawBookmarks, options);
        cb(null, collection.toJSON());
      }
    });
  }
});
