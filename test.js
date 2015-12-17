'use strict';

require('mocha');
require('should');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var Base = require('base-methods');
var Store = require('data-store');
var store = require('./');
var base;

describe('store', function () {
  beforeEach(function () {
    base = new Base();
    base.use(store('base-data-tests'));
  });

  afterEach(function () {
    base.store.data = {};
    base.store.del({force: true});
  });

  it('should be an instance of Store', function () {
    assert(base.store instanceof Store);
  });

  it('should detect store name if not passed:', function () {
    base.use(store());
    assert(base.store.name === 'base-store');
  });

  it('should create a store with the given `name`', function () {
    base.use(store('foo-bar-baz'));
    assert(base.store.name === 'foo-bar-baz');
  });

  it('should create a store at the given `cwd`', function () {
    base.use(store('abc', {cwd: 'actual'}));
    base.store.set('foo', 'bar');
    path.basename(base.store.path).should.equal('abc.json');
    base.store.data.should.have.property('foo', 'bar');
    assert.equal(fs.existsSync(path.join(__dirname, 'actual', 'abc.json')), true);
  });

  it('should create a store using the given `indent` value', function () {
    base.use(store('abc', {cwd: 'actual', indent: 0}));
    base.store.set('foo', 'bar');
    var contents = fs.readFileSync(path.join(__dirname, 'actual', 'abc.json'), 'utf8');
    assert.equal(contents, '{"foo":"bar"}');
  });

  it('should `.set()` a value on the store', function () {
    base.store.set('one', 'two');
    base.store.data.one.should.equal('two');
  });

  it('should `.set()` an object', function () {
    base.store.set({four: 'five', six: 'seven'});
    base.store.data.four.should.equal('five');
    base.store.data.six.should.equal('seven');
  });

  it('should `.set()` a nested value', function () {
    base.store.set('a.b.c.d', {e: 'f'});
    base.store.data.a.b.c.d.e.should.equal('f');
  });

  it('should `.union()` a value on the store', function () {
    base.store.union('one', 'two');
    base.store.data.one.should.eql(['two']);
  });

  it('should not union duplicate values', function () {
    base.store.union('one', 'two');
    base.store.data.one.should.eql(['two']);

    base.store.union('one', ['two']);
    base.store.data.one.should.eql(['two']);
  });

  it('should concat an existing array:', function () {
    base.store.union('one', 'a');
    base.store.data.one.should.eql(['a']);

    base.store.union('one', ['b']);
    base.store.data.one.should.eql(['a', 'b']);

    base.store.union('one', ['c', 'd']);
    base.store.data.one.should.eql(['a', 'b', 'c', 'd']);
  });

  it('should return true if a key `.has()` on the store', function () {
    base.store.set('foo', 'bar');
    base.store.set('baz', null);
    base.store.set('qux', undefined);

    base.store.has('foo').should.eql(true);
    base.store.has('bar').should.eql(false);
    base.store.has('baz').should.eql(false);
    base.store.has('qux').should.eql(false);
  });

  it('should return true if a nested key `.has()` on the store', function () {
    base.store.set('a.b.c.d', {x: 'zzz'});
    base.store.set('a.b.c.e', {f: null});
    base.store.set('a.b.g.j', {k: undefined});

    base.store.has('a.b.bar').should.eql(false);
    base.store.has('a.b.c.d').should.eql(true);
    base.store.has('a.b.c.d.x').should.eql(true);
    base.store.has('a.b.c.d.z').should.eql(false);
    base.store.has('a.b.c.e').should.eql(true);
    base.store.has('a.b.c.e.f').should.eql(false);
    base.store.has('a.b.c.e.z').should.eql(false);
    base.store.has('a.b.g.j').should.eql(true);
    base.store.has('a.b.g.j.k').should.eql(false);
    base.store.has('a.b.g.j.z').should.eql(false);
  });

   it('should return true if a key exists `.hasOwn()` on the store', function () {
    base.store.set('foo', 'bar');
    base.store.set('baz', null);
    base.store.set('qux', undefined);

    base.store.hasOwn('foo').should.eql(true);
    base.store.hasOwn('bar').should.eql(false);
    base.store.hasOwn('baz').should.eql(true);
    base.store.hasOwn('qux').should.eql(true);
  });

  it('should return true if a nested key exists `.hasOwn()` on the store', function () {
    base.store.set('a.b.c.d', {x: 'zzz'});
    base.store.set('a.b.c.e', {f: null});
    base.store.set('a.b.g.j', {k: undefined});

    base.store.hasOwn('a.b.bar').should.eql(false);
    base.store.hasOwn('a.b.c.d').should.eql(true);
    base.store.hasOwn('a.b.c.d.x').should.eql(true);
    base.store.hasOwn('a.b.c.d.z').should.eql(false);
    base.store.has('a.b.c.e.f').should.eql(false);
    base.store.hasOwn('a.b.c.e.f').should.eql(true);
    base.store.hasOwn('a.b.c.e.bar').should.eql(false);
    base.store.has('a.b.g.j.k').should.eql(false);
    base.store.hasOwn('a.b.g.j.k').should.eql(true);
    base.store.hasOwn('a.b.g.j.foo').should.eql(false);
  });

  it('should `.get()` a stored value', function () {
    base.store.set('three', 'four');
    base.store.get('three').should.equal('four');
  });

  it('should `.get()` a nested value', function () {
    base.store.set({a: {b: {c: 'd'}}});
    base.store.get('a.b.c').should.equal('d');
  });

  it('should `.del()` a stored value', function () {
    base.store.set('a', 'b');
    base.store.set('c', 'd');
    base.store.data.should.have.property('a');
    base.store.data.should.have.property('c');

    base.store.del('a');
    base.store.del('c');
    base.store.data.should.not.have.property('a');
    base.store.data.should.not.have.property('c');
  });

  it('should `.del()` multiple stored values', function () {
    base.store.set('a', 'b');
    base.store.set('c', 'd');
    base.store.set('e', 'f');
    base.store.del(['a', 'c', 'e']);
    base.store.data.should.eql({});
  });
});

describe('create', function () {
  beforeEach(function () {
    base.use(store('abc'));

    // init the actual store json file
    base.store.set('a', 'b');
  });

  afterEach(function () {
    base.store.data = {};
    base.store.del({force: true});
  });

  it('should expose a `create` method', function() {
    assert.equal(typeof base.store.create, 'function');
  });

  it('should create a new store with the given name', function() {
    var store = base.store.create('base-store/create-test');
    assert(store.name === 'base-store/create-test');
  });

  it('should add a store object to store[name]', function() {
    base.store.create('foo');
    assert.equal(typeof base.store.foo, 'object');
    assert.equal(typeof base.store.foo.set, 'function');
    base.store.foo.del({force: true});
  });

  it('should save the store in a namespaced directory under the parent', function() {
    base.store.create('foo');
    var dir = path.dirname(base.store.path);

    assert.equal(base.store.foo.path, path.join(dir, 'abc/foo.json'));
    base.store.foo.set('a', 'b');
    base.store.foo.del({force: true});
  });

  it('should set values on the custom store', function() {
    base.store.create('foo');
    base.store.foo.set('a', 'b');
    assert(base.store.foo.data.a === 'b');
    base.store.foo.del({force: true});
  });

  it('should get values from the custom store', function() {
    base.store.create('foo');
    base.store.foo.set('a', 'b');
    assert(base.store.foo.get('a') === 'b');
    base.store.foo.del({force: true});
  });
});

describe('events', function () {
  beforeEach(function () {
    base.use(store('abc'));
  });

  afterEach(function () {
    base.store.data = {};
    base.store.del({force: true});
  });

  it('should emit `set` when an object is set:', function () {
    var keys = [];
    base.store.on('set', function (key) {
      keys.push(key);
    });

    base.store.set({a: {b: {c: 'd'}}});
    keys.should.eql(['a']);
  });

  it('should emit `set` when a key/value pair is set:', function () {
    var keys = [];

    base.store.on('set', function (key) {
      keys.push(key);
    });

    base.store.set('a', 'b');
    keys.should.eql(['a']);
  });

  it('should emit `set` when an object value is set:', function () {
    var keys = [];

    base.store.on('set', function (key) {
      keys.push(key);
    });

    base.store.set('a', {b: 'c'});
    keys.should.eql(['a']);
  });

  it('should emit `set` when an array of objects is passed:', function (cb) {
    var keys = [];

    base.store.on('set', function (key) {
      keys.push(key);
    });

    base.store.set([{a: 'b'}, {c: 'd'}]);
    keys.should.eql(['a', 'c']);
    cb();
  });

  it('should emit `has`:', function (cb) {
    var keys = [];

    base.store.on('has', function (val) {
      assert(val);
      cb();
    });

    base.store.set('a', 'b');
    base.store.has('a');
  });

  it('should emit `del` when a value is delted:', function (cb) {
    base.store.on('del', function (keys) {
      keys.should.eql('a');
      assert(typeof base.store.get('a') === 'undefined');
      cb();
    });

    base.store.set('a', {b: 'c'});
    base.store.get('a').should.eql({b: 'c'});
    base.store.del('a');
  });

  it('should emit deleted keys on `del`:', function (cb) {
    var arr = [];

    base.store.on('del', function (key) {
      arr.push(key);
      assert(Object.keys(base.store.data).length === 0);
    });

    base.store.set('a', 'b');
    base.store.set('c', 'd');
    base.store.set('e', 'f');

    base.store.del({force: true});
    arr.should.eql(['a', 'c', 'e']);
    cb();
  });

  it('should throw an error if force is not passed', function () {
    base.store.set('a', 'b');
    base.store.set('c', 'd');
    base.store.set('e', 'f');

    (function () {
      base.store.del();
    }).should.throw('options.force is required to delete the entire cache.');
  });
});
