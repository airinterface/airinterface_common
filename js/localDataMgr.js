(function() {
  /*
  This class supports local storage functionality.

  */  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  this.ESLocalDataMgrFactory = (function() {
    function ESLocalDataMgrFactory() {
      ESLocalDataMgrFactory.__super__.constructor.apply(this, arguments);
    }
    ESLocalDataMgrFactory.localdatas = ["ESStorageMgr", "ESCookieMgr"];
    ESLocalDataMgrFactory.initializeLocalDataMgr = function(isSessionStorage) {
      var dataMgr, res, tmpDataMgr, _i, _len, _ref;
      dataMgr = null;
      _ref = this.localdatas;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tmpDataMgr = _ref[_i];
        try {
          res = eval("" + tmpDataMgr + ".isLocalDataSupported(" + isSessionStorage + ")");
          if (res) {
            dataMgr = eval("" + tmpDataMgr + ".initializeLocalDataMgr(" + isSessionStorage + ")");
            break;
          }
        } catch (e) {
          ESLog.info("ESLocalDataMgrFactory:" + e);
        }
      }
      return dataMgr;
    };
    return ESLocalDataMgrFactory;
  })();
  this.ESLocalDataMgr = (function() {
    function ESLocalDataMgr() {
      ESLocalDataMgr.__super__.constructor.apply(this, arguments);
    }
    ESLocalDataMgr.KEYPREFIX = "ES";
    ESLocalDataMgr.prototype.toKey = function(key) {
      if (key.indexOf(this.KEYPREFIX) < 0) {
        return "" + ESLocalDataMgr.KEYPREFIX + "." + $app.appID + "." + key;
      } else {
        return key;
      }
    };
    return ESLocalDataMgr;
  })();
  this.ESStorageMgr = (function() {
    __extends(ESStorageMgr, ESLocalDataMgr);
    ESStorageMgr.isLocalDataSupported = function(isSessionStorage) {
      if (isSessionStorage) {
        return window.sessionStorage != null;
      } else {
        return window.localStorage != null;
      }
    };
    ESStorageMgr.initializeLocalDataMgr = function(isSessionStorage) {
      return new ESStorageMgr(isSessionStorage);
    };
    ESStorageMgr.prototype.getValueByKey = function(key) {
      return this.storage.getItem(this.toKey(key));
    };
    ESStorageMgr.prototype.setValueByKey = function(key, value) {
      var res;
      res = true;
      try {
        this.removeValueByKey(key);
        this.storage.setItem(this.toKey(key), value);
      } catch (e) {
        res = false;
        if (e === "QUOTA_EXCEEDED_ERR") {
          ESLog.info('Quota exceeded!');
        }
      }
      return res;
    };
    ESStorageMgr.prototype.removeValueByKey = function(key) {
      return this.storage.removeItem(this.toKey(key));
    };
    ESStorageMgr.prototype.storage = null;
    function ESStorageMgr(isSessionStorage) {
      this.storage = isSessionStorage ? window.sessionStorage : window.localStorage;
    }
    return ESStorageMgr;
  })();
  this.ESCookieMgr = (function() {
    __extends(ESCookieMgr, ESLocalDataMgr);
    ESCookieMgr.isLocalDataSupported = function(isSessionStorage) {
      return true;
    };
    ESCookieMgr.initializeLocalDataMgr = function(isSessionStorage) {
      return new ESCookieMgr(isSessionStorage);
    };
    ESCookieMgr.prototype.getValueByKey = function(key) {
      return $.cookie(this.toKey(key));
    };
    ESCookieMgr.prototype.setValueByKey = function(key, value) {
      var option;
      option = {};
      option.path = '/';
      if (this.isSessionStorage) {
        option.expires = ESCookieMgr.defaultExpirationDate;
      }
      $.cookie(this.toKey(key), value, option);
      return true;
    };
    ESCookieMgr.prototype.removeValueByKey = function(key) {
      return $.cookie(this.toKey(key), null);
    };
    ESCookieMgr.prototype.isSessionStorage = false;
    ESCookieMgr.defaultExpirationDate = 365;
    function ESCookieMgr(isSessionStorage) {
      this.isSessionStorage = isSessionStorage;
    }
    return ESCookieMgr;
  })();
}).call(this);
