module.exports = function(app) {
  app.dataSources.mongodb.automigrate('Question', function(err) {
    if (err) throw err;

    app.models.Question.create([{
      'question': 'Wieviel Beine hat Sascha?',
      'answers': [
        '2',
        '1',
        '3',
        '4',
      ],
    },
    {
      'question': 'Wieviel Arme hat Gabriel?',
      'answers': [
        '2',
        '1',
        '3',
        '4',
      ],
    },
    {
      'question': 'Wieviel Nasen hat Phippu?',
      'answers': [
        '2',
        '1',
        '3',
        '4',
      ],
    },
    {
      'question': 'Wie viele Ohren hat Jonny?',
      'answers': [
        '2',
        '1',
        '3',
        '4',
      ],
    },
    ], function(err, questions) {
      if (err) throw err;

      console.log('Models created: \n', questions);
    });
  });

  app.dataSources.mongodb.automigrate('P2GUser', function(err) {
    app.models.P2GUser.create([{
    "name": "gfels6",
        "birthyear": "2005",
        "totalscore": -5,
        "Games": [
          {}
        ],
        "mobility": 1,
        "gender": "male",
        "friends": "string",
        "steps": 1000,
        "walkerCoins": 1000,
      },
      {
        "name": "hessg5",
        "birthyear": "2007",
        "totalscore": -1,
        "Games": [
          {}
        ],
        "mobility": 2,
        "gender": "male",
        "friends": "string",
        "steps": 2000,
        "walkerCoins": 2000,
      },
      {
        "name": "kybup",
        "birthyear": "2001",
        "totalscore": 88,
        "Games": [
          {}
        ],
        "mobility": 5,
        "gender": "male",
        "friends": "string",
        "steps": 100000,
        "walkerCoins": 100000,
      }
    ],function(err, questions) {
          if (err) throw err;

          console.log('Models created: \n', questions);
    });
  });
};
