// Load in dependencies
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
  }
});

// TODO: Remove this hardcoded junk -- use commander or optimist to parse options
// Load in bookmarks and options
console.log('Loading content...');
var cwd = process.cwd();
var bookmarks = require(cwd + '/bookmarks.orig.json');
var options = require(cwd + '/config');

// Parse our bookmarks through the library
// TODO: Switch parser to event emitter based
console.log('Formatting bookmarks...');
var BookmarkCollection = require('../');

// Create sugar fn for parsing bookmarks
function parseBookmarks(bookmarks, options) {
  // Generate a new collection
  var collection = new BookmarkCollection(bookmarks, options);

  // Return the bookmarks as an array
  return collection.toJSON();
}

var parsedBookmarks = parseBookmarks(bookmarks, options);

// Guarantee an output folder
var path = require('path');
var mkdirp = require('mkdirp');
var outputFile = cwd + '/bookmarks.json';
var outputDir = path.dirname(outputFile);
mkdirp.sync(outputDir);

// Spit out the content into a file
var fs = require('fs');
var retStr = JSON.stringify(parsedBookmarks, null, 4);
fs.writeFileSync(outputFile, retStr, 'utf8');

var retMinStr = JSON.stringify(parsedBookmarks);
fs.writeFileSync(cwd + '/bookmarks.min.json', retMinStr, 'utf8');

// Notify the user
console.log('Done!');
