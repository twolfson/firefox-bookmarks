# firefox-bookmarks [![Build status](https://travis-ci.org/twolfson/firefox-bookmarks.png?branch=master)](https://travis-ci.org/twolfson/firefox-bookmarks)

Extract information from your [Firefox][] bookmarks

This was built as part of the [bookmarks][] project, GitHub hosted websites for searching through other people's bookmarks.

[Firefox]: http://www.mozilla.org/en-US/firefox/new/
[bookmarks]: https://github.com/twolfson/bookmarks

## Getting Started
Install the module with: `npm install firefox-bookmarks`

```javascript
// Load in raw bookmarks from Firefox backups
var rawBookmarks = require('~/.mozilla/firefox/profile-id/bookmarkbackups/bookmarks-YYYY-MM-DD.json');
/*
{
  "title": "",
  "id": 1,
  "dateAdded": 1364532555307821,
  "lastModified": 1364627167084723,
  "type": "text/x-moz-place-container",
  "root": "placesRoot",
  "children": [
    ...
*/

// Simplify and parse raw bookmarks
var BookmarkCollection = require('firefox-bookmarks');
var bookmarks = new BookmarkCollection(rawBookmarks);

// Output simplified bookmark info
bookmarks.toJSON();
/*
[
  {
    "type": "folder",
    "title": "web dev code",
    "children": [
      {
        "type": "bookmark",
        "title": "fxn/tkn - Terminal keynote presentation",
        "dateAdded": 1364532709949934,
        "lastModified": 1364532719708073,
        "description": "tkn - Terminal Keynote - A hack for terminal-based talks",
        "uri": "https://github.com/fxn/tkn"
      }, ...
    ]
  }, ...
]
*/
```

### CLI
We also present a command line tool for usage within `npm scripts` or globally.

```js
$ npm install -g firefox-bookmarks
npm http GET https://registry.npmjs.org/firefox-bookmarks
npm http 200 https://registry.npmjs.org/firefox-bookmarks
...
$ firefox-bookmarks flatten ~/.mozilla/firefox/profile-id/bookmarkbackups/bookmarks-YYYY-MM-DD.json \
    | underscore print | head
[
  {
    "title": "fxn/tkn - Terminal keynote presentation",
    "dateAdded": 1364532709949934,
    "lastModified": 1364532719708073,
    "description": "tkn - Terminal Keynote - A hack for terminal-based talks",
    "uri": "https://github.com/fxn/tkn"
  },
  {
    "title": "pedalboard.js - Open-source JavaScript framework for developing audio effects for guitars",
```

## Documentation
`firefox-bookmarks` exposes `BookmarkCollection` as its `module.exports`.

### `new BookmarkCollection(rawBookmarks, options)`

### CLI
`firefox-bookmarks` installs a `firefox-bookmarks` executable. Options can be found via `--help`.

```bash
$ firefox-bookmarks --help

  Usage: firefox-bookmarks [options] [command]

  Commands:

    to-json [filepath]     Parse a bookmarks file into simplified JSON
    flatten [filepath]     Flatten a bookmarks file into simplified bookmarks

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## Donating
Support this project and [others by twolfson][gittip] via [gittip][].

[![Support via Gittip][gittip-badge]][gittip]

[gittip-badge]: https://rawgithub.com/twolfson/gittip-badge/master/dist/gittip.png
[gittip]: https://www.gittip.com/twolfson/

## Unlicense
As of Jan 21 2014, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
