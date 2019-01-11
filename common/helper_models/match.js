// a match describes an ended game between two players on a player
class Match {

  // creates a new match with the opponents username and the result of the match (1 = won, 2 = lost, 0 = drawn)
  constructor(opponent, result) {
    this.opponent = opponent;
    this.endOfGame = Date.now();

    switch (result) {
      case 1:
        this.result = "won";
        break;
      case 2:
        this.result = "lost";
        break;
      case 0:
        this.result = "drawn";
        break;
    }
  }
}

module.exports = Match;
