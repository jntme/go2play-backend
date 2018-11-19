'use strict';

module.exports = function(Game) {

    Game.new = function(username, friend, cb) {
        var app = Game.app
        var P2guser = app.models.P2GUser;
        
        var promUser1 = P2guser.findOne({where: {'name':username}})
        var promUser2 = P2guser.findOne({where: {'name':friend}})

        Promise.all([promUser1, promUser2]).then(function(users) {
            var game = new app.models.Game()

            game.user1(users[0])
            game.user2(users[1])
            game.save().then(function(game) {
                console.log(users[0])
                users[0].games.add(game)
                users[1].games.add(game)
            })
            
        })
    };

    Game.remoteMethod (
        'new',
        {
          http: {path: '/new/'},
          accepts: [
                      {arg: "username", type: "string", riquired:true},
                      {arg: 'friend', type: 'string', required: true}
                    ],
          returns: {arg: 'ok', type: 'string'}
        }
    )
}