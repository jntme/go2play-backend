'use strict';

module.exports = function(Question) {
  Question.random = function(cb) {
    //Question.find({'where': {'id': true}}, function(err, questions) {
    Question.find({}, function(err, questions) {

      var question = questions[Math.floor(Math.random()*questions.length)];

      cb(null, question);
    });
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
