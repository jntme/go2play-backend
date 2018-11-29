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

  P2guser.addFriend = function(username, nFriend, cb) {

    P2guser.findOne({where: {'name':username}})
    .then(function(user){
      user.friends.add(nFriend)
      .catch(function(err){
        return cb(null, "false")
      })
      return cb(null, "true")
    })
  };

  P2guser.remoteMethod (
    'addFriend',
    {
      http: {path: '/addFriend/'},
      accepts: [
                  {arg: "username", type: "string", required:true},
                  {arg: 'nFriend', type: 'string', required: true}
                ],
      returns: {arg: 'ok', type: 'string'}
    }
);



};
