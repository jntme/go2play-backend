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
    var promUser1 = P2guser.findOne({where: {'name': username}});
    var promUser2 = P2guser.findOne({where: {'name': friend}});
    var promQuestion = Question.find();

    Promise.all([promUser1, promUser2]).then(function (users) {
      const game = new app.models.Game();

      if (!users[0]) {
        var error = new Error("User not found.");
        error.statusCode = 404;
        return cb(error);
      }

      if (!users[1]) {
        var error = new Error("Friend not found.");
        error.statusCode = 404;
        return cb(error);
      }

      game.user1 = users[0].id;
      game.user2 = users[1].id;
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
    Game.findOne({where: {"id": id}}).then(function (game) {
      if (game.activeUser != username) {
        return cb(null, {"waiting": "waiting for other player"});
      } else {
        return cb(null, game.rounds[game.activeRound - 1]);
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

  //Checks and saves the answer of a user and continues to the next user or round
  Game.answer = function (id, username, roundNr, answers, cb) {
    //gets the game object from the db
    Game.findOne({where: {"id": id}})
      .then(function (game) {
        if (!game) {
          var error = new Error("Game not found.");
          error.statusCode = 404;
          return cb(error);
        }

        //checks if the questions are form the correct round and if the correct user is playing
        if (game.activeUser == 'game finished') {
          let err = new Error("Game already finished.");
          err.statusCode = 404;
          return cb(err);
        }
        else if (roundNr != game.activeRound || username != game.activeUser) {
          return cb(null, {"error": "Wrong user or round"})
        }
        //checks if there are only three answers
        else if (answers.length > 3) {
          return cb(null, {"error": "To many answers"})
        } else if (answers.length < 3) {
          return cb(null, {"error": "Not enough answers"})
        }
        //Saves the answers into the game object
        else {
          const questionCount = game.rounds[roundNr - 1].gameQuestions.length;

          //Writes the answers of a user itno each corresponding game question
          //The answer is saved in a property which is the username itself
          for (let i = 0; i < questionCount; i++) {
            const answer = answers[i];
            game.rounds[roundNr - 1].gameQuestions[i][username] = answer
          }

          //Calls a method which manipulates the activeUser or activeRound properties
          //depending on the current state of the game
          const isUser1 = username == game.user1;
          game = nextRound(game, isUser1);

          game.save();

          if (game.activeUser !== 'game finished') {
            return cb(null, game)
          }
          else {
            return cb(null, game)
          }

        }
      })
  };

  //checks four different cases in which a game can be in and manipulates the object accordingly
  let nextRound = function (game, isUser1) {
    const MAX_ROUNDS = 3; // if you change this number you need to change the following if/else-clause as well!

    // a game with three rounds proceeds in the following order:
    // user: gfels    friend: jntme (example)
    //
    // activeUser: jntme   activeRound: 1 (the friend begins)
    // activeUser: gfels   activeRound: 1
    // activeUser: gfels   activeRound: 2
    // activeUser: jntme   activeRound: 2
    // activeUser: jntme   activeRound: 3
    // activeUser: gfels   activeRound: 3

    if (!isUser1 && !(game.activeRound % 2) == 0) {
      game.activeUser = game.user1;
    } else if (isUser1 && !(game.activeRound % 2) == 0) {
      if (game.activeRound >= MAX_ROUNDS) {
        game.activeUser = 'game finished';
        game = gameFinished(game);
      } else {
        game.activeRound += 1;
      }
    } else if (isUser1 && (game.activeRound % 2) == 0) {
      game.activeUser = game.user2;
    } else if (!isUser1 && (game.activeRound % 2) == 0) {
      game.activeRound += 1;
    }

    return game;
  }

  //calculates the winner of the game and updates that users totalscore
  let gameFinished = function (game) {
    let app = Game.app;
    let P2guser = app.models.P2GUser;

    let scorePlayer1 = 0;
    let scorePlayer2 = 0;

    game.rounds.forEach(round => {
      round.gameQuestions.forEach(question => {
        if (question[question.user1] == 1) scorePlayer1++;
        if (question[question.user2] == 1) scorePlayer2++;
      });
    });

    console.log('scorePlayer1:', scorePlayer1);
    console.log('scorePlayer2:', scorePlayer2);

    let winningUsers = [];

    if (scorePlayer1 > scorePlayer2 || scorePlayer1 == scorePlayer2) {
      winningUsers.push(P2guser.findOne({where: {'name': game.user1}}));
      game.winner = game.user1;
      console.log("added user1 to winners");
    }
    if (scorePlayer2 > scorePlayer1 || scorePlayer1 == scorePlayer2) {
      winningUsers.push(P2guser.findOne({where: {'name': game.user2}}));
      game.winner = game.user2;
      console.log("added user2 to winners");
    }

    // if both won, overwrite with 'both'
    if(winningUsers.length == 2) game.winner = "both";

    Promise.all(winningUsers).then(users => {
      users.forEach(user => {
        console.log('found fucking user:', user);
        console.log("updated the total score for user " + user.name);

        user.totalscore++;
        user.save();
      });
    });

    return game;
  }

  Game.remoteMethod(
    'answer',
    {
      http: {path: '/:id/answer'},
      accepts: [
        {arg: "id", type: "string", required: true},
        {arg: "username", type: "string", required: true},
        {arg: "roundNr", type: "number", required: true},
        {arg: "answers", type: "array", required: true}
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
