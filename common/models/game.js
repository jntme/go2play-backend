'use strict';

const GameQuestion = require('../helper_models/gameQuestion');
const Round = require('../helper_models/round');
const crypto = require('crypto');

module.exports = function (Game) {

  // creates a new game with two users (username & the selected friend)
  Game.new = function (username, friend, cb) {
    let app = Game.app;
    let P2guser = app.models.P2GUser;
    let Question = app.models.Question;

    // get the two associated users
    // todo: catch if one of the user is not found and return an error which makes sense
    var promUser1 = P2guser.findOne({where: {'name': username}});
    var promUser2 = P2guser.findOne({where: {'name': friend}});
    var promQuestion = Question.find();

    Promise.all([promUser1, promUser2]).then(function (users) {
      const game = new app.models.Game();

      game.user1(users[0]);
      game.user2(users[1]);
      game.questionHashMap = [];

      //the selected friend should play first
      game.activeUser = friend;

      //create three rounds (as a promise)
      let roundPromises = [];
      for (let r = 0; r < 3; r++) {
        roundPromises.push(getFilledRound(game.questionHashMap, users[0].name, users[1].name, r + 1));
      }

      //pushes all rounds to the game
      Promise.all(roundPromises).then(rounds => {
        game.rounds = rounds;
        return game;
      }).then(game => {
        game.save().then(function (game) {
          users[0].games.add(game);
          users[1].games.add(game);
          return cb(null, game.id);
        });
      })
    })
  };

  // returns a round, ready to play (as a promise)
  // gameQuestionHashMap (array): the hashmap of the game - needs to be passed through to getRandomQuestion
  // user1 (string): name of the user1
  // user2 (string): name of the user2
  // the number of the round in the game
  let getFilledRound = function (gameQuestionHashMap, user1, user2, roundNumber) {
    let questionPromises = [];

    for (let q = 0; q < 3; q++) {
      questionPromises.push(getRandomQuestion(gameQuestionHashMap, user1, user2));
    }

    return Promise.all(questionPromises).then(questions => {
      let round = new Round(roundNumber);
      round.gameQuestions = questions;
      return round;
    });
  };

  // gets a random question with two users associated (as a promise)
  // gameQuestionHashMap (array): the hashmap of the game
  let getRandomQuestion = function (gameQuestionHashMap, user1, user2) {
    var app = Game.app;
    var P2guser = app.models.P2GUser;
    var Question = app.models.Question;

    // go and find all questions
    return Question.find().then(res => {
      //getting a random question
      var question = res[Math.floor(Math.random() * res.length)];
      let hash = crypto.createHash('md5').update(JSON.stringify(question)).digest('hex');

      //if there is any collision with the selected question, try again - as long as needed
      while (gameQuestionHashMap.indexOf(hash) > -1) {
        question = res[Math.floor(Math.random() * res.length)];
        hash = crypto.createHash('md5').update(JSON.stringify(question)).digest('hex');
      }

      gameQuestionHashMap.push(hash);

      let gameQuestion = new GameQuestion(question.question, question.answers, user1, user2);
      return gameQuestion;
    });
  };

  Game.remoteMethod(
    'new',
    {
      http: {path: '/new/'},
      accepts: [
        {arg: "username", type: "string", required: true},
        {arg: 'friend', type: 'string', required: true}
      ],
      returns: {arg: 'id', type: 'string'}
    }
  )

  //Checks if a user has to play or wait for the other user
  //Returns the active round if the user has to play
  Game.round = function (id, username, cb) {
    Game.findOne({where: {"id":id}}).then(function(game){
      if(game.activeUser !=username){
        return cb(null, {"waiting":"waiting for other player"});
      } else {
        return cb(null, game.rounds[game.activeRound-1]);
      }
    })
  };
  
  Game.remoteMethod(
    'round',
    {
      http: {path: '/:id/round'},
      accepts: [
        {arg: "id", type: "string", required: true},
        {arg: "username", type: "string", required: true}
      ],
      returns: {arg: 'body', type: 'string', root: true}
    }
  )

}




/**
 * TODO:
 * - game neu erstellen (mit 3 rounds, schon befüllt mit gameQuestions) - jntme (done)
 * - abfragen, wer dass dran ist -> user, der dran ist & rounds - jntme
 * - gameQuestion beantworten -> richtig oder falsch - kybup
 * - cancel game - kybup
 */
