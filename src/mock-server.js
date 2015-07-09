import Service            from './service';
import delay              from './helpers/delay';
import urlTransform       from './helpers/url-transform';
import socketMessageEvent from './helpers/message-event';
import globalContext      from './helpers/global-context';

function MockServer(url, notUseDelay) {
  var service = new Service();
  this.url    = urlTransform(url);
  this.notUseDelay = false;
  if (notUseDelay == true) {
    this.notUseDelay = true;
  }

  globalContext.MockSocket.services[this.url] = service;

  this.service   = service;
  // ignore possible query parameters
  if(url.indexOf(MockServer.unresolvableURL) === -1) {
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
  on: function(type, callback) {
    var observerKey;

    if(typeof callback !== 'function' || typeof type !== 'string') {
      return false;
    }

    switch(type) {
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
    if(typeof observerKey === 'string') {
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
  send: function(data) {
    delay(function() {
      this.service.sendMessageToClients(socketMessageEvent('message', data, this.url));
    }, this, this.notUseDelay);
  },

  /*
  * Notifies all mock clients that the server is closing and their onclose callbacks should fire.
  */
  close: function() {
    delay(function() {
      this.service.closeConnectionFromServer(socketMessageEvent('close', null, this.url));
    }, this, this.notUseDelay);
  }
};

export default MockServer;
