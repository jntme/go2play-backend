module.exports = function(app) {
  app.dataSources.mongodb.automigrate('Question', function(err) {
    if (err) throw err;

    /* --- question format --- */
    // {
    //   'question': '??',
    //   'answers': [
    //   'right',
    //   'wrong',
    //   'wrong',
    //   'wrong',
    // ],
    // },

    app.models.Question.create([{
      'question': 'Die Mauer in Berlin wird niedergerissen.',
      'answers': [
        '1989',
        '1970',
        '1992',
        '1988',
      ],
    },
    {
      'question': 'Japan attackiert Pearl Harbour.',
      'answers': [
        '1941',
        '1822',
        '1945',
        '1935',
      ],
    },
    {
      'question': 'Österreichs Thronfolger Franz Ferdinand wir in Sarajewo erschossen.',
      'answers': [
        '1914',
        '1800',
        '1910',
        '1916',
      ],
    },
    {
      'question': 'Der Sechstageskrieg im Nahen Osten tobt.',
      'answers': [
        '1967',
        '1955',
        '1970',
        '1945',
      ],
    },
      {
        'question': 'Indien wird selbständig.',
        'answers': [
          '1947',
          '1955',
          '1970',
          '1945',
        ],
      },
      {
        'question': 'Neil Armstrong geht am Mond spazieren.',
        'answers': [
          '1969',
          '1950',
          '1999',
          '1890',
        ],
      },
      {
        'question': 'Die Sowjetunion sendet den ersten künstlichen Satelliten, Sputnik, ins All.',
        'answers': [
          '1957',
          '1940',
          '1970',
          '1920',
        ],
      },
      {
        'question': 'Die ersten "Compact Discs" kommen auf den Markt.',
        'answers': [
          '1981',
          '1970',
          '1993',
          '1978',
        ],
      },
      {
        'question': 'Elvis Presleys erste Platte mit Heartbreak Hotel kommt heraus.',
        'answers': [
          '1956',
          '1940',
          '1960',
          '1982',
        ],
      },
      {
        'question': 'Die Olympischen Spiele finden in Atlanta (USA) statt.',
        'answers': [
          '1996',
          '1850',
          '1920',
          '2000',
        ],
      },
      {
        'question': 'Frankreich gewinnt die Fussballweltmeisterschaft auf eigenem Boden.',
        'answers': [
          '1998',
          '1990',
          '1885',
          '2005',
        ],
      },
      {
        'question': 'Die Titanic geht unter.',
        'answers': [
          '1912',
          '1920',
          '1901',
          '1889',
        ],
      },
      {
        'question': 'Karol Wojtyla, alias Johannes Paulus II wird der neue Papst.',
        'answers': [
          '1978',
          '1850',
          '2005',
          '1956',
        ],
      },
      {
        'question': 'Wie heisst der Götterberg der Griechen?',
        'answers': [
          'Olymp',
          'Zeus',
          'Meridas',
          'Akgülhöhe.',
        ],
      },
      {
        'question': 'Ein anderes Wort für Kältesteppe.',
        'answers': [
          'Tundra',
          'Fauna',
          'Kühlwiese',
          'Steinboden',
        ],
      },
      {
        'question': 'Was ist die Muttersprache von Albert Einstein?',
        'answers': [
          'Schweizerdeutsch',
          'Deutsch',
          'Englisch',
          'Französisch',
        ],
      },
      {
        'question': 'In welchem Land liegt Vancouver?',
        'answers': [
          'Kanada',
          'USA',
          'Russland',
          'Grönland',
        ],
      },
      {
        'question': 'Wie heisst die Griechische Göttermutter?',
        'answers': [
          'Hera',
          'Isis',
          'Xenia',
          'Mutter Theresa',
        ],
      },
      {
        'question': 'Wie heisst die chem. Formel für Salzsäure?',
        'answers': [
          'HCl',
          'SlS',
          'HuC',
          'SSÄ',
        ],
      },
      {
        'question': 'Auf welcher Insel-Gruppe liegt Pearl Harbor?',
        'answers': [
          'Hawaii',
          'Bahamas',
          'Australien',
          'Japan',
        ],
      },
      {
        'question': 'Wo fand die Olympiade im Jahr 2000 statt?',
        'answers': [
          'Australien',
          'Russland',
          'China',
          'Schweiz',
        ],
      },
      {
        'question': 'In welchem Jahr wurde die Eidgenossenschaft gegründet?',
        'answers': [
          '1291',
          '1382',
          '902',
          '1100',
        ],
      },
      {
        'question': 'Vor welchem Tieren fürchtete sich Napoleon?',
        'answers': [
          'Katzen',
          'Elephanten',
          'Mäuse',
          'Schlangen',
        ],
      },
      {
        'question': 'Wie nannte man Louis XIV?',
        'answers': [
          'Sonnenkönig',
          'Mondgott',
          'Universumslord',
          'Ländervogt',
        ],
      },
      {
        'question': 'Wer nahm Australien für die engl. Krone in Besitz?',
        'answers': [
          'James Cock',
          'Arnold Schwarzenegger',
          'Geoffrey Egary',
          'Lock Nirdau',
        ],
      },
      {
        'question': 'Welche Hochkultur lebte in den Anden?',
        'answers': [
          'Inkas',
          'Azteken',
          'Indianer',
          'Aborigines',
        ],
      },
      {
        'question': 'Wer erfand die erste wirklich brauchbare Dampfmaschine?',
        'answers': [
          'James Watt',
          'Goerge Volt',
          'Suzanne Ampére',
          'Peter Griffin',
        ],
      },
      {
        'question': 'Wie heisst die Hauptstadt von Pakistan?',
        'answers': [
          'Islamabad',
          'Lahore',
          'Karatschi',
          'Multan',
        ],
      },
      {
        'question': 'Welcher Zwergstaat befindet sich zwischen Frankreich und Spanien?',
        'answers': [
          'Andorra',
          'Fuerteventura',
          'Südafrika',
          'Morina',
        ],
      },
      {
        'question': 'Durch welche Stadt fliesst der Tiber?',
        'answers': [
          'Rom',
          'Zürich',
          'Alexandrien',
          'Rabat',
        ],
      },
    ], function(err, questions) {
      if (err) throw err;

      console.log('Models created: \n', questions);
    });
  });
};
