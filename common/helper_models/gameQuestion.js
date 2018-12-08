class GameQuestion {

  //question (string); answers (array of strings), user1 (string, user2 (string)
  constructor(question, answers, user1, user2) {
    this.question = question;
    this.answers = answers;
    this.user1 = user1;
    this.user2 = user2;
  }

  setAnswerUser1(userName) {
    this.answerUser1 = userName;
  }

  setAnswerUser1(userName) {
    this.answerUser2 = userName;
  }
}

module.exports = GameQuestion;
