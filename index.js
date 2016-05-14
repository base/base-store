/*!
 * base-store <https://github.com/jonschlinkert/base-store>
 *
 * Copyright (c) 2015-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

module.exports = function(name, config) {
  if (typeof name !== 'string') {
    config = name;
    name = undefined;
  }

  return function plugin(app) {
    if (!isValidInstance(app)) return;

    if (typeof name === 'undefined') {
      name = utils.project(process.cwd());
    }

    var opts = utils.extend({}, config, app.options.store);
    this.define('store', utils.store(name, opts));

    /**
     * Bubble up specific events to `app`
     */

    this.store.on('set', function(key, val) {
      app.emit('store.set', key, val);
      app.emit('store', 'set', key, val);
    });

    this.store.on('get', function(key, val) {
      app.emit('store.get', key, val);
      app.emit('store', 'get', key, val);
    });

    this.store.on('del', function(key, val) {
      app.emit('store.del', key, val);
      app.emit('store', 'del', key, val);
    });

    return plugin;
  };
};

function isValidInstance(app) {
  var fn = app.options.validatePlugin;
  if (typeof fn === 'function' && !fn(app)) {
    return false;
  }
  if (typeof app.isRegistered !== 'function' || app.isRegistered('base-store')) {
    return false;
  }
  if (app.isCollection || app.isView) {
    return false;
  }
  return true;
}
