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
    throw new Error('expected store name to be a string.');
  }

  return function (app) {
    var opts = utils.extend({}, options, app.options.store);
    this.define('store', utils.store(name, opts));
    return this;
  };
};
