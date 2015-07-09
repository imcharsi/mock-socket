(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _globalContext = require('./global-context');

var _globalContext2 = _interopRequireDefault(_globalContext);

/*
* This delay allows the thread to finish assigning its on* methods
* before invoking the delay callback. This is purely a timing hack.
* http://geekabyte.blogspot.com/2014/01/javascript-effect-of-setting-settimeout.html
*
* @param {callback: function} the callback which will be invoked after the timeout
* @parma {context: object} the context in which to invoke the function
*/
function delay(callback, context, notUseDelay) {
  if (notUseDelay != true) {
    _globalContext2['default'].setTimeout(function (context) {
      callback.call(context);
    }, 4, context);
  } else {
    callback.call(context);
  }
}

exports['default'] = delay;
module.exports = exports['default'];
},{"./global-context":2}],2:[function(require,module,exports){
(function (global){
/*
* Determines the global context. This should be either window (in the)
* case where we are in a browser) or global (in the case where we are in
* node)
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var globalContext;

if (typeof window === 'undefined') {
    globalContext = global;
} else {
    globalContext = window;
}

if (!globalContext) {
    throw new Error('Unable to set the global context to either window or global.');
}

exports['default'] = globalContext;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
/*
* This is a mock websocket event message that is passed into the onopen,
* opmessage, etc functions.
*
* @param {name: string} The name of the event
* @param {data: *} The data to send.
* @param {origin: string} The url of the place where the event is originating.
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
function socketEventMessage(name, data, origin) {
	var ports = null;
	var source = null;
	var bubbles = false;
	var cancelable = false;
	var lastEventId = '';
	var targetPlacehold = null;
	var messageEvent;

	try {
		messageEvent = new MessageEvent(name);
		messageEvent.initMessageEvent(name, bubbles, cancelable, data, origin, lastEventId);

		Object.defineProperties(messageEvent, {
			target: {
				get: function get() {
					return targetPlacehold;
				},
				set: function set(value) {
					targetPlacehold = value;
				}
			},
			srcElement: {
				get: function get() {
					return this.target;
				}
			},
			currentTarget: {
				get: function get() {
					return this.target;
				}
			}
		});
	} catch (e) {
		// We are unable to create a MessageEvent Object. This should only be happening in PhantomJS.
		messageEvent = {
			type: name,
			bubbles: bubbles,
			cancelable: cancelable,
			data: data,
			origin: origin,
			lastEventId: lastEventId,
			source: source,
			ports: ports,
			defaultPrevented: false,
			returnValue: true,
			clipboardData: undefined
		};

		Object.defineProperties(messageEvent, {
			target: {
				get: function get() {
					return targetPlacehold;
				},
				set: function set(value) {
					targetPlacehold = value;
				}
			},
			srcElement: {
				get: function get() {
					return this.target;
				}
			},
			currentTarget: {
				get: function get() {
					return this.target;
				}
			}
		});
	}

	return messageEvent;
}

exports['default'] = socketEventMessage;
module.exports = exports['default'];
},{}],4:[function(require,module,exports){
/*
* The native websocket object will transform urls without a pathname to have just a /.
* As an example: ws://localhost:8080 would actually be ws://localhost:8080/ but ws://example.com/foo would not
* change. This function does this transformation to stay inline with the native websocket implementation.
*
* @param {url: string} The url to transform.
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function urlTransform(url) {
  var urlPath = urlParse('path', url);
  var urlQuery = urlParse('?', url);

  urlQuery = urlQuery ? '?' + urlQuery : '';

  if (urlPath === '') {
    return url.split('?')[0] + '/' + urlQuery;
  }

  return url;
}

/*
* The following functions (isNumeric & urlParse) was taken from
* https://github.com/websanova/js-url/blob/764ed8d94012a79bfa91026f2a62fe3383a5a49e/url.js
* which is shared via the MIT license with minimal modifications.
*/
function isNumeric(arg) {
  return !isNaN(parseFloat(arg)) && isFinite(arg);
}

function urlParse(arg, url) {
  var _ls = url || window.location.toString();

  if (!arg) {
    return _ls;
  } else {
    arg = arg.toString();
  }

  if (_ls.substring(0, 2) === '//') {
    _ls = 'http:' + _ls;
  } else if (_ls.split('://').length === 1) {
    _ls = 'http://' + _ls;
  }

  url = _ls.split('/');
  var _l = { auth: '' },
      host = url[2].split('@');

  if (host.length === 1) {
    host = host[0].split(':');
  } else {
    _l.auth = host[0];host = host[1].split(':');
  }

  _l.protocol = url[0];
  _l.hostname = host[0];
  _l.port = host[1] || (_l.protocol.split(':')[0].toLowerCase() === 'https' ? '443' : '80');
  _l.pathname = (url.length > 3 ? '/' : '') + url.slice(3, url.length).join('/').split('?')[0].split('#')[0];
  var _p = _l.pathname;

  if (_p.charAt(_p.length - 1) === '/') {
    _p = _p.substring(0, _p.length - 1);
  }
  var _h = _l.hostname,
      _hs = _h.split('.'),
      _ps = _p.split('/');

  if (arg === 'hostname') {
    return _h;
  } else if (arg === 'domain') {
    if (/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(_h)) {
      return _h;
    }
    return _hs.slice(-2).join('.');
  }
  //else if (arg === 'tld') { return _hs.slice(-1).join('.'); }
  else if (arg === 'sub') {
    return _hs.slice(0, _hs.length - 2).join('.');
  } else if (arg === 'port') {
    return _l.port;
  } else if (arg === 'protocol') {
    return _l.protocol.split(':')[0];
  } else if (arg === 'auth') {
    return _l.auth;
  } else if (arg === 'user') {
    return _l.auth.split(':')[0];
  } else if (arg === 'pass') {
    return _l.auth.split(':')[1] || '';
  } else if (arg === 'path') {
    return _l.pathname;
  } else if (arg.charAt(0) === '.') {
    arg = arg.substring(1);
    if (isNumeric(arg)) {
      arg = parseInt(arg, 10);return _hs[arg < 0 ? _hs.length + arg : arg - 1] || '';
    }
  } else if (isNumeric(arg)) {
    arg = parseInt(arg, 10);return _ps[arg < 0 ? _ps.length + arg : arg] || '';
  } else if (arg === 'file') {
    return _ps.slice(-1)[0];
  } else if (arg === 'filename') {
    return _ps.slice(-1)[0].split('.')[0];
  } else if (arg === 'fileext') {
    return _ps.slice(-1)[0].split('.')[1] || '';
  } else if (arg.charAt(0) === '?' || arg.charAt(0) === '#') {
    var params = _ls,
        param = null;

    if (arg.charAt(0) === '?') {
      params = (params.split('?')[1] || '').split('#')[0];
    } else if (arg.charAt(0) === '#') {
      params = params.split('#')[1] || '';
    }

    if (!arg.charAt(1)) {
      return params;
    }

    arg = arg.substring(1);
    params = params.split('&');

    for (var i = 0, ii = params.length; i < ii; i++) {
      param = params[i].split('=');
      if (param[0] === arg) {
        return param[1] || '';
      }
    }

    return null;
  }

  return '';
}

exports['default'] = urlTransform;
module.exports = exports['default'];
},{}],5:[function(require,module,exports){
/*
* This defines four methods: onopen, onmessage, onerror, and onclose. This is done this way instead of
* just placing the methods on the prototype because we need to capture the callback when it is defined like so:
*
* mockSocket.onopen = function() { // this is what we need to store };
*
* The only way is to capture the callback via the custom setter below and then place them into the correct
* namespace so they get invoked at the right time.
*
* @param {websocket: object} The websocket object which we want to define these properties onto
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function webSocketProperties(websocket) {
  var eventMessageSource = function eventMessageSource(callback) {
    return function (event) {
      event.target = websocket;
      callback.apply(websocket, arguments);
    };
  };

  Object.defineProperties(websocket, {
    onopen: {
      configurable: true,
      enumerable: true,
      get: function get() {
        return this._onopen;
      },
      set: function set(callback) {
        this._onopen = eventMessageSource(callback);
        this.service.setCallbackObserver('clientOnOpen', this._onopen, websocket);
      }
    },
    onmessage: {
      configurable: true,
      enumerable: true,
      get: function get() {
        return this._onmessage;
      },
      set: function set(callback) {
        this._onmessage = eventMessageSource(callback);
        this.service.setCallbackObserver('clientOnMessage', this._onmessage, websocket);
      }
    },
    onclose: {
      configurable: true,
      enumerable: true,
      get: function get() {
        return this._onclose;
      },
      set: function set(callback) {
        this._onclose = eventMessageSource(callback);
        this.service.setCallbackObserver('clientOnclose', this._onclose, websocket);
      }
    },
    onerror: {
      configurable: true,
      enumerable: true,
      get: function get() {
        return this._onerror;
      },
      set: function set(callback) {
        this._onerror = eventMessageSource(callback);
        this.service.setCallbackObserver('clientOnError', this._onerror, websocket);
      }
    }
  });
}

exports['default'] = webSocketProperties;
module.exports = exports['default'];
},{}],6:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

var _mockServer = require('./mock-server');

var _mockServer2 = _interopRequireDefault(_mockServer);

var _mockSocket = require('./mock-socket');

var _mockSocket2 = _interopRequireDefault(_mockSocket);

var _helpersGlobalContext = require('./helpers/global-context');

var _helpersGlobalContext2 = _interopRequireDefault(_helpersGlobalContext);

_helpersGlobalContext2['default'].SocketService = _service2['default'];
_helpersGlobalContext2['default'].MockSocket = _mockSocket2['default'];
_helpersGlobalContext2['default'].MockServer = _mockServer2['default'];
},{"./helpers/global-context":2,"./mock-server":7,"./mock-socket":8,"./service":9}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

var _helpersDelay = require('./helpers/delay');

var _helpersDelay2 = _interopRequireDefault(_helpersDelay);

var _helpersUrlTransform = require('./helpers/url-transform');

var _helpersUrlTransform2 = _interopRequireDefault(_helpersUrlTransform);

var _helpersMessageEvent = require('./helpers/message-event');

var _helpersMessageEvent2 = _interopRequireDefault(_helpersMessageEvent);

var _helpersGlobalContext = require('./helpers/global-context');

var _helpersGlobalContext2 = _interopRequireDefault(_helpersGlobalContext);

function MockServer(url, notUseDelay) {
  var service = new _service2['default']();
  this.url = (0, _helpersUrlTransform2['default'])(url);
  this.notUseDelay = false;
  if (notUseDelay == true) {
    this.notUseDelay = true;
  }

  _helpersGlobalContext2['default'].MockSocket.services[this.url] = service;

  this.service = service;
  // ignore possible query parameters
  if (url.indexOf(MockServer.unresolvableURL) === -1) {
    service.server = this;
  }
}

/*
* This URL can be used to emulate server that does not establish connection
*/
MockServer.unresolvableURL = 'ws://unresolvable_url';

MockServer.prototype = {
  service: null,

  /*
  * This is the main function for the mock server to subscribe to the on events.
  *
  * ie: mockServer.on('connection', function() { console.log('a mock client connected'); });
  *
  * @param {type: string}: The event key to subscribe to. Valid keys are: connection, message, and close.
  * @param {callback: function}: The callback which should be called when a certain event is fired.
  */
  on: function on(type, callback) {
    var observerKey;

    if (typeof callback !== 'function' || typeof type !== 'string') {
      return false;
    }

    switch (type) {
      case 'connection':
        observerKey = 'clientHasJoined';
        break;
      case 'message':
        observerKey = 'clientHasSentMessage';
        break;
      case 'close':
        observerKey = 'clientHasLeft';
        break;
    }

    // Make sure that the observerKey is valid before observing on it.
    if (typeof observerKey === 'string') {
      this.service.clearAll(observerKey);
      this.service.setCallbackObserver(observerKey, callback, this);
    }
  },

  /*
  * This send function will notify all mock clients via their onmessage callbacks that the server
  * has a message for them.
  *
  * @param {data: *}: Any javascript object which will be crafted into a MessageObject.
  */
  send: function send(data) {
    (0, _helpersDelay2['default'])(function () {
      this.service.sendMessageToClients((0, _helpersMessageEvent2['default'])('message', data, this.url));
    }, this, this.notUseDelay);
  },

  /*
  * Notifies all mock clients that the server is closing and their onclose callbacks should fire.
  */
  close: function close() {
    (0, _helpersDelay2['default'])(function () {
      this.service.closeConnectionFromServer((0, _helpersMessageEvent2['default'])('close', null, this.url));
    }, this, this.notUseDelay);
  }
};

exports['default'] = MockServer;
module.exports = exports['default'];
},{"./helpers/delay":1,"./helpers/global-context":2,"./helpers/message-event":3,"./helpers/url-transform":4,"./service":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersDelay = require('./helpers/delay');

var _helpersDelay2 = _interopRequireDefault(_helpersDelay);

var _helpersUrlTransform = require('./helpers/url-transform');

var _helpersUrlTransform2 = _interopRequireDefault(_helpersUrlTransform);

var _helpersMessageEvent = require('./helpers/message-event');

var _helpersMessageEvent2 = _interopRequireDefault(_helpersMessageEvent);

var _helpersGlobalContext = require('./helpers/global-context');

var _helpersGlobalContext2 = _interopRequireDefault(_helpersGlobalContext);

var _helpersWebsocketProperties = require('./helpers/websocket-properties');

var _helpersWebsocketProperties2 = _interopRequireDefault(_helpersWebsocketProperties);

function MockSocket(url, notUseDelay) {
  this.binaryType = 'blob';
  this.url = (0, _helpersUrlTransform2['default'])(url);
  this.readyState = _helpersGlobalContext2['default'].MockSocket.CONNECTING;
  this.service = _helpersGlobalContext2['default'].MockSocket.services[this.url];
  this.notUseDelay = false;
  if (notUseDelay == true) {
    this.notUseDelay = true;
  }

  this._eventHandlers = {};

  (0, _helpersWebsocketProperties2['default'])(this);

  (0, _helpersDelay2['default'])(function () {
    // Let the service know that we are both ready to change our ready state and that
    // this client is connecting to the mock server.
    this.service.clientIsConnecting(this, this._updateReadyState);
  }, this, this.notUseDelay);
}

MockSocket.CONNECTING = 0;
MockSocket.OPEN = 1;
MockSocket.CLOSING = 2;
MockSocket.CLOSED = 3;
MockSocket.services = {};

MockSocket.prototype = {

  /*
  * Holds the on*** callback functions. These are really just for the custom
  * getters that are defined in the helpers/websocket-properties. Accessing these properties is not advised.
  */
  _onopen: null,
  _onmessage: null,
  _onerror: null,
  _onclose: null,

  /*
  * This holds reference to the service object. The service object is how we can
  * communicate with the backend via the pub/sub model.
  *
  * The service has properties which we can use to observe or notifiy with.
  * this.service.notify('foo') & this.service.observe('foo', callback, context)
  */
  service: null,

  /*
  * Internal storage for event handlers. Basically, there could be more than one
  * handler per event so we store them all in array.
  */
  _eventHandlers: {},

  /*
  * This is a mock for EventTarget's addEventListener method. A bit naive and
  * doesn't implement third useCapture parameter but should be enough for most
  * (if not all) cases.
  *
  * @param {event: string}: Event name.
  * @param {handler: function}: Any callback function for event handling.
  */
  addEventListener: function addEventListener(event, handler) {
    if (!this._eventHandlers[event]) {
      this._eventHandlers[event] = [];
      var self = this;
      this['on' + event] = function (eventObject) {
        self.dispatchEvent(eventObject);
      };
    }
    this._eventHandlers[event].push(handler);
  },

  /*
  * This is a mock for EventTarget's removeEventListener method. A bit naive and
  * doesn't implement third useCapture parameter but should be enough for most
  * (if not all) cases.
  *
  * @param {event: string}: Event name.
  * @param {handler: function}: Any callback function for event handling. Should
  * be one of the functions used in the previous calls of addEventListener method.
  */
  removeEventListener: function removeEventListener(event, handler) {
    if (!this._eventHandlers[event]) {
      return;
    }
    var handlers = this._eventHandlers[event];
    handlers.splice(handlers.indexOf(handler), 1);
    if (!handlers.length) {
      delete this._eventHandlers[event];
      delete this['on' + event];
    }
  },

  /*
  * This is a mock for EventTarget's dispatchEvent method.
  *
  * @param {event: MessageEvent}: Some event, either native MessageEvent or an object
  * returned by require('./helpers/message-event')
  */
  dispatchEvent: function dispatchEvent(event) {
    var handlers = this._eventHandlers[event.type];
    if (!handlers) {
      return;
    }
    for (var i = 0; i < handlers.length; i++) {
      handlers[i].call(this, event);
    }
  },

  /*
  * This is a mock for the native send function found on the WebSocket object. It notifies the
  * service that it has sent a message.
  *
  * @param {data: *}: Any javascript object which will be crafted into a MessageObject.
  */
  send: function send(data) {
    (0, _helpersDelay2['default'])(function () {
      this.service.sendMessageToServer((0, _helpersMessageEvent2['default'])('message', data, this.url));
    }, this, this.notUseDelay);
  },

  /*
  * This is a mock for the native close function found on the WebSocket object. It notifies the
  * service that it is closing the connection.
  */
  close: function close() {
    (0, _helpersDelay2['default'])(function () {
      this.service.closeConnectionFromClient((0, _helpersMessageEvent2['default'])('close', null, this.url), this);
    }, this, this.notUseDelay);
  },

  /*
  * This is a private method that can be used to change the readyState. This is used
  * like this: this.protocol.subject.observe('updateReadyState', this._updateReadyState, this);
  * so that the service and the server can change the readyState simply be notifing a namespace.
  *
  * @param {newReadyState: number}: The new ready state. Must be 0-4
  */
  _updateReadyState: function _updateReadyState(newReadyState) {
    if (newReadyState >= 0 && newReadyState <= 4) {
      this.readyState = newReadyState;
    }
  }
};

exports['default'] = MockSocket;
module.exports = exports['default'];
},{"./helpers/delay":1,"./helpers/global-context":2,"./helpers/message-event":3,"./helpers/url-transform":4,"./helpers/websocket-properties":5}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersMessageEvent = require('./helpers/message-event');

var _helpersMessageEvent2 = _interopRequireDefault(_helpersMessageEvent);

var _helpersGlobalContext = require('./helpers/global-context');

var _helpersGlobalContext2 = _interopRequireDefault(_helpersGlobalContext);

function SocketService() {
  this.list = {};
}

SocketService.prototype = {
  server: null,

  /*
  * This notifies the mock server that a client is connecting and also sets up
  * the ready state observer.
  *
  * @param {client: object} the context of the client
  * @param {readyStateFunction: function} the function that will be invoked on a ready state change
  */
  clientIsConnecting: function clientIsConnecting(client, readyStateFunction) {
    this.observe('updateReadyState', readyStateFunction, client);

    // if the server has not been set then we notify the onclose method of this client
    if (!this.server) {
      this.notifyOnlyFor(client, 'updateReadyState', _helpersGlobalContext2['default'].MockSocket.CLOSED);
      this.notifyOnlyFor(client, 'clientOnError', (0, _helpersMessageEvent2['default'])('error', null, client.url));
      return false;
    }

    this.notifyOnlyFor(client, 'updateReadyState', _helpersGlobalContext2['default'].MockSocket.OPEN);
    this.notify('clientHasJoined', this.server);
    this.notifyOnlyFor(client, 'clientOnOpen', (0, _helpersMessageEvent2['default'])('open', null, this.server.url));
  },

  /*
  * Closes a connection from the server's perspective. This should
  * close all clients.
  *
  * @param {messageEvent: object} the mock message event.
  */
  closeConnectionFromServer: function closeConnectionFromServer(messageEvent) {
    this.notify('updateReadyState', _helpersGlobalContext2['default'].MockSocket.CLOSING);
    this.notify('clientOnclose', messageEvent);
    this.notify('updateReadyState', _helpersGlobalContext2['default'].MockSocket.CLOSED);
    this.notify('clientHasLeft');
  },

  /*
  * Closes a connection from the clients perspective. This
  * should only close the client who initiated the close and not
  * all of the other clients.
  *
  * @param {messageEvent: object} the mock message event.
  * @param {client: object} the context of the client
  */
  closeConnectionFromClient: function closeConnectionFromClient(messageEvent, client) {
    if (client.readyState === _helpersGlobalContext2['default'].MockSocket.OPEN) {
      this.notifyOnlyFor(client, 'updateReadyState', _helpersGlobalContext2['default'].MockSocket.CLOSING);
      this.notifyOnlyFor(client, 'clientOnclose', messageEvent);
      this.notifyOnlyFor(client, 'updateReadyState', _helpersGlobalContext2['default'].MockSocket.CLOSED);
      this.notify('clientHasLeft');
    }
  },

  /*
  * Notifies the mock server that a client has sent a message.
  *
  * @param {messageEvent: object} the mock message event.
  */
  sendMessageToServer: function sendMessageToServer(messageEvent) {
    this.notify('clientHasSentMessage', messageEvent.data, messageEvent);
  },

  /*
  * Notifies all clients that the server has sent a message
  *
  * @param {messageEvent: object} the mock message event.
  */
  sendMessageToClients: function sendMessageToClients(messageEvent) {
    this.notify('clientOnMessage', messageEvent);
  },

  /*
  * Setup the callback function observers for both the server and client.
  *
  * @param {observerKey: string} either: connection, message or close
  * @param {callback: function} the callback to be invoked
  * @param {server: object} the context of the server
  */
  setCallbackObserver: function setCallbackObserver(observerKey, callback, server) {
    this.observe(observerKey, callback, server);
  },

  /*
  * Binds a callback to a namespace. If notify is called on a namespace all "observers" will be
  * fired with the context that is passed in.
  *
  * @param {namespace: string}
  * @param {callback: function}
  * @param {context: object}
  */
  observe: function observe(namespace, callback, context) {

    // Make sure the arguments are of the correct type
    if (typeof namespace !== 'string' || typeof callback !== 'function' || context && typeof context !== 'object') {
      return false;
    }

    // If a namespace has not been created before then we need to "initialize" the namespace
    if (!this.list[namespace]) {
      this.list[namespace] = [];
    }

    this.list[namespace].push({ callback: callback, context: context });
  },

  /*
  * Remove all observers from a given namespace.
  *
  * @param {namespace: string} The namespace to clear.
  */
  clearAll: function clearAll(namespace) {

    if (!this.verifyNamespaceArg(namespace)) {
      return false;
    }

    this.list[namespace] = [];
  },

  /*
  * Notify all callbacks that have been bound to the given namespace.
  *
  * @param {namespace: string} The namespace to notify observers on.
  * @param {namespace: url} The url to notify observers on.
  */
  notify: function notify(namespace) {

    // This strips the namespace from the list of args as we dont want to pass that into the callback.
    var argumentsForCallback = Array.prototype.slice.call(arguments, 1);

    if (!this.verifyNamespaceArg(namespace)) {
      return false;
    }

    // Loop over all of the observers and fire the callback function with the context.
    for (var i = 0, len = this.list[namespace].length; i < len; i++) {
      this.list[namespace][i].callback.apply(this.list[namespace][i].context, argumentsForCallback);
    }
  },

  /*
  * Notify only the callback of the given context and namespace.
  *
  * @param {context: object} the context to match against.
  * @param {namespace: string} The namespace to notify observers on.
  */
  notifyOnlyFor: function notifyOnlyFor(context, namespace) {

    // This strips the namespace from the list of args as we dont want to pass that into the callback.
    var argumentsForCallback = Array.prototype.slice.call(arguments, 2);

    if (!this.verifyNamespaceArg(namespace)) {
      return false;
    }

    // Loop over all of the observers and fire the callback function with the context.
    for (var i = 0, len = this.list[namespace].length; i < len; i++) {
      if (this.list[namespace][i].context === context) {
        this.list[namespace][i].callback.apply(this.list[namespace][i].context, argumentsForCallback);
      }
    }
  },

  /*
  * Verifies that the namespace is valid.
  *
  * @param {namespace: string} The namespace to verify.
  */
  verifyNamespaceArg: function verifyNamespaceArg(namespace) {
    if (typeof namespace !== 'string' || !this.list[namespace]) {
      return false;
    }

    return true;
  }
};

exports['default'] = SocketService;
module.exports = exports['default'];
},{"./helpers/global-context":2,"./helpers/message-event":3}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm9jY29saS1mYXN0LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImhlbHBlcnMvZGVsYXkuanMiLCJoZWxwZXJzL2dsb2JhbC1jb250ZXh0LmpzIiwiaGVscGVycy9tZXNzYWdlLWV2ZW50LmpzIiwiaGVscGVycy91cmwtdHJhbnNmb3JtLmpzIiwiaGVscGVycy93ZWJzb2NrZXQtcHJvcGVydGllcy5qcyIsIm1haW4uanMiLCJtb2NrLXNlcnZlci5qcyIsIm1vY2stc29ja2V0LmpzIiwic2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9nbG9iYWxDb250ZXh0ID0gcmVxdWlyZSgnLi9nbG9iYWwtY29udGV4dCcpO1xuXG52YXIgX2dsb2JhbENvbnRleHQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2xvYmFsQ29udGV4dCk7XG5cbi8qXG4qIFRoaXMgZGVsYXkgYWxsb3dzIHRoZSB0aHJlYWQgdG8gZmluaXNoIGFzc2lnbmluZyBpdHMgb24qIG1ldGhvZHNcbiogYmVmb3JlIGludm9raW5nIHRoZSBkZWxheSBjYWxsYmFjay4gVGhpcyBpcyBwdXJlbHkgYSB0aW1pbmcgaGFjay5cbiogaHR0cDovL2dlZWthYnl0ZS5ibG9nc3BvdC5jb20vMjAxNC8wMS9qYXZhc2NyaXB0LWVmZmVjdC1vZi1zZXR0aW5nLXNldHRpbWVvdXQuaHRtbFxuKlxuKiBAcGFyYW0ge2NhbGxiYWNrOiBmdW5jdGlvbn0gdGhlIGNhbGxiYWNrIHdoaWNoIHdpbGwgYmUgaW52b2tlZCBhZnRlciB0aGUgdGltZW91dFxuKiBAcGFybWEge2NvbnRleHQ6IG9iamVjdH0gdGhlIGNvbnRleHQgaW4gd2hpY2ggdG8gaW52b2tlIHRoZSBmdW5jdGlvblxuKi9cbmZ1bmN0aW9uIGRlbGF5KGNhbGxiYWNrLCBjb250ZXh0LCBub3RVc2VEZWxheSkge1xuICBpZiAobm90VXNlRGVsYXkgIT0gdHJ1ZSkge1xuICAgIF9nbG9iYWxDb250ZXh0MlsnZGVmYXVsdCddLnNldFRpbWVvdXQoZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCk7XG4gICAgfSwgNCwgY29udGV4dCk7XG4gIH0gZWxzZSB7XG4gICAgY2FsbGJhY2suY2FsbChjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnRzWydkZWZhdWx0J10gPSBkZWxheTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIi8qXG4qIERldGVybWluZXMgdGhlIGdsb2JhbCBjb250ZXh0LiBUaGlzIHNob3VsZCBiZSBlaXRoZXIgd2luZG93IChpbiB0aGUpXG4qIGNhc2Ugd2hlcmUgd2UgYXJlIGluIGEgYnJvd3Nlcikgb3IgZ2xvYmFsIChpbiB0aGUgY2FzZSB3aGVyZSB3ZSBhcmUgaW5cbiogbm9kZSlcbiovXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgZ2xvYmFsQ29udGV4dDtcblxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgZ2xvYmFsQ29udGV4dCA9IGdsb2JhbDtcbn0gZWxzZSB7XG4gICAgZ2xvYmFsQ29udGV4dCA9IHdpbmRvdztcbn1cblxuaWYgKCFnbG9iYWxDb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gc2V0IHRoZSBnbG9iYWwgY29udGV4dCB0byBlaXRoZXIgd2luZG93IG9yIGdsb2JhbC4nKTtcbn1cblxuZXhwb3J0c1snZGVmYXVsdCddID0gZ2xvYmFsQ29udGV4dDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIi8qXG4qIFRoaXMgaXMgYSBtb2NrIHdlYnNvY2tldCBldmVudCBtZXNzYWdlIHRoYXQgaXMgcGFzc2VkIGludG8gdGhlIG9ub3Blbixcbiogb3BtZXNzYWdlLCBldGMgZnVuY3Rpb25zLlxuKlxuKiBAcGFyYW0ge25hbWU6IHN0cmluZ30gVGhlIG5hbWUgb2YgdGhlIGV2ZW50XG4qIEBwYXJhbSB7ZGF0YTogKn0gVGhlIGRhdGEgdG8gc2VuZC5cbiogQHBhcmFtIHtvcmlnaW46IHN0cmluZ30gVGhlIHVybCBvZiB0aGUgcGxhY2Ugd2hlcmUgdGhlIGV2ZW50IGlzIG9yaWdpbmF0aW5nLlxuKi9cbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG5mdW5jdGlvbiBzb2NrZXRFdmVudE1lc3NhZ2UobmFtZSwgZGF0YSwgb3JpZ2luKSB7XG5cdHZhciBwb3J0cyA9IG51bGw7XG5cdHZhciBzb3VyY2UgPSBudWxsO1xuXHR2YXIgYnViYmxlcyA9IGZhbHNlO1xuXHR2YXIgY2FuY2VsYWJsZSA9IGZhbHNlO1xuXHR2YXIgbGFzdEV2ZW50SWQgPSAnJztcblx0dmFyIHRhcmdldFBsYWNlaG9sZCA9IG51bGw7XG5cdHZhciBtZXNzYWdlRXZlbnQ7XG5cblx0dHJ5IHtcblx0XHRtZXNzYWdlRXZlbnQgPSBuZXcgTWVzc2FnZUV2ZW50KG5hbWUpO1xuXHRcdG1lc3NhZ2VFdmVudC5pbml0TWVzc2FnZUV2ZW50KG5hbWUsIGJ1YmJsZXMsIGNhbmNlbGFibGUsIGRhdGEsIG9yaWdpbiwgbGFzdEV2ZW50SWQpO1xuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMobWVzc2FnZUV2ZW50LCB7XG5cdFx0XHR0YXJnZXQ6IHtcblx0XHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRhcmdldFBsYWNlaG9sZDtcblx0XHRcdFx0fSxcblx0XHRcdFx0c2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcblx0XHRcdFx0XHR0YXJnZXRQbGFjZWhvbGQgPSB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHNyY0VsZW1lbnQ6IHtcblx0XHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMudGFyZ2V0O1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0Y3VycmVudFRhcmdldDoge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy50YXJnZXQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdC8vIFdlIGFyZSB1bmFibGUgdG8gY3JlYXRlIGEgTWVzc2FnZUV2ZW50IE9iamVjdC4gVGhpcyBzaG91bGQgb25seSBiZSBoYXBwZW5pbmcgaW4gUGhhbnRvbUpTLlxuXHRcdG1lc3NhZ2VFdmVudCA9IHtcblx0XHRcdHR5cGU6IG5hbWUsXG5cdFx0XHRidWJibGVzOiBidWJibGVzLFxuXHRcdFx0Y2FuY2VsYWJsZTogY2FuY2VsYWJsZSxcblx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRvcmlnaW46IG9yaWdpbixcblx0XHRcdGxhc3RFdmVudElkOiBsYXN0RXZlbnRJZCxcblx0XHRcdHNvdXJjZTogc291cmNlLFxuXHRcdFx0cG9ydHM6IHBvcnRzLFxuXHRcdFx0ZGVmYXVsdFByZXZlbnRlZDogZmFsc2UsXG5cdFx0XHRyZXR1cm5WYWx1ZTogdHJ1ZSxcblx0XHRcdGNsaXBib2FyZERhdGE6IHVuZGVmaW5lZFxuXHRcdH07XG5cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyhtZXNzYWdlRXZlbnQsIHtcblx0XHRcdHRhcmdldDoge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGFyZ2V0UGxhY2Vob2xkO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuXHRcdFx0XHRcdHRhcmdldFBsYWNlaG9sZCA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0c3JjRWxlbWVudDoge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy50YXJnZXQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRjdXJyZW50VGFyZ2V0OiB7XG5cdFx0XHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLnRhcmdldDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIG1lc3NhZ2VFdmVudDtcbn1cblxuZXhwb3J0c1snZGVmYXVsdCddID0gc29ja2V0RXZlbnRNZXNzYWdlO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiLypcbiogVGhlIG5hdGl2ZSB3ZWJzb2NrZXQgb2JqZWN0IHdpbGwgdHJhbnNmb3JtIHVybHMgd2l0aG91dCBhIHBhdGhuYW1lIHRvIGhhdmUganVzdCBhIC8uXG4qIEFzIGFuIGV4YW1wbGU6IHdzOi8vbG9jYWxob3N0OjgwODAgd291bGQgYWN0dWFsbHkgYmUgd3M6Ly9sb2NhbGhvc3Q6ODA4MC8gYnV0IHdzOi8vZXhhbXBsZS5jb20vZm9vIHdvdWxkIG5vdFxuKiBjaGFuZ2UuIFRoaXMgZnVuY3Rpb24gZG9lcyB0aGlzIHRyYW5zZm9ybWF0aW9uIHRvIHN0YXkgaW5saW5lIHdpdGggdGhlIG5hdGl2ZSB3ZWJzb2NrZXQgaW1wbGVtZW50YXRpb24uXG4qXG4qIEBwYXJhbSB7dXJsOiBzdHJpbmd9IFRoZSB1cmwgdG8gdHJhbnNmb3JtLlxuKi9cbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5mdW5jdGlvbiB1cmxUcmFuc2Zvcm0odXJsKSB7XG4gIHZhciB1cmxQYXRoID0gdXJsUGFyc2UoJ3BhdGgnLCB1cmwpO1xuICB2YXIgdXJsUXVlcnkgPSB1cmxQYXJzZSgnPycsIHVybCk7XG5cbiAgdXJsUXVlcnkgPSB1cmxRdWVyeSA/ICc/JyArIHVybFF1ZXJ5IDogJyc7XG5cbiAgaWYgKHVybFBhdGggPT09ICcnKSB7XG4gICAgcmV0dXJuIHVybC5zcGxpdCgnPycpWzBdICsgJy8nICsgdXJsUXVlcnk7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufVxuXG4vKlxuKiBUaGUgZm9sbG93aW5nIGZ1bmN0aW9ucyAoaXNOdW1lcmljICYgdXJsUGFyc2UpIHdhcyB0YWtlbiBmcm9tXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJzYW5vdmEvanMtdXJsL2Jsb2IvNzY0ZWQ4ZDk0MDEyYTc5YmZhOTEwMjZmMmE2MmZlMzM4M2E1YTQ5ZS91cmwuanNcbiogd2hpY2ggaXMgc2hhcmVkIHZpYSB0aGUgTUlUIGxpY2Vuc2Ugd2l0aCBtaW5pbWFsIG1vZGlmaWNhdGlvbnMuXG4qL1xuZnVuY3Rpb24gaXNOdW1lcmljKGFyZykge1xuICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQoYXJnKSkgJiYgaXNGaW5pdGUoYXJnKTtcbn1cblxuZnVuY3Rpb24gdXJsUGFyc2UoYXJnLCB1cmwpIHtcbiAgdmFyIF9scyA9IHVybCB8fCB3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKTtcblxuICBpZiAoIWFyZykge1xuICAgIHJldHVybiBfbHM7XG4gIH0gZWxzZSB7XG4gICAgYXJnID0gYXJnLnRvU3RyaW5nKCk7XG4gIH1cblxuICBpZiAoX2xzLnN1YnN0cmluZygwLCAyKSA9PT0gJy8vJykge1xuICAgIF9scyA9ICdodHRwOicgKyBfbHM7XG4gIH0gZWxzZSBpZiAoX2xzLnNwbGl0KCc6Ly8nKS5sZW5ndGggPT09IDEpIHtcbiAgICBfbHMgPSAnaHR0cDovLycgKyBfbHM7XG4gIH1cblxuICB1cmwgPSBfbHMuc3BsaXQoJy8nKTtcbiAgdmFyIF9sID0geyBhdXRoOiAnJyB9LFxuICAgICAgaG9zdCA9IHVybFsyXS5zcGxpdCgnQCcpO1xuXG4gIGlmIChob3N0Lmxlbmd0aCA9PT0gMSkge1xuICAgIGhvc3QgPSBob3N0WzBdLnNwbGl0KCc6Jyk7XG4gIH0gZWxzZSB7XG4gICAgX2wuYXV0aCA9IGhvc3RbMF07aG9zdCA9IGhvc3RbMV0uc3BsaXQoJzonKTtcbiAgfVxuXG4gIF9sLnByb3RvY29sID0gdXJsWzBdO1xuICBfbC5ob3N0bmFtZSA9IGhvc3RbMF07XG4gIF9sLnBvcnQgPSBob3N0WzFdIHx8IChfbC5wcm90b2NvbC5zcGxpdCgnOicpWzBdLnRvTG93ZXJDYXNlKCkgPT09ICdodHRwcycgPyAnNDQzJyA6ICc4MCcpO1xuICBfbC5wYXRobmFtZSA9ICh1cmwubGVuZ3RoID4gMyA/ICcvJyA6ICcnKSArIHVybC5zbGljZSgzLCB1cmwubGVuZ3RoKS5qb2luKCcvJykuc3BsaXQoJz8nKVswXS5zcGxpdCgnIycpWzBdO1xuICB2YXIgX3AgPSBfbC5wYXRobmFtZTtcblxuICBpZiAoX3AuY2hhckF0KF9wLmxlbmd0aCAtIDEpID09PSAnLycpIHtcbiAgICBfcCA9IF9wLnN1YnN0cmluZygwLCBfcC5sZW5ndGggLSAxKTtcbiAgfVxuICB2YXIgX2ggPSBfbC5ob3N0bmFtZSxcbiAgICAgIF9ocyA9IF9oLnNwbGl0KCcuJyksXG4gICAgICBfcHMgPSBfcC5zcGxpdCgnLycpO1xuXG4gIGlmIChhcmcgPT09ICdob3N0bmFtZScpIHtcbiAgICByZXR1cm4gX2g7XG4gIH0gZWxzZSBpZiAoYXJnID09PSAnZG9tYWluJykge1xuICAgIGlmICgvXigoWzAtOV18WzEtOV1bMC05XXwxWzAtOV17Mn18MlswLTRdWzAtOV18MjVbMC01XSlcXC4pezN9KFswLTldfFsxLTldWzAtOV18MVswLTldezJ9fDJbMC00XVswLTldfDI1WzAtNV0pJC8udGVzdChfaCkpIHtcbiAgICAgIHJldHVybiBfaDtcbiAgICB9XG4gICAgcmV0dXJuIF9ocy5zbGljZSgtMikuam9pbignLicpO1xuICB9XG4gIC8vZWxzZSBpZiAoYXJnID09PSAndGxkJykgeyByZXR1cm4gX2hzLnNsaWNlKC0xKS5qb2luKCcuJyk7IH1cbiAgZWxzZSBpZiAoYXJnID09PSAnc3ViJykge1xuICAgIHJldHVybiBfaHMuc2xpY2UoMCwgX2hzLmxlbmd0aCAtIDIpLmpvaW4oJy4nKTtcbiAgfSBlbHNlIGlmIChhcmcgPT09ICdwb3J0Jykge1xuICAgIHJldHVybiBfbC5wb3J0O1xuICB9IGVsc2UgaWYgKGFyZyA9PT0gJ3Byb3RvY29sJykge1xuICAgIHJldHVybiBfbC5wcm90b2NvbC5zcGxpdCgnOicpWzBdO1xuICB9IGVsc2UgaWYgKGFyZyA9PT0gJ2F1dGgnKSB7XG4gICAgcmV0dXJuIF9sLmF1dGg7XG4gIH0gZWxzZSBpZiAoYXJnID09PSAndXNlcicpIHtcbiAgICByZXR1cm4gX2wuYXV0aC5zcGxpdCgnOicpWzBdO1xuICB9IGVsc2UgaWYgKGFyZyA9PT0gJ3Bhc3MnKSB7XG4gICAgcmV0dXJuIF9sLmF1dGguc3BsaXQoJzonKVsxXSB8fCAnJztcbiAgfSBlbHNlIGlmIChhcmcgPT09ICdwYXRoJykge1xuICAgIHJldHVybiBfbC5wYXRobmFtZTtcbiAgfSBlbHNlIGlmIChhcmcuY2hhckF0KDApID09PSAnLicpIHtcbiAgICBhcmcgPSBhcmcuc3Vic3RyaW5nKDEpO1xuICAgIGlmIChpc051bWVyaWMoYXJnKSkge1xuICAgICAgYXJnID0gcGFyc2VJbnQoYXJnLCAxMCk7cmV0dXJuIF9oc1thcmcgPCAwID8gX2hzLmxlbmd0aCArIGFyZyA6IGFyZyAtIDFdIHx8ICcnO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc051bWVyaWMoYXJnKSkge1xuICAgIGFyZyA9IHBhcnNlSW50KGFyZywgMTApO3JldHVybiBfcHNbYXJnIDwgMCA/IF9wcy5sZW5ndGggKyBhcmcgOiBhcmddIHx8ICcnO1xuICB9IGVsc2UgaWYgKGFyZyA9PT0gJ2ZpbGUnKSB7XG4gICAgcmV0dXJuIF9wcy5zbGljZSgtMSlbMF07XG4gIH0gZWxzZSBpZiAoYXJnID09PSAnZmlsZW5hbWUnKSB7XG4gICAgcmV0dXJuIF9wcy5zbGljZSgtMSlbMF0uc3BsaXQoJy4nKVswXTtcbiAgfSBlbHNlIGlmIChhcmcgPT09ICdmaWxlZXh0Jykge1xuICAgIHJldHVybiBfcHMuc2xpY2UoLTEpWzBdLnNwbGl0KCcuJylbMV0gfHwgJyc7XG4gIH0gZWxzZSBpZiAoYXJnLmNoYXJBdCgwKSA9PT0gJz8nIHx8IGFyZy5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgIHZhciBwYXJhbXMgPSBfbHMsXG4gICAgICAgIHBhcmFtID0gbnVsbDtcblxuICAgIGlmIChhcmcuY2hhckF0KDApID09PSAnPycpIHtcbiAgICAgIHBhcmFtcyA9IChwYXJhbXMuc3BsaXQoJz8nKVsxXSB8fCAnJykuc3BsaXQoJyMnKVswXTtcbiAgICB9IGVsc2UgaWYgKGFyZy5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgICAgcGFyYW1zID0gcGFyYW1zLnNwbGl0KCcjJylbMV0gfHwgJyc7XG4gICAgfVxuXG4gICAgaWYgKCFhcmcuY2hhckF0KDEpKSB7XG4gICAgICByZXR1cm4gcGFyYW1zO1xuICAgIH1cblxuICAgIGFyZyA9IGFyZy5zdWJzdHJpbmcoMSk7XG4gICAgcGFyYW1zID0gcGFyYW1zLnNwbGl0KCcmJyk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBwYXJhbXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgcGFyYW0gPSBwYXJhbXNbaV0uc3BsaXQoJz0nKTtcbiAgICAgIGlmIChwYXJhbVswXSA9PT0gYXJnKSB7XG4gICAgICAgIHJldHVybiBwYXJhbVsxXSB8fCAnJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiAnJztcbn1cblxuZXhwb3J0c1snZGVmYXVsdCddID0gdXJsVHJhbnNmb3JtO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiLypcbiogVGhpcyBkZWZpbmVzIGZvdXIgbWV0aG9kczogb25vcGVuLCBvbm1lc3NhZ2UsIG9uZXJyb3IsIGFuZCBvbmNsb3NlLiBUaGlzIGlzIGRvbmUgdGhpcyB3YXkgaW5zdGVhZCBvZlxuKiBqdXN0IHBsYWNpbmcgdGhlIG1ldGhvZHMgb24gdGhlIHByb3RvdHlwZSBiZWNhdXNlIHdlIG5lZWQgdG8gY2FwdHVyZSB0aGUgY2FsbGJhY2sgd2hlbiBpdCBpcyBkZWZpbmVkIGxpa2Ugc286XG4qXG4qIG1vY2tTb2NrZXQub25vcGVuID0gZnVuY3Rpb24oKSB7IC8vIHRoaXMgaXMgd2hhdCB3ZSBuZWVkIHRvIHN0b3JlIH07XG4qXG4qIFRoZSBvbmx5IHdheSBpcyB0byBjYXB0dXJlIHRoZSBjYWxsYmFjayB2aWEgdGhlIGN1c3RvbSBzZXR0ZXIgYmVsb3cgYW5kIHRoZW4gcGxhY2UgdGhlbSBpbnRvIHRoZSBjb3JyZWN0XG4qIG5hbWVzcGFjZSBzbyB0aGV5IGdldCBpbnZva2VkIGF0IHRoZSByaWdodCB0aW1lLlxuKlxuKiBAcGFyYW0ge3dlYnNvY2tldDogb2JqZWN0fSBUaGUgd2Vic29ja2V0IG9iamVjdCB3aGljaCB3ZSB3YW50IHRvIGRlZmluZSB0aGVzZSBwcm9wZXJ0aWVzIG9udG9cbiovXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZnVuY3Rpb24gd2ViU29ja2V0UHJvcGVydGllcyh3ZWJzb2NrZXQpIHtcbiAgdmFyIGV2ZW50TWVzc2FnZVNvdXJjZSA9IGZ1bmN0aW9uIGV2ZW50TWVzc2FnZVNvdXJjZShjYWxsYmFjaykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnRhcmdldCA9IHdlYnNvY2tldDtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KHdlYnNvY2tldCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHdlYnNvY2tldCwge1xuICAgIG9ub3Blbjoge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb25vcGVuO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24gc2V0KGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX29ub3BlbiA9IGV2ZW50TWVzc2FnZVNvdXJjZShjYWxsYmFjayk7XG4gICAgICAgIHRoaXMuc2VydmljZS5zZXRDYWxsYmFja09ic2VydmVyKCdjbGllbnRPbk9wZW4nLCB0aGlzLl9vbm9wZW4sIHdlYnNvY2tldCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBvbm1lc3NhZ2U6IHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29ubWVzc2FnZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHNldChjYWxsYmFjaykge1xuICAgICAgICB0aGlzLl9vbm1lc3NhZ2UgPSBldmVudE1lc3NhZ2VTb3VyY2UoY2FsbGJhY2spO1xuICAgICAgICB0aGlzLnNlcnZpY2Uuc2V0Q2FsbGJhY2tPYnNlcnZlcignY2xpZW50T25NZXNzYWdlJywgdGhpcy5fb25tZXNzYWdlLCB3ZWJzb2NrZXQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgb25jbG9zZToge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb25jbG9zZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHNldChjYWxsYmFjaykge1xuICAgICAgICB0aGlzLl9vbmNsb3NlID0gZXZlbnRNZXNzYWdlU291cmNlKGNhbGxiYWNrKTtcbiAgICAgICAgdGhpcy5zZXJ2aWNlLnNldENhbGxiYWNrT2JzZXJ2ZXIoJ2NsaWVudE9uY2xvc2UnLCB0aGlzLl9vbmNsb3NlLCB3ZWJzb2NrZXQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgb25lcnJvcjoge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb25lcnJvcjtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHNldChjYWxsYmFjaykge1xuICAgICAgICB0aGlzLl9vbmVycm9yID0gZXZlbnRNZXNzYWdlU291cmNlKGNhbGxiYWNrKTtcbiAgICAgICAgdGhpcy5zZXJ2aWNlLnNldENhbGxiYWNrT2JzZXJ2ZXIoJ2NsaWVudE9uRXJyb3InLCB0aGlzLl9vbmVycm9yLCB3ZWJzb2NrZXQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHdlYlNvY2tldFByb3BlcnRpZXM7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9zZXJ2aWNlID0gcmVxdWlyZSgnLi9zZXJ2aWNlJyk7XG5cbnZhciBfc2VydmljZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zZXJ2aWNlKTtcblxudmFyIF9tb2NrU2VydmVyID0gcmVxdWlyZSgnLi9tb2NrLXNlcnZlcicpO1xuXG52YXIgX21vY2tTZXJ2ZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbW9ja1NlcnZlcik7XG5cbnZhciBfbW9ja1NvY2tldCA9IHJlcXVpcmUoJy4vbW9jay1zb2NrZXQnKTtcblxudmFyIF9tb2NrU29ja2V0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21vY2tTb2NrZXQpO1xuXG52YXIgX2hlbHBlcnNHbG9iYWxDb250ZXh0ID0gcmVxdWlyZSgnLi9oZWxwZXJzL2dsb2JhbC1jb250ZXh0Jyk7XG5cbnZhciBfaGVscGVyc0dsb2JhbENvbnRleHQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0dsb2JhbENvbnRleHQpO1xuXG5faGVscGVyc0dsb2JhbENvbnRleHQyWydkZWZhdWx0J10uU29ja2V0U2VydmljZSA9IF9zZXJ2aWNlMlsnZGVmYXVsdCddO1xuX2hlbHBlcnNHbG9iYWxDb250ZXh0MlsnZGVmYXVsdCddLk1vY2tTb2NrZXQgPSBfbW9ja1NvY2tldDJbJ2RlZmF1bHQnXTtcbl9oZWxwZXJzR2xvYmFsQ29udGV4dDJbJ2RlZmF1bHQnXS5Nb2NrU2VydmVyID0gX21vY2tTZXJ2ZXIyWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3NlcnZpY2UgPSByZXF1aXJlKCcuL3NlcnZpY2UnKTtcblxudmFyIF9zZXJ2aWNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NlcnZpY2UpO1xuXG52YXIgX2hlbHBlcnNEZWxheSA9IHJlcXVpcmUoJy4vaGVscGVycy9kZWxheScpO1xuXG52YXIgX2hlbHBlcnNEZWxheTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzRGVsYXkpO1xuXG52YXIgX2hlbHBlcnNVcmxUcmFuc2Zvcm0gPSByZXF1aXJlKCcuL2hlbHBlcnMvdXJsLXRyYW5zZm9ybScpO1xuXG52YXIgX2hlbHBlcnNVcmxUcmFuc2Zvcm0yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc1VybFRyYW5zZm9ybSk7XG5cbnZhciBfaGVscGVyc01lc3NhZ2VFdmVudCA9IHJlcXVpcmUoJy4vaGVscGVycy9tZXNzYWdlLWV2ZW50Jyk7XG5cbnZhciBfaGVscGVyc01lc3NhZ2VFdmVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzTWVzc2FnZUV2ZW50KTtcblxudmFyIF9oZWxwZXJzR2xvYmFsQ29udGV4dCA9IHJlcXVpcmUoJy4vaGVscGVycy9nbG9iYWwtY29udGV4dCcpO1xuXG52YXIgX2hlbHBlcnNHbG9iYWxDb250ZXh0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNHbG9iYWxDb250ZXh0KTtcblxuZnVuY3Rpb24gTW9ja1NlcnZlcih1cmwsIG5vdFVzZURlbGF5KSB7XG4gIHZhciBzZXJ2aWNlID0gbmV3IF9zZXJ2aWNlMlsnZGVmYXVsdCddKCk7XG4gIHRoaXMudXJsID0gKDAsIF9oZWxwZXJzVXJsVHJhbnNmb3JtMlsnZGVmYXVsdCddKSh1cmwpO1xuICB0aGlzLm5vdFVzZURlbGF5ID0gZmFsc2U7XG4gIGlmIChub3RVc2VEZWxheSA9PSB0cnVlKSB7XG4gICAgdGhpcy5ub3RVc2VEZWxheSA9IHRydWU7XG4gIH1cblxuICBfaGVscGVyc0dsb2JhbENvbnRleHQyWydkZWZhdWx0J10uTW9ja1NvY2tldC5zZXJ2aWNlc1t0aGlzLnVybF0gPSBzZXJ2aWNlO1xuXG4gIHRoaXMuc2VydmljZSA9IHNlcnZpY2U7XG4gIC8vIGlnbm9yZSBwb3NzaWJsZSBxdWVyeSBwYXJhbWV0ZXJzXG4gIGlmICh1cmwuaW5kZXhPZihNb2NrU2VydmVyLnVucmVzb2x2YWJsZVVSTCkgPT09IC0xKSB7XG4gICAgc2VydmljZS5zZXJ2ZXIgPSB0aGlzO1xuICB9XG59XG5cbi8qXG4qIFRoaXMgVVJMIGNhbiBiZSB1c2VkIHRvIGVtdWxhdGUgc2VydmVyIHRoYXQgZG9lcyBub3QgZXN0YWJsaXNoIGNvbm5lY3Rpb25cbiovXG5Nb2NrU2VydmVyLnVucmVzb2x2YWJsZVVSTCA9ICd3czovL3VucmVzb2x2YWJsZV91cmwnO1xuXG5Nb2NrU2VydmVyLnByb3RvdHlwZSA9IHtcbiAgc2VydmljZTogbnVsbCxcblxuICAvKlxuICAqIFRoaXMgaXMgdGhlIG1haW4gZnVuY3Rpb24gZm9yIHRoZSBtb2NrIHNlcnZlciB0byBzdWJzY3JpYmUgdG8gdGhlIG9uIGV2ZW50cy5cbiAgKlxuICAqIGllOiBtb2NrU2VydmVyLm9uKCdjb25uZWN0aW9uJywgZnVuY3Rpb24oKSB7IGNvbnNvbGUubG9nKCdhIG1vY2sgY2xpZW50IGNvbm5lY3RlZCcpOyB9KTtcbiAgKlxuICAqIEBwYXJhbSB7dHlwZTogc3RyaW5nfTogVGhlIGV2ZW50IGtleSB0byBzdWJzY3JpYmUgdG8uIFZhbGlkIGtleXMgYXJlOiBjb25uZWN0aW9uLCBtZXNzYWdlLCBhbmQgY2xvc2UuXG4gICogQHBhcmFtIHtjYWxsYmFjazogZnVuY3Rpb259OiBUaGUgY2FsbGJhY2sgd2hpY2ggc2hvdWxkIGJlIGNhbGxlZCB3aGVuIGEgY2VydGFpbiBldmVudCBpcyBmaXJlZC5cbiAgKi9cbiAgb246IGZ1bmN0aW9uIG9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIG9ic2VydmVyS2V5O1xuXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2Nvbm5lY3Rpb24nOlxuICAgICAgICBvYnNlcnZlcktleSA9ICdjbGllbnRIYXNKb2luZWQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21lc3NhZ2UnOlxuICAgICAgICBvYnNlcnZlcktleSA9ICdjbGllbnRIYXNTZW50TWVzc2FnZSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2xvc2UnOlxuICAgICAgICBvYnNlcnZlcktleSA9ICdjbGllbnRIYXNMZWZ0JztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIG9ic2VydmVyS2V5IGlzIHZhbGlkIGJlZm9yZSBvYnNlcnZpbmcgb24gaXQuXG4gICAgaWYgKHR5cGVvZiBvYnNlcnZlcktleSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuc2VydmljZS5jbGVhckFsbChvYnNlcnZlcktleSk7XG4gICAgICB0aGlzLnNlcnZpY2Uuc2V0Q2FsbGJhY2tPYnNlcnZlcihvYnNlcnZlcktleSwgY2FsbGJhY2ssIHRoaXMpO1xuICAgIH1cbiAgfSxcblxuICAvKlxuICAqIFRoaXMgc2VuZCBmdW5jdGlvbiB3aWxsIG5vdGlmeSBhbGwgbW9jayBjbGllbnRzIHZpYSB0aGVpciBvbm1lc3NhZ2UgY2FsbGJhY2tzIHRoYXQgdGhlIHNlcnZlclxuICAqIGhhcyBhIG1lc3NhZ2UgZm9yIHRoZW0uXG4gICpcbiAgKiBAcGFyYW0ge2RhdGE6ICp9OiBBbnkgamF2YXNjcmlwdCBvYmplY3Qgd2hpY2ggd2lsbCBiZSBjcmFmdGVkIGludG8gYSBNZXNzYWdlT2JqZWN0LlxuICAqL1xuICBzZW5kOiBmdW5jdGlvbiBzZW5kKGRhdGEpIHtcbiAgICAoMCwgX2hlbHBlcnNEZWxheTJbJ2RlZmF1bHQnXSkoZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zZXJ2aWNlLnNlbmRNZXNzYWdlVG9DbGllbnRzKCgwLCBfaGVscGVyc01lc3NhZ2VFdmVudDJbJ2RlZmF1bHQnXSkoJ21lc3NhZ2UnLCBkYXRhLCB0aGlzLnVybCkpO1xuICAgIH0sIHRoaXMsIHRoaXMubm90VXNlRGVsYXkpO1xuICB9LFxuXG4gIC8qXG4gICogTm90aWZpZXMgYWxsIG1vY2sgY2xpZW50cyB0aGF0IHRoZSBzZXJ2ZXIgaXMgY2xvc2luZyBhbmQgdGhlaXIgb25jbG9zZSBjYWxsYmFja3Mgc2hvdWxkIGZpcmUuXG4gICovXG4gIGNsb3NlOiBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAoMCwgX2hlbHBlcnNEZWxheTJbJ2RlZmF1bHQnXSkoZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zZXJ2aWNlLmNsb3NlQ29ubmVjdGlvbkZyb21TZXJ2ZXIoKDAsIF9oZWxwZXJzTWVzc2FnZUV2ZW50MlsnZGVmYXVsdCddKSgnY2xvc2UnLCBudWxsLCB0aGlzLnVybCkpO1xuICAgIH0sIHRoaXMsIHRoaXMubm90VXNlRGVsYXkpO1xuICB9XG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBNb2NrU2VydmVyO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2hlbHBlcnNEZWxheSA9IHJlcXVpcmUoJy4vaGVscGVycy9kZWxheScpO1xuXG52YXIgX2hlbHBlcnNEZWxheTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzRGVsYXkpO1xuXG52YXIgX2hlbHBlcnNVcmxUcmFuc2Zvcm0gPSByZXF1aXJlKCcuL2hlbHBlcnMvdXJsLXRyYW5zZm9ybScpO1xuXG52YXIgX2hlbHBlcnNVcmxUcmFuc2Zvcm0yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc1VybFRyYW5zZm9ybSk7XG5cbnZhciBfaGVscGVyc01lc3NhZ2VFdmVudCA9IHJlcXVpcmUoJy4vaGVscGVycy9tZXNzYWdlLWV2ZW50Jyk7XG5cbnZhciBfaGVscGVyc01lc3NhZ2VFdmVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzTWVzc2FnZUV2ZW50KTtcblxudmFyIF9oZWxwZXJzR2xvYmFsQ29udGV4dCA9IHJlcXVpcmUoJy4vaGVscGVycy9nbG9iYWwtY29udGV4dCcpO1xuXG52YXIgX2hlbHBlcnNHbG9iYWxDb250ZXh0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNHbG9iYWxDb250ZXh0KTtcblxudmFyIF9oZWxwZXJzV2Vic29ja2V0UHJvcGVydGllcyA9IHJlcXVpcmUoJy4vaGVscGVycy93ZWJzb2NrZXQtcHJvcGVydGllcycpO1xuXG52YXIgX2hlbHBlcnNXZWJzb2NrZXRQcm9wZXJ0aWVzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNXZWJzb2NrZXRQcm9wZXJ0aWVzKTtcblxuZnVuY3Rpb24gTW9ja1NvY2tldCh1cmwsIG5vdFVzZURlbGF5KSB7XG4gIHRoaXMuYmluYXJ5VHlwZSA9ICdibG9iJztcbiAgdGhpcy51cmwgPSAoMCwgX2hlbHBlcnNVcmxUcmFuc2Zvcm0yWydkZWZhdWx0J10pKHVybCk7XG4gIHRoaXMucmVhZHlTdGF0ZSA9IF9oZWxwZXJzR2xvYmFsQ29udGV4dDJbJ2RlZmF1bHQnXS5Nb2NrU29ja2V0LkNPTk5FQ1RJTkc7XG4gIHRoaXMuc2VydmljZSA9IF9oZWxwZXJzR2xvYmFsQ29udGV4dDJbJ2RlZmF1bHQnXS5Nb2NrU29ja2V0LnNlcnZpY2VzW3RoaXMudXJsXTtcbiAgdGhpcy5ub3RVc2VEZWxheSA9IGZhbHNlO1xuICBpZiAobm90VXNlRGVsYXkgPT0gdHJ1ZSkge1xuICAgIHRoaXMubm90VXNlRGVsYXkgPSB0cnVlO1xuICB9XG5cbiAgdGhpcy5fZXZlbnRIYW5kbGVycyA9IHt9O1xuXG4gICgwLCBfaGVscGVyc1dlYnNvY2tldFByb3BlcnRpZXMyWydkZWZhdWx0J10pKHRoaXMpO1xuXG4gICgwLCBfaGVscGVyc0RlbGF5MlsnZGVmYXVsdCddKShmdW5jdGlvbiAoKSB7XG4gICAgLy8gTGV0IHRoZSBzZXJ2aWNlIGtub3cgdGhhdCB3ZSBhcmUgYm90aCByZWFkeSB0byBjaGFuZ2Ugb3VyIHJlYWR5IHN0YXRlIGFuZCB0aGF0XG4gICAgLy8gdGhpcyBjbGllbnQgaXMgY29ubmVjdGluZyB0byB0aGUgbW9jayBzZXJ2ZXIuXG4gICAgdGhpcy5zZXJ2aWNlLmNsaWVudElzQ29ubmVjdGluZyh0aGlzLCB0aGlzLl91cGRhdGVSZWFkeVN0YXRlKTtcbiAgfSwgdGhpcywgdGhpcy5ub3RVc2VEZWxheSk7XG59XG5cbk1vY2tTb2NrZXQuQ09OTkVDVElORyA9IDA7XG5Nb2NrU29ja2V0Lk9QRU4gPSAxO1xuTW9ja1NvY2tldC5DTE9TSU5HID0gMjtcbk1vY2tTb2NrZXQuQ0xPU0VEID0gMztcbk1vY2tTb2NrZXQuc2VydmljZXMgPSB7fTtcblxuTW9ja1NvY2tldC5wcm90b3R5cGUgPSB7XG5cbiAgLypcbiAgKiBIb2xkcyB0aGUgb24qKiogY2FsbGJhY2sgZnVuY3Rpb25zLiBUaGVzZSBhcmUgcmVhbGx5IGp1c3QgZm9yIHRoZSBjdXN0b21cbiAgKiBnZXR0ZXJzIHRoYXQgYXJlIGRlZmluZWQgaW4gdGhlIGhlbHBlcnMvd2Vic29ja2V0LXByb3BlcnRpZXMuIEFjY2Vzc2luZyB0aGVzZSBwcm9wZXJ0aWVzIGlzIG5vdCBhZHZpc2VkLlxuICAqL1xuICBfb25vcGVuOiBudWxsLFxuICBfb25tZXNzYWdlOiBudWxsLFxuICBfb25lcnJvcjogbnVsbCxcbiAgX29uY2xvc2U6IG51bGwsXG5cbiAgLypcbiAgKiBUaGlzIGhvbGRzIHJlZmVyZW5jZSB0byB0aGUgc2VydmljZSBvYmplY3QuIFRoZSBzZXJ2aWNlIG9iamVjdCBpcyBob3cgd2UgY2FuXG4gICogY29tbXVuaWNhdGUgd2l0aCB0aGUgYmFja2VuZCB2aWEgdGhlIHB1Yi9zdWIgbW9kZWwuXG4gICpcbiAgKiBUaGUgc2VydmljZSBoYXMgcHJvcGVydGllcyB3aGljaCB3ZSBjYW4gdXNlIHRvIG9ic2VydmUgb3Igbm90aWZpeSB3aXRoLlxuICAqIHRoaXMuc2VydmljZS5ub3RpZnkoJ2ZvbycpICYgdGhpcy5zZXJ2aWNlLm9ic2VydmUoJ2ZvbycsIGNhbGxiYWNrLCBjb250ZXh0KVxuICAqL1xuICBzZXJ2aWNlOiBudWxsLFxuXG4gIC8qXG4gICogSW50ZXJuYWwgc3RvcmFnZSBmb3IgZXZlbnQgaGFuZGxlcnMuIEJhc2ljYWxseSwgdGhlcmUgY291bGQgYmUgbW9yZSB0aGFuIG9uZVxuICAqIGhhbmRsZXIgcGVyIGV2ZW50IHNvIHdlIHN0b3JlIHRoZW0gYWxsIGluIGFycmF5LlxuICAqL1xuICBfZXZlbnRIYW5kbGVyczoge30sXG5cbiAgLypcbiAgKiBUaGlzIGlzIGEgbW9jayBmb3IgRXZlbnRUYXJnZXQncyBhZGRFdmVudExpc3RlbmVyIG1ldGhvZC4gQSBiaXQgbmFpdmUgYW5kXG4gICogZG9lc24ndCBpbXBsZW1lbnQgdGhpcmQgdXNlQ2FwdHVyZSBwYXJhbWV0ZXIgYnV0IHNob3VsZCBiZSBlbm91Z2ggZm9yIG1vc3RcbiAgKiAoaWYgbm90IGFsbCkgY2FzZXMuXG4gICpcbiAgKiBAcGFyYW0ge2V2ZW50OiBzdHJpbmd9OiBFdmVudCBuYW1lLlxuICAqIEBwYXJhbSB7aGFuZGxlcjogZnVuY3Rpb259OiBBbnkgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIGV2ZW50IGhhbmRsaW5nLlxuICAqL1xuICBhZGRFdmVudExpc3RlbmVyOiBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudEhhbmRsZXJzW2V2ZW50XSkge1xuICAgICAgdGhpcy5fZXZlbnRIYW5kbGVyc1tldmVudF0gPSBbXTtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHRoaXNbJ29uJyArIGV2ZW50XSA9IGZ1bmN0aW9uIChldmVudE9iamVjdCkge1xuICAgICAgICBzZWxmLmRpc3BhdGNoRXZlbnQoZXZlbnRPYmplY3QpO1xuICAgICAgfTtcbiAgICB9XG4gICAgdGhpcy5fZXZlbnRIYW5kbGVyc1tldmVudF0ucHVzaChoYW5kbGVyKTtcbiAgfSxcblxuICAvKlxuICAqIFRoaXMgaXMgYSBtb2NrIGZvciBFdmVudFRhcmdldCdzIHJlbW92ZUV2ZW50TGlzdGVuZXIgbWV0aG9kLiBBIGJpdCBuYWl2ZSBhbmRcbiAgKiBkb2Vzbid0IGltcGxlbWVudCB0aGlyZCB1c2VDYXB0dXJlIHBhcmFtZXRlciBidXQgc2hvdWxkIGJlIGVub3VnaCBmb3IgbW9zdFxuICAqIChpZiBub3QgYWxsKSBjYXNlcy5cbiAgKlxuICAqIEBwYXJhbSB7ZXZlbnQ6IHN0cmluZ306IEV2ZW50IG5hbWUuXG4gICogQHBhcmFtIHtoYW5kbGVyOiBmdW5jdGlvbn06IEFueSBjYWxsYmFjayBmdW5jdGlvbiBmb3IgZXZlbnQgaGFuZGxpbmcuIFNob3VsZFxuICAqIGJlIG9uZSBvZiB0aGUgZnVuY3Rpb25zIHVzZWQgaW4gdGhlIHByZXZpb3VzIGNhbGxzIG9mIGFkZEV2ZW50TGlzdGVuZXIgbWV0aG9kLlxuICAqL1xuICByZW1vdmVFdmVudExpc3RlbmVyOiBmdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudEhhbmRsZXJzW2V2ZW50XSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLl9ldmVudEhhbmRsZXJzW2V2ZW50XTtcbiAgICBoYW5kbGVycy5zcGxpY2UoaGFuZGxlcnMuaW5kZXhPZihoYW5kbGVyKSwgMSk7XG4gICAgaWYgKCFoYW5kbGVycy5sZW5ndGgpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudEhhbmRsZXJzW2V2ZW50XTtcbiAgICAgIGRlbGV0ZSB0aGlzWydvbicgKyBldmVudF07XG4gICAgfVxuICB9LFxuXG4gIC8qXG4gICogVGhpcyBpcyBhIG1vY2sgZm9yIEV2ZW50VGFyZ2V0J3MgZGlzcGF0Y2hFdmVudCBtZXRob2QuXG4gICpcbiAgKiBAcGFyYW0ge2V2ZW50OiBNZXNzYWdlRXZlbnR9OiBTb21lIGV2ZW50LCBlaXRoZXIgbmF0aXZlIE1lc3NhZ2VFdmVudCBvciBhbiBvYmplY3RcbiAgKiByZXR1cm5lZCBieSByZXF1aXJlKCcuL2hlbHBlcnMvbWVzc2FnZS1ldmVudCcpXG4gICovXG4gIGRpc3BhdGNoRXZlbnQ6IGZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQoZXZlbnQpIHtcbiAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLl9ldmVudEhhbmRsZXJzW2V2ZW50LnR5cGVdO1xuICAgIGlmICghaGFuZGxlcnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoYW5kbGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgaGFuZGxlcnNbaV0uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfVxuICB9LFxuXG4gIC8qXG4gICogVGhpcyBpcyBhIG1vY2sgZm9yIHRoZSBuYXRpdmUgc2VuZCBmdW5jdGlvbiBmb3VuZCBvbiB0aGUgV2ViU29ja2V0IG9iamVjdC4gSXQgbm90aWZpZXMgdGhlXG4gICogc2VydmljZSB0aGF0IGl0IGhhcyBzZW50IGEgbWVzc2FnZS5cbiAgKlxuICAqIEBwYXJhbSB7ZGF0YTogKn06IEFueSBqYXZhc2NyaXB0IG9iamVjdCB3aGljaCB3aWxsIGJlIGNyYWZ0ZWQgaW50byBhIE1lc3NhZ2VPYmplY3QuXG4gICovXG4gIHNlbmQ6IGZ1bmN0aW9uIHNlbmQoZGF0YSkge1xuICAgICgwLCBfaGVscGVyc0RlbGF5MlsnZGVmYXVsdCddKShmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnNlcnZpY2Uuc2VuZE1lc3NhZ2VUb1NlcnZlcigoMCwgX2hlbHBlcnNNZXNzYWdlRXZlbnQyWydkZWZhdWx0J10pKCdtZXNzYWdlJywgZGF0YSwgdGhpcy51cmwpKTtcbiAgICB9LCB0aGlzLCB0aGlzLm5vdFVzZURlbGF5KTtcbiAgfSxcblxuICAvKlxuICAqIFRoaXMgaXMgYSBtb2NrIGZvciB0aGUgbmF0aXZlIGNsb3NlIGZ1bmN0aW9uIGZvdW5kIG9uIHRoZSBXZWJTb2NrZXQgb2JqZWN0LiBJdCBub3RpZmllcyB0aGVcbiAgKiBzZXJ2aWNlIHRoYXQgaXQgaXMgY2xvc2luZyB0aGUgY29ubmVjdGlvbi5cbiAgKi9cbiAgY2xvc2U6IGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICgwLCBfaGVscGVyc0RlbGF5MlsnZGVmYXVsdCddKShmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnNlcnZpY2UuY2xvc2VDb25uZWN0aW9uRnJvbUNsaWVudCgoMCwgX2hlbHBlcnNNZXNzYWdlRXZlbnQyWydkZWZhdWx0J10pKCdjbG9zZScsIG51bGwsIHRoaXMudXJsKSwgdGhpcyk7XG4gICAgfSwgdGhpcywgdGhpcy5ub3RVc2VEZWxheSk7XG4gIH0sXG5cbiAgLypcbiAgKiBUaGlzIGlzIGEgcHJpdmF0ZSBtZXRob2QgdGhhdCBjYW4gYmUgdXNlZCB0byBjaGFuZ2UgdGhlIHJlYWR5U3RhdGUuIFRoaXMgaXMgdXNlZFxuICAqIGxpa2UgdGhpczogdGhpcy5wcm90b2NvbC5zdWJqZWN0Lm9ic2VydmUoJ3VwZGF0ZVJlYWR5U3RhdGUnLCB0aGlzLl91cGRhdGVSZWFkeVN0YXRlLCB0aGlzKTtcbiAgKiBzbyB0aGF0IHRoZSBzZXJ2aWNlIGFuZCB0aGUgc2VydmVyIGNhbiBjaGFuZ2UgdGhlIHJlYWR5U3RhdGUgc2ltcGx5IGJlIG5vdGlmaW5nIGEgbmFtZXNwYWNlLlxuICAqXG4gICogQHBhcmFtIHtuZXdSZWFkeVN0YXRlOiBudW1iZXJ9OiBUaGUgbmV3IHJlYWR5IHN0YXRlLiBNdXN0IGJlIDAtNFxuICAqL1xuICBfdXBkYXRlUmVhZHlTdGF0ZTogZnVuY3Rpb24gX3VwZGF0ZVJlYWR5U3RhdGUobmV3UmVhZHlTdGF0ZSkge1xuICAgIGlmIChuZXdSZWFkeVN0YXRlID49IDAgJiYgbmV3UmVhZHlTdGF0ZSA8PSA0KSB7XG4gICAgICB0aGlzLnJlYWR5U3RhdGUgPSBuZXdSZWFkeVN0YXRlO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gTW9ja1NvY2tldDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9oZWxwZXJzTWVzc2FnZUV2ZW50ID0gcmVxdWlyZSgnLi9oZWxwZXJzL21lc3NhZ2UtZXZlbnQnKTtcblxudmFyIF9oZWxwZXJzTWVzc2FnZUV2ZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNNZXNzYWdlRXZlbnQpO1xuXG52YXIgX2hlbHBlcnNHbG9iYWxDb250ZXh0ID0gcmVxdWlyZSgnLi9oZWxwZXJzL2dsb2JhbC1jb250ZXh0Jyk7XG5cbnZhciBfaGVscGVyc0dsb2JhbENvbnRleHQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0dsb2JhbENvbnRleHQpO1xuXG5mdW5jdGlvbiBTb2NrZXRTZXJ2aWNlKCkge1xuICB0aGlzLmxpc3QgPSB7fTtcbn1cblxuU29ja2V0U2VydmljZS5wcm90b3R5cGUgPSB7XG4gIHNlcnZlcjogbnVsbCxcblxuICAvKlxuICAqIFRoaXMgbm90aWZpZXMgdGhlIG1vY2sgc2VydmVyIHRoYXQgYSBjbGllbnQgaXMgY29ubmVjdGluZyBhbmQgYWxzbyBzZXRzIHVwXG4gICogdGhlIHJlYWR5IHN0YXRlIG9ic2VydmVyLlxuICAqXG4gICogQHBhcmFtIHtjbGllbnQ6IG9iamVjdH0gdGhlIGNvbnRleHQgb2YgdGhlIGNsaWVudFxuICAqIEBwYXJhbSB7cmVhZHlTdGF0ZUZ1bmN0aW9uOiBmdW5jdGlvbn0gdGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBpbnZva2VkIG9uIGEgcmVhZHkgc3RhdGUgY2hhbmdlXG4gICovXG4gIGNsaWVudElzQ29ubmVjdGluZzogZnVuY3Rpb24gY2xpZW50SXNDb25uZWN0aW5nKGNsaWVudCwgcmVhZHlTdGF0ZUZ1bmN0aW9uKSB7XG4gICAgdGhpcy5vYnNlcnZlKCd1cGRhdGVSZWFkeVN0YXRlJywgcmVhZHlTdGF0ZUZ1bmN0aW9uLCBjbGllbnQpO1xuXG4gICAgLy8gaWYgdGhlIHNlcnZlciBoYXMgbm90IGJlZW4gc2V0IHRoZW4gd2Ugbm90aWZ5IHRoZSBvbmNsb3NlIG1ldGhvZCBvZiB0aGlzIGNsaWVudFxuICAgIGlmICghdGhpcy5zZXJ2ZXIpIHtcbiAgICAgIHRoaXMubm90aWZ5T25seUZvcihjbGllbnQsICd1cGRhdGVSZWFkeVN0YXRlJywgX2hlbHBlcnNHbG9iYWxDb250ZXh0MlsnZGVmYXVsdCddLk1vY2tTb2NrZXQuQ0xPU0VEKTtcbiAgICAgIHRoaXMubm90aWZ5T25seUZvcihjbGllbnQsICdjbGllbnRPbkVycm9yJywgKDAsIF9oZWxwZXJzTWVzc2FnZUV2ZW50MlsnZGVmYXVsdCddKSgnZXJyb3InLCBudWxsLCBjbGllbnQudXJsKSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5ub3RpZnlPbmx5Rm9yKGNsaWVudCwgJ3VwZGF0ZVJlYWR5U3RhdGUnLCBfaGVscGVyc0dsb2JhbENvbnRleHQyWydkZWZhdWx0J10uTW9ja1NvY2tldC5PUEVOKTtcbiAgICB0aGlzLm5vdGlmeSgnY2xpZW50SGFzSm9pbmVkJywgdGhpcy5zZXJ2ZXIpO1xuICAgIHRoaXMubm90aWZ5T25seUZvcihjbGllbnQsICdjbGllbnRPbk9wZW4nLCAoMCwgX2hlbHBlcnNNZXNzYWdlRXZlbnQyWydkZWZhdWx0J10pKCdvcGVuJywgbnVsbCwgdGhpcy5zZXJ2ZXIudXJsKSk7XG4gIH0sXG5cbiAgLypcbiAgKiBDbG9zZXMgYSBjb25uZWN0aW9uIGZyb20gdGhlIHNlcnZlcidzIHBlcnNwZWN0aXZlLiBUaGlzIHNob3VsZFxuICAqIGNsb3NlIGFsbCBjbGllbnRzLlxuICAqXG4gICogQHBhcmFtIHttZXNzYWdlRXZlbnQ6IG9iamVjdH0gdGhlIG1vY2sgbWVzc2FnZSBldmVudC5cbiAgKi9cbiAgY2xvc2VDb25uZWN0aW9uRnJvbVNlcnZlcjogZnVuY3Rpb24gY2xvc2VDb25uZWN0aW9uRnJvbVNlcnZlcihtZXNzYWdlRXZlbnQpIHtcbiAgICB0aGlzLm5vdGlmeSgndXBkYXRlUmVhZHlTdGF0ZScsIF9oZWxwZXJzR2xvYmFsQ29udGV4dDJbJ2RlZmF1bHQnXS5Nb2NrU29ja2V0LkNMT1NJTkcpO1xuICAgIHRoaXMubm90aWZ5KCdjbGllbnRPbmNsb3NlJywgbWVzc2FnZUV2ZW50KTtcbiAgICB0aGlzLm5vdGlmeSgndXBkYXRlUmVhZHlTdGF0ZScsIF9oZWxwZXJzR2xvYmFsQ29udGV4dDJbJ2RlZmF1bHQnXS5Nb2NrU29ja2V0LkNMT1NFRCk7XG4gICAgdGhpcy5ub3RpZnkoJ2NsaWVudEhhc0xlZnQnKTtcbiAgfSxcblxuICAvKlxuICAqIENsb3NlcyBhIGNvbm5lY3Rpb24gZnJvbSB0aGUgY2xpZW50cyBwZXJzcGVjdGl2ZS4gVGhpc1xuICAqIHNob3VsZCBvbmx5IGNsb3NlIHRoZSBjbGllbnQgd2hvIGluaXRpYXRlZCB0aGUgY2xvc2UgYW5kIG5vdFxuICAqIGFsbCBvZiB0aGUgb3RoZXIgY2xpZW50cy5cbiAgKlxuICAqIEBwYXJhbSB7bWVzc2FnZUV2ZW50OiBvYmplY3R9IHRoZSBtb2NrIG1lc3NhZ2UgZXZlbnQuXG4gICogQHBhcmFtIHtjbGllbnQ6IG9iamVjdH0gdGhlIGNvbnRleHQgb2YgdGhlIGNsaWVudFxuICAqL1xuICBjbG9zZUNvbm5lY3Rpb25Gcm9tQ2xpZW50OiBmdW5jdGlvbiBjbG9zZUNvbm5lY3Rpb25Gcm9tQ2xpZW50KG1lc3NhZ2VFdmVudCwgY2xpZW50KSB7XG4gICAgaWYgKGNsaWVudC5yZWFkeVN0YXRlID09PSBfaGVscGVyc0dsb2JhbENvbnRleHQyWydkZWZhdWx0J10uTW9ja1NvY2tldC5PUEVOKSB7XG4gICAgICB0aGlzLm5vdGlmeU9ubHlGb3IoY2xpZW50LCAndXBkYXRlUmVhZHlTdGF0ZScsIF9oZWxwZXJzR2xvYmFsQ29udGV4dDJbJ2RlZmF1bHQnXS5Nb2NrU29ja2V0LkNMT1NJTkcpO1xuICAgICAgdGhpcy5ub3RpZnlPbmx5Rm9yKGNsaWVudCwgJ2NsaWVudE9uY2xvc2UnLCBtZXNzYWdlRXZlbnQpO1xuICAgICAgdGhpcy5ub3RpZnlPbmx5Rm9yKGNsaWVudCwgJ3VwZGF0ZVJlYWR5U3RhdGUnLCBfaGVscGVyc0dsb2JhbENvbnRleHQyWydkZWZhdWx0J10uTW9ja1NvY2tldC5DTE9TRUQpO1xuICAgICAgdGhpcy5ub3RpZnkoJ2NsaWVudEhhc0xlZnQnKTtcbiAgICB9XG4gIH0sXG5cbiAgLypcbiAgKiBOb3RpZmllcyB0aGUgbW9jayBzZXJ2ZXIgdGhhdCBhIGNsaWVudCBoYXMgc2VudCBhIG1lc3NhZ2UuXG4gICpcbiAgKiBAcGFyYW0ge21lc3NhZ2VFdmVudDogb2JqZWN0fSB0aGUgbW9jayBtZXNzYWdlIGV2ZW50LlxuICAqL1xuICBzZW5kTWVzc2FnZVRvU2VydmVyOiBmdW5jdGlvbiBzZW5kTWVzc2FnZVRvU2VydmVyKG1lc3NhZ2VFdmVudCkge1xuICAgIHRoaXMubm90aWZ5KCdjbGllbnRIYXNTZW50TWVzc2FnZScsIG1lc3NhZ2VFdmVudC5kYXRhLCBtZXNzYWdlRXZlbnQpO1xuICB9LFxuXG4gIC8qXG4gICogTm90aWZpZXMgYWxsIGNsaWVudHMgdGhhdCB0aGUgc2VydmVyIGhhcyBzZW50IGEgbWVzc2FnZVxuICAqXG4gICogQHBhcmFtIHttZXNzYWdlRXZlbnQ6IG9iamVjdH0gdGhlIG1vY2sgbWVzc2FnZSBldmVudC5cbiAgKi9cbiAgc2VuZE1lc3NhZ2VUb0NsaWVudHM6IGZ1bmN0aW9uIHNlbmRNZXNzYWdlVG9DbGllbnRzKG1lc3NhZ2VFdmVudCkge1xuICAgIHRoaXMubm90aWZ5KCdjbGllbnRPbk1lc3NhZ2UnLCBtZXNzYWdlRXZlbnQpO1xuICB9LFxuXG4gIC8qXG4gICogU2V0dXAgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIG9ic2VydmVycyBmb3IgYm90aCB0aGUgc2VydmVyIGFuZCBjbGllbnQuXG4gICpcbiAgKiBAcGFyYW0ge29ic2VydmVyS2V5OiBzdHJpbmd9IGVpdGhlcjogY29ubmVjdGlvbiwgbWVzc2FnZSBvciBjbG9zZVxuICAqIEBwYXJhbSB7Y2FsbGJhY2s6IGZ1bmN0aW9ufSB0aGUgY2FsbGJhY2sgdG8gYmUgaW52b2tlZFxuICAqIEBwYXJhbSB7c2VydmVyOiBvYmplY3R9IHRoZSBjb250ZXh0IG9mIHRoZSBzZXJ2ZXJcbiAgKi9cbiAgc2V0Q2FsbGJhY2tPYnNlcnZlcjogZnVuY3Rpb24gc2V0Q2FsbGJhY2tPYnNlcnZlcihvYnNlcnZlcktleSwgY2FsbGJhY2ssIHNlcnZlcikge1xuICAgIHRoaXMub2JzZXJ2ZShvYnNlcnZlcktleSwgY2FsbGJhY2ssIHNlcnZlcik7XG4gIH0sXG5cbiAgLypcbiAgKiBCaW5kcyBhIGNhbGxiYWNrIHRvIGEgbmFtZXNwYWNlLiBJZiBub3RpZnkgaXMgY2FsbGVkIG9uIGEgbmFtZXNwYWNlIGFsbCBcIm9ic2VydmVyc1wiIHdpbGwgYmVcbiAgKiBmaXJlZCB3aXRoIHRoZSBjb250ZXh0IHRoYXQgaXMgcGFzc2VkIGluLlxuICAqXG4gICogQHBhcmFtIHtuYW1lc3BhY2U6IHN0cmluZ31cbiAgKiBAcGFyYW0ge2NhbGxiYWNrOiBmdW5jdGlvbn1cbiAgKiBAcGFyYW0ge2NvbnRleHQ6IG9iamVjdH1cbiAgKi9cbiAgb2JzZXJ2ZTogZnVuY3Rpb24gb2JzZXJ2ZShuYW1lc3BhY2UsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG5cbiAgICAvLyBNYWtlIHN1cmUgdGhlIGFyZ3VtZW50cyBhcmUgb2YgdGhlIGNvcnJlY3QgdHlwZVxuICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlICE9PSAnc3RyaW5nJyB8fCB0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicgfHwgY29udGV4dCAmJiB0eXBlb2YgY29udGV4dCAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBJZiBhIG5hbWVzcGFjZSBoYXMgbm90IGJlZW4gY3JlYXRlZCBiZWZvcmUgdGhlbiB3ZSBuZWVkIHRvIFwiaW5pdGlhbGl6ZVwiIHRoZSBuYW1lc3BhY2VcbiAgICBpZiAoIXRoaXMubGlzdFtuYW1lc3BhY2VdKSB7XG4gICAgICB0aGlzLmxpc3RbbmFtZXNwYWNlXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMubGlzdFtuYW1lc3BhY2VdLnB1c2goeyBjYWxsYmFjazogY2FsbGJhY2ssIGNvbnRleHQ6IGNvbnRleHQgfSk7XG4gIH0sXG5cbiAgLypcbiAgKiBSZW1vdmUgYWxsIG9ic2VydmVycyBmcm9tIGEgZ2l2ZW4gbmFtZXNwYWNlLlxuICAqXG4gICogQHBhcmFtIHtuYW1lc3BhY2U6IHN0cmluZ30gVGhlIG5hbWVzcGFjZSB0byBjbGVhci5cbiAgKi9cbiAgY2xlYXJBbGw6IGZ1bmN0aW9uIGNsZWFyQWxsKG5hbWVzcGFjZSkge1xuXG4gICAgaWYgKCF0aGlzLnZlcmlmeU5hbWVzcGFjZUFyZyhuYW1lc3BhY2UpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5saXN0W25hbWVzcGFjZV0gPSBbXTtcbiAgfSxcblxuICAvKlxuICAqIE5vdGlmeSBhbGwgY2FsbGJhY2tzIHRoYXQgaGF2ZSBiZWVuIGJvdW5kIHRvIHRoZSBnaXZlbiBuYW1lc3BhY2UuXG4gICpcbiAgKiBAcGFyYW0ge25hbWVzcGFjZTogc3RyaW5nfSBUaGUgbmFtZXNwYWNlIHRvIG5vdGlmeSBvYnNlcnZlcnMgb24uXG4gICogQHBhcmFtIHtuYW1lc3BhY2U6IHVybH0gVGhlIHVybCB0byBub3RpZnkgb2JzZXJ2ZXJzIG9uLlxuICAqL1xuICBub3RpZnk6IGZ1bmN0aW9uIG5vdGlmeShuYW1lc3BhY2UpIHtcblxuICAgIC8vIFRoaXMgc3RyaXBzIHRoZSBuYW1lc3BhY2UgZnJvbSB0aGUgbGlzdCBvZiBhcmdzIGFzIHdlIGRvbnQgd2FudCB0byBwYXNzIHRoYXQgaW50byB0aGUgY2FsbGJhY2suXG4gICAgdmFyIGFyZ3VtZW50c0ZvckNhbGxiYWNrID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIGlmICghdGhpcy52ZXJpZnlOYW1lc3BhY2VBcmcobmFtZXNwYWNlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIExvb3Agb3ZlciBhbGwgb2YgdGhlIG9ic2VydmVycyBhbmQgZmlyZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gd2l0aCB0aGUgY29udGV4dC5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5saXN0W25hbWVzcGFjZV0ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRoaXMubGlzdFtuYW1lc3BhY2VdW2ldLmNhbGxiYWNrLmFwcGx5KHRoaXMubGlzdFtuYW1lc3BhY2VdW2ldLmNvbnRleHQsIGFyZ3VtZW50c0ZvckNhbGxiYWNrKTtcbiAgICB9XG4gIH0sXG5cbiAgLypcbiAgKiBOb3RpZnkgb25seSB0aGUgY2FsbGJhY2sgb2YgdGhlIGdpdmVuIGNvbnRleHQgYW5kIG5hbWVzcGFjZS5cbiAgKlxuICAqIEBwYXJhbSB7Y29udGV4dDogb2JqZWN0fSB0aGUgY29udGV4dCB0byBtYXRjaCBhZ2FpbnN0LlxuICAqIEBwYXJhbSB7bmFtZXNwYWNlOiBzdHJpbmd9IFRoZSBuYW1lc3BhY2UgdG8gbm90aWZ5IG9ic2VydmVycyBvbi5cbiAgKi9cbiAgbm90aWZ5T25seUZvcjogZnVuY3Rpb24gbm90aWZ5T25seUZvcihjb250ZXh0LCBuYW1lc3BhY2UpIHtcblxuICAgIC8vIFRoaXMgc3RyaXBzIHRoZSBuYW1lc3BhY2UgZnJvbSB0aGUgbGlzdCBvZiBhcmdzIGFzIHdlIGRvbnQgd2FudCB0byBwYXNzIHRoYXQgaW50byB0aGUgY2FsbGJhY2suXG4gICAgdmFyIGFyZ3VtZW50c0ZvckNhbGxiYWNrID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcblxuICAgIGlmICghdGhpcy52ZXJpZnlOYW1lc3BhY2VBcmcobmFtZXNwYWNlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIExvb3Agb3ZlciBhbGwgb2YgdGhlIG9ic2VydmVycyBhbmQgZmlyZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gd2l0aCB0aGUgY29udGV4dC5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5saXN0W25hbWVzcGFjZV0ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmxpc3RbbmFtZXNwYWNlXVtpXS5jb250ZXh0ID09PSBjb250ZXh0KSB7XG4gICAgICAgIHRoaXMubGlzdFtuYW1lc3BhY2VdW2ldLmNhbGxiYWNrLmFwcGx5KHRoaXMubGlzdFtuYW1lc3BhY2VdW2ldLmNvbnRleHQsIGFyZ3VtZW50c0ZvckNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLypcbiAgKiBWZXJpZmllcyB0aGF0IHRoZSBuYW1lc3BhY2UgaXMgdmFsaWQuXG4gICpcbiAgKiBAcGFyYW0ge25hbWVzcGFjZTogc3RyaW5nfSBUaGUgbmFtZXNwYWNlIHRvIHZlcmlmeS5cbiAgKi9cbiAgdmVyaWZ5TmFtZXNwYWNlQXJnOiBmdW5jdGlvbiB2ZXJpZnlOYW1lc3BhY2VBcmcobmFtZXNwYWNlKSB7XG4gICAgaWYgKHR5cGVvZiBuYW1lc3BhY2UgIT09ICdzdHJpbmcnIHx8ICF0aGlzLmxpc3RbbmFtZXNwYWNlXSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBTb2NrZXRTZXJ2aWNlO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107Il19
