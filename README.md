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
Constructor for interpretting a collection of Firefox bookmarks

- rawBookmarks `Object[]` - Bookmarks saved to `~/.mozilla/firefox/profile-id/bookmarkbackups/`
- options `Object` - Container for flags to affect behavior
    - folders `String[]` - Array of whitelisted top-level folders to consume
        - If not provided, all folders will be consumed

### `bookmarks.toJSON()`
Export internal bookmark data into simplified structure

Returns:

- retArr `Object[]` - Array of `bookmarks` and `folders`

`folder` structure:

- type `String` - Type of element (`folders` use `folder`)
- title `String` - Name of the folder
- children `Object[]` - Array of more `folders` and `bookmarks`

`bookmark` structure:

- type `String` - Type of element (`bookmarks` use `bookmark`)
- title `String` - Name of the folder
- uri `String` - URL that was saved for the bookmark
- dateAdded `Number` - Microseconds (milliseconds/1000) since Linux epoch that `bookmark` was added
- lastModified `Number` - Microseconds since Linux epoch that `bookmark` was last updated
- description `String` - Description if there was one provided

### `bookmarks.flatten()`
Export compresses set of bookmark data. All folders are thrown out and all bookmarks are put into one array.

Returns:

- retArr `Object[]` - Array of `bookmarks`
    - To save space, `type` is stripped from all `bookmarks`. Otherwise, these are the same as those in `bookmarks.toJSON()`

### CLI
`firefox-bookmarks` installs a `firefox-bookmarks` executable. Options can be found via `--help`.

CLI flags (e.g. `folders`) are passed in as options that are passed in to the `BookmarkCollection` constructor.

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
