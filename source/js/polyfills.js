// Event.composedPath
// Possibly normalize to add window to Safari's chain, as it does not?
(function(E, d, w) {
  if(!E.composedPath) {
    E.composedPath = function() {
      if (this.path) {
        return this.path;
      } 
    var target = this.target;
    
    this.path = [];
    while (target.parentNode !== null) {
      this.path.push(target);
      target = target.parentNode;
    }
    this.path.push(d, w);
    return this.path;
    }
  }
})(Event.prototype, document, window);

// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

/* Roughly from http://stackoverflow.com/a/22780569/141363 */
(function(global) {
  'use strict';
  if (!global.Promise) {
    throw 'Promise API not available. Mistakes were made.';
  }
  global["jsonpPromise"] = (function() {
    return function(url) {
      return new Promise(function(resolve, reject) {
        var callbackName = 'json_promise_' + Math.round(100000 * Math.random()),
            script = document.createElement('script');

        script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
        script.onerror = reject;
        
        global[callbackName] = function (GLOBAL, s, f, data) {
          // Cleanup
          GLOBAL(data);
          document.head.removeChild(s);
          delete this[f];
        }.bind(global, resolve, script, callbackName);
        // Fire
        document.head.appendChild(script);
      });
    };
  })();
}( window ));