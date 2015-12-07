/*!
 * base-store <https://github.com/jonschlinkert/base-store>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

module.exports = function (name, options) {
  if (typeof name !== 'string') {
    options = name;
    name = null;
  }

  name = name || utils.project(process.cwd());

  return function(app) {
    var opts = utils.extend({}, options, app.options.store);
    this.define('store', utils.store(name, opts));

    this.store.create = function(name, options) {
      return utils.store(name, options);
    };
  }
};
