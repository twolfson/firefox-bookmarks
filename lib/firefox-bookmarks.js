// Load in dependencies
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

// Define our bookmark parser
function BookmarkCollection(bookmarks, options) {
  // Inherit from EventEmitter
  EventEmitter.call(this);

  // Fallback options
  options = options || {};

  // Parse now
  var bookmarksArr = BookmarkCollection.parse(bookmarks, options);
  this.bookmarksArr = bookmarksArr;

  // Save options for later
  this.options = options;
}

// Extend from EventEmitter
BookmarkCollection.parse = function (bookmarks, options) {
  // Denote the root of the bookmarks
  var bookmarksRoot = bookmarks;

  // Find the first child which contains all our bookmarks
  var whitelistedFolders = options.folders;
  var rootChildren = bookmarksRoot.children;
  var bookmarkMenu = rootChildren.filter(function (container) {
    // TODO: Consider container.root === 'bookmarksMenuFolder'
    return container.title === 'Bookmarks Menu';
  })[0];
  var bookmarkFolders = bookmarkMenu.children;
  var approvedFolders = bookmarkFolders;
  if (whitelistedFolders) {
    // TODO: It is possible for there to be bookmarks in the menu itself...
    approvedFolders = bookmarkFolders.filter(function (folder) {
      return whitelistedFolders.indexOf(folder.title) !== -1;
    });
  }

  // Format content
  function parseFolder(folder) {
    var children = folder.children || [];
    return {
      type: 'folder',
      title: folder.title,
      children: children.map(parseBookmark)
    };
  }
  function parseBookmark(bookmark) {
    // Find the proper description
    var annos = bookmark.annos || [];
    var descriptionNode = annos.filter(function (anno) {
      return anno.name === 'bookmarkProperties/description';
    })[0] || {};
    var description = descriptionNode.value || bookmark.title;

    // Grab the title and bookmark
    var title = bookmark.title;
    var uri = bookmark.uri;

    // If the uri is not defined, add the bookmark as a folder
    if (uri === undefined) {
      return parseFolder(bookmark);
    }

    // Create and return the object
    return {
      type: 'bookmark',
      title: title,
      dateAdded: bookmark.dateAdded,
      lastModified: bookmark.lastModified,
      description: description,
      uri: uri
    };
  }

  // Map and return the approved folders
  var retArr = approvedFolders.map(parseFolder);
  return retArr;
};

BookmarkCollection.prototype = _.extend({
  toArray: function () {
    return this.bookmarksArr;
  }
}, EventEmitter.prototype);

// Create sugar fn for parsing bookmarks
function parseBookmarks(bookmarks, options) {
  // Generate a new collection
  var collection = new BookmarkCollection(bookmarks, options);

  // Return the bookmarks as an array
  return collection.toArray();
}

// Expose the BookmarkCollection via parseBookmarks
parseBookmarks.BookmarkCollection = BookmarkCollection;

// Expose parseBookmarks
module.exports = parseBookmarks;