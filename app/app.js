'use strict';

// log to console only when debug is enabled
var logger = {
    debug : function(msg, obj) {
      if (debug) {
        if (obj !== undefined) {
          console.log("DEBUG:" + msg, JSON.stringify(obj));
        } else {
          console.log("DEBUG:" + msg)
        }
      }
    },
    info : function(msg) {
      console.log('INFO:' + msg); 
    }
};
