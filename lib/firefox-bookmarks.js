// Load in dependencies
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

// Define our bookmark parser
function BookmarkCollection(rawBookmarks, options) {
  // Inherit from EventEmitter
  EventEmitter.call(this);

  // Fallback options
  options = options || {};

  // Parse now
  var bookmarks = BookmarkCollection.parse(rawBookmarks, options);
  this._bookmarks = bookmarks;

  // Save options for later
  this.options = options;
}

// Define constants
BookmarkCollection.types = {
  FOLDER: 'folder',
  BOOKMARK: 'bookmark'
};

// Extend from EventEmitter
BookmarkCollection.parse = function (rawBookmarks, options) {
  // Denote the root of the bookmarks
  var bookmarksRoot = rawBookmarks;

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
      type: BookmarkCollection.types.FOLDER,
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
      type: BookmarkCollection.types.BOOKMARK,
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

BookmarkCollection.flatten = function (nodes) {
  // Iterate over the nodes via a breadth first compaction
  var retArr = [];
  nodes.forEach(function (node) {
    // If the node is a bookmark, add it
    if (node.type === BookmarkCollection.types.BOOKMARK) {
      retArr.push(node);
    // Otherwise, if the node is a folder
    } else {
      // Flatten and add its children
      var flattenedChildren = BookmarkCollection.flatten(node.children || []);
      retArr.push.apply(retArr, flattenedChildren);
    }
  });

  // Return the flattened list of bookmarks
  return retArr;
};

BookmarkCollection.prototype = _.defaults({
  toJSON: function () {
    return this._bookmarks;
  },
  flatten: function () {
    // Flatten the structure
    var bookmarks = BookmarkCollection.flatten(this.toJSON());

    // Remove unnecessary `type`
    var minBookmarks = bookmarks.map(function (bookmark) {
      var retObj = _.clone(bookmark);
      delete retObj.type;
      return retObj;
    });

    // Return data
    return minBookmarks;
  }
}, EventEmitter.prototype);

// Expose BookmarkCollection
module.exports = BookmarkCollection;