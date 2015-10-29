# base-store [![NPM version](https://badge.fury.io/js/base-store.svg)](http://badge.fury.io/js/base-store)

> Plugin for getting and persisting config values with your base-methods application. Adds a 'store' object that exposes all of the methods from the data-store library.

By adding this plugin you can do this:

```js
app.set('a', 'b');
app.store.set('a', 'z');

console.log(app.get('a'));
//=> 'b';
console.log(app.store.get('a'));
//=> 'z';
```

The main takeaway is that `store.set` persists values to disk, but `set` does not.

The goal is to have methods dedicated to getting and persisting config values, while cleanly co-existing with the methods that deal with getting and setting values in-memory.

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i base-store --save
```

## Other plugins

Other plugins for extending [base-methods](https://github.com/jonschlinkert/base-methods):

* [base-cli](https://www.npmjs.com/package/base-cli): Plugin for base-methods that maps built-in methods to CLI args (also supports methods from a… [more](https://www.npmjs.com/package/base-cli) | [homepage](https://github.com/jonschlinkert/base-cli)
* [base-data](https://www.npmjs.com/package/base-data): adds a `data` method to base-methods. | [homepage](https://github.com/jonschlinkert/base-data)
* [base-methods](https://www.npmjs.com/package/base-methods): Starter for creating a node.js application with a handful of common methods, like `set`, `get`,… [more](https://www.npmjs.com/package/base-methods) | [homepage](https://github.com/jonschlinkert/base-methods)
* [base-options](https://www.npmjs.com/package/base-options): Adds a few options methods to base-methods, like `option`, `enable` and `disable`. See the readme… [more](https://www.npmjs.com/package/base-options) | [homepage](https://github.com/jonschlinkert/base-options)
* [base-plugins](https://www.npmjs.com/package/base-plugins): Upgrade's plugin support in base-methods to allow plugins to be called any time after init. | [homepage](https://github.com/jonschlinkert/base-plugins)

## API

Add `store` and `base` to your application:

```js
var store = require('base-store');
var Base = require('base-methods');
var base = new Base();
```

Register the `store` plugin with [base-methods](https://github.com/jonschlinkert/base-methods):

```js
// store `name` is required
base.use(store('foo'));

// pass options (like cwd) as the second arg.
// default cwd is `~/data-store/`
base.use(store('foo', {cwd: 'a/b/c'}));
```

**example**

```js
base.store
  .set('a', 'b')
  .set({c: 'd'})
  .set('e.f', 'g')

console.log(base.store.get('e.f'));
//=> 'g'

console.log(base.store.get());
//=> {name: 'app', data: {a: 'b', c: 'd', e: {f: 'g' }}}

console.log(base.store.data);
//=> {a: 'b', c: 'd', e: {f: 'g'}}
```

### plugin params

* `name` **{String}**: Store name.
* `options` **{Object}**

* `cwd` **{String}**: Current working directory for storage. If not defined, the user home directory is used, based on OS. This is the only option currently, other may be added in the future.
* `indent` **{Number}**: Number passed to `JSON.stringify` when saving the data. Defaults to `2` if `null` or `undefined`

## methods

### .store.set

Assign `value` to `key` and save to disk. Can be a key-value pair or an object.

**Params**

* `key` **{String}**
* `val` **{any}**: The value to save to `key`. Must be a valid JSON type: String, Number, Array or Object.
* `returns` **{Object}** `Store`: for chaining

**Example**

```js
// key, value
base.store.set('a', 'b');
//=> {a: 'b'}

// extend the store with an object
base.store.set({a: 'b'});
//=> {a: 'b'}

// extend the the given value
base.store.set('a', {b: 'c'});
base.store.set('a', {d: 'e'}, true);
//=> {a: {b 'c', d: 'e'}}

// overwrite the the given value
base.store.set('a', {b: 'c'});
base.store.set('a', {d: 'e'});
//=> {d: 'e'}
```

### .store.union

Add or append an array of unique values to the given `key`.

**Params**

* `key` **{String}**
* `returns` **{any}**: The array to add or append for `key`.

**Example**

```js
base.store.union('a', ['a']);
base.store.union('a', ['b']);
base.store.union('a', ['c']);
base.store.get('a');
//=> ['a', 'b', 'c']
```

### .store.get

Get the stored `value` of `key`, or return the entire store if no `key` is defined.

**Params**

* `key` **{String}**
* `returns` **{any}**: The value to store for `key`.

**Example**

```js
base.store.set('a', {b: 'c'});
base.store.get('a');
//=> {b: 'c'}

base.store.get();
//=> {b: 'c'}
```

### .store.has

Returns `true` if the specified `key` has truthy value.

**Params**

* `key` **{String}**
* `returns` **{Boolean}**: Returns true if `key` has

**Example**

```js
base.store.set('a', 'b');
base.store.set('c', null);
base.store.has('a'); //=> true
base.store.has('c'); //=> false
base.store.has('d'); //=> false
```

### .store.hasOwn

Returns `true` if the specified `key` exists.

**Params**

* `key` **{String}**
* `returns` **{Boolean}**: Returns true if `key` exists

**Example**

```js
base.store.set('a', 'b');
base.store.set('b', false);
base.store.set('c', null);
base.store.set('d', true);

base.store.hasOwn('a'); //=> true
base.store.hasOwn('b'); //=> true
base.store.hasOwn('c'); //=> true
base.store.hasOwn('d'); //=> true
base.store.hasOwn('foo'); //=> false
```

### .store.save

Persist the store to disk.

**Params**

* `dest` **{String}**: Optionally define a different destination than the default path.

**Example**

```js
base.store.save();
```

### .store.del

Delete `keys` from the store, or delete the entire store if no keys are passed. A `del` event is also emitted for each key deleted.

**Note that to delete the entire store you must pass `{force: true}`**

**Params**

* `keys` **{String|Array|Object}**: Keys to remove, or options.
* `options` **{Object}**

**Example**

```js
base.store.del();

// to delete paths outside cwd
base.store.del({force: true});
```

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/base-store/issues/new).

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on October 28, 2015._