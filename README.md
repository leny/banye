# @leny/banye

> Add dynamic header comments to files - cleaned/updated version of [misteroneill/bannerize](https://github.com/misteroneill/bannerize)

* * *

## Banner Templates

Banner templates use the [EJS](https://www.npmjs.com/package/ejs) templating language. Templates are passed the following properties:

- `pkg`: A representation of the nearest `package.json` file.
- `date`: A JavaScript Date object.
- `path`: Relate path of the file.

A simple banner might look something like:

```
/*! <%= pkg.name %> | <%= pkg.version %>
 *  (c) <%= date.getFullYear() %>
 */
```

And render to:

```
/*! @leny/banye | 1.0.0
 *  (c) 2021 MIT
 */
```

## CLI

`banye` ships with a CLI command. Its options vary from the programmatic API. To see all its options, use:

```sh
$ banye --help
```

An example usage might look like:

```sh
$ banye *.js *.css --banner=foo/bar.ejs
```

## API

The `banye ` module can be used in your programs. It exports a single function, `banye `, which takes two arguments:

### `banye(patterns, [options])`

- `pattern` `{String|Array}`: A string or array of glob pattern(s) to which to apply the banner.
- `[options]` `{Object}`: An object containing optional values.

The return value of `bannerize()` is a `Promise` that resolves with an array of all the file paths it modified.

### Options

- `banner` A banner file location. Defaults to `banner.ejs` in the `cwd`.

- `cwd` Override the `cwd` for all paths passed to `bannerize`. Relative paths will be relative to `process.cwd()`. Defaults to `process.cwd()`.
  
- `lineBreak` Sets the linebreak (`'CRLF'`, `'LF'`). Defaults to `'LF'`.

- `replace` Replace the starting lines of the files (up to the first empty line) with the banner

- `check` Check if header already exists in good format before add or replace