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
    ], function(err, questions) {
      if (err) throw err;

      console.log('Models created: \n', questions);
    });
  });
};
