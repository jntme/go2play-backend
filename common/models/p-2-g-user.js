'use strict';

module.exports = function(P2guser) {

  P2guser.alreadyUsed = function(name, cb) {
    P2guser.find({where: {'name':name}}, function(err, users) {
      cb(null, users.length);
    });
  }

   P2guser.remoteMethod (
        'alreadyUsed',
        {
          http: {path: '/alreadyUsed', verb: 'get'},
          accepts: {arg: 'name', type: 'string', required: true, http: { source: 'query' } },
          returns: {arg: 'userCount', type: 'number'}
        }
    );

};
