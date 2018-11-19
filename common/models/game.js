'use strict';

module.exports = function(Game) {

    Game.new = function(username, friend, cb) {
        var app = Game.app
        var P2guser = app.models.P2GUser;
        var Question = app.models.Question;
        
        var promUser1 = P2guser.findOne({where: {'name':username}})
        var promUser2 = P2guser.findOne({where: {'name':friend}})
        var promQuestion = Question.find()

        Promise.all([promUser1, promUser2, promQuestion]).then(function(users) {
            var game = new app.models.Game()
            var questions = users[2]

            game.user1(users[0])
            game.user2(users[1])
            game.save().then(function(game) {
                users[0].games.add(game)
                users[1].games.add(game)
                return game
            }).then(function(game) {
                console.log("          -----------        ")
                var randomNums = [];
                for (let i = 0; i < 4; i++) {
                    var randomNum = Math.floor(Math.random()*questions.length)
                    if(randomNums.includes(randomNum)){
                        i--
                        console.log(randomNum)
                    } else {
                        randomNums.push(randomNum)
                        var question = questions[randomNum]
                        game.questions.add(question)
                    }
                }
                return cb(null, game.id)
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
          returns: {arg: 'id', type: 'string'}
        }
    )
}