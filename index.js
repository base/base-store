/*!
 * base-store <https://github.com/jonschlinkert/base-store>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var utils = require('./utils');

module.exports = function(name, options) {
  if (typeof name !== 'string') {
    options = name;
    name = null;
  }

  name = name || utils.project(process.cwd());

  return function(app) {
    if (this.isRegistered('store')) return;

    var opts = utils.extend({}, options, app.options.store);
    var store = utils.store(name, opts);
    this.define('store', store);

    /**
     * Adds a namespaced "sub-store", where
     * the `cwd` is in the same directory as
     * the "parent" store.
     */

    this.store.create = function(subname) {
      var root = path.dirname(store.path);
      opts.cwd = path.join(root, name);

      var custom = utils.store(subname, opts);
      store[subname] = custom;
      return custom;
    };
  };
};
