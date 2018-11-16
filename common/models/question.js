'use strict';

module.exports = function(Question) {
  Question.random = function(cb) {

    cb(null, "RANDOOOOOOOOOOOOOOOM!");
  };

   Question.remoteMethod(
    'random', {
      http: {
        path: '/random',
        verb: 'get'
      },
      returns: {
        arg: 'random',
        type: 'string'
      }
    }
  );
};
