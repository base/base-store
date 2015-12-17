/*!
 * base-store <https://github.com/jonschlinkert/base-store>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var utils = require('./utils');

module.exports = function (name, options) {
  if (typeof name !== 'string') {
    options = name;
    name = null;
  }

  name = name || utils.project(process.cwd());

  return function(app) {
    var opts = utils.extend({}, options, app.options.store);
    var store = utils.store(name, opts);
    this.define('store', store);

    this.store.create = function(subname) {
      var dir = path.dirname(store.path);
      opts.cwd = path.join(dir, name);

      var custom = utils.store(subname, opts);
      store[subname] = custom;
      return custom;
    };
  }
};
