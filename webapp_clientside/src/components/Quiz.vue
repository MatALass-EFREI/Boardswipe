<template>
  <div class="quiz-container">
    <div v-if="quizFinished" class="result" :class="{ win: score >= questions.length / 2, lose: score < questions.length / 2 }">
      <h2>Quiz terminé !</h2>
      <p>Score: {{ score }} / {{ questions.length }}</p>
      <button @click="restartQuiz">Rejouer</button>
    </div>
    <div v-else class="question-box" :class="{ fadeIn: transitionActive }">
      <h2>{{ currentQuestion.text }}</h2>
      <p>Temps restant: {{ timer }}s</p>
      <ul>
        <li
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          :class="{ correct: selectedIndex === index && isCorrect, incorrect: selectedIndex === index && !isCorrect }"
          @click="selectAnswer(index)">
          {{ option }}
        </li>
      </ul>
      <p v-if="feedback">{{ feedback }}</p>
      <button v-if="selectedIndex !== null" @click="nextQuestion">Suivant</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [
        { text: "Comment gagne-t-on à Uno?", options: ["En accumulant le plus de cartes", "En se débarrassant de toutes ses cartes", "En obtenant 50 points", "En ayant une carte spéciale"], answer: 1, feedback: "Pour gagner à Uno, il faut être le premier à ne plus avoir de cartes." },
        { text: "Quelle est la condition de victoire aux échecs?", options: ["Capturer toutes les pièces de l'adversaire", "Mettre le roi adverse en échec et mat", "Atteindre l'autre côté de l'échiquier", "Jouer 20 coups sans capture"], answer: 1, feedback: "L'objectif aux échecs est de mettre le roi adverse en échec et mat." },
        { text: "Combien de wagons faut-il pour jouer à 'Les Aventuriers du Rail' ?", options: ["20", "35", "45", "60"], answer: 2, feedback: "Chaque joueur commence avec 45 wagons dans 'Les Aventuriers du Rail'." },
        { text: "Dans le jeu 'Catan', que faut-il pour construire une ville ?", options: ["2 blés, 3 pierres", "1 blé, 1 pierre, 2 moutons", "3 argiles, 2 bois", "4 moutons"], answer: 0, feedback: "Pour construire une ville dans 'Catan', vous avez besoin de 2 blés et 3 pierres." },
        { text: "Comment déclenche-t-on la fin d’une partie de Monopoly ?", options: ["Quand un joueur fait faillite", "Quand toutes les propriétés sont achetées", "Après 3 tours de plateau", "Quand une rue a un hôtel"], answer: 0, feedback: "Une partie de Monopoly se termine généralement lorsqu'un joueur fait faillite." },
        { text: "Quel est l’objectif du jeu 'Dixit' ?", options: ["Être le premier à 100 points", "Faire deviner des images aux autres joueurs", "Avoir le plus de cartes à la fin", "Être le dernier joueur en jeu"], answer: 1, feedback: "Dans 'Dixit', l’objectif est de faire deviner votre image en donnant un indice subtil." },
        { text: "Quel jeu consiste à faire des combinaisons de mots avec des lettres tirées au hasard ?", options: ["Scrabble", "Cluedo", "Jungle Speed", "Carcassonne"], answer: 0, feedback: "Le 'Scrabble' est un jeu où les joueurs doivent former des mots avec des lettres piochées." },
        { text: "Dans le jeu '7 Wonders', combien de cartes doit-on choisir par tour ?", options: ["1", "2", "3", "4"], answer: 0, feedback: "Dans '7 Wonders', chaque joueur sélectionne une carte par tour avant de passer le reste." },
        { text: "Quel est le but du jeu 'Codenames' ?", options: ["Être le premier à trouver tous ses mots", "Accumuler le plus de points", "Éliminer l’équipe adverse", "Trouver un mot caché par déduction"], answer: 0, feedback: "Dans 'Codenames', les équipes doivent deviner tous leurs mots en premier." },
        { text: "Combien de couleurs de pièces existe-t-il dans 'Tetris' ?", options: ["5", "6", "7", "8"], answer: 2, feedback: "Il y a 7 formes et couleurs différentes de pièces dans 'Tetris'." }
      ],
      currentQuestionIndex: 0,
      selectedIndex: null,
      score: 0,
      isCorrect: false,
      quizFinished: false,
      timer: 10,
      timerInterval: null,
      transitionActive: false,
      feedback: ""
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    }
  },
  methods: {
    startTimer() {
      this.timer = 10;
      this.timerInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          this.selectAnswer(null);
          this.nextQuestion();
        }
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timerInterval);
    },
    selectAnswer(index) {
      if (this.selectedIndex === null) {
        this.selectedIndex = index;
        this.isCorrect = index === this.currentQuestion.answer;
        this.feedback = this.currentQuestion.feedback;
        if (this.isCorrect) this.score++;
        this.stopTimer();
        this.playSound(this.isCorrect ? 'win' : 'lose');
      }
    },
    nextQuestion() {
      this.transitionActive = true;
      setTimeout(() => {
        this.transitionActive = false;
        if (this.currentQuestionIndex < this.questions.length - 1) {
          this.currentQuestionIndex++;
          this.selectedIndex = null;
          this.feedback = "";
          this.startTimer();
        } else {
          this.quizFinished = true;
        }
      }, 500);
    },
    restartQuiz() {
      this.currentQuestionIndex = 0;
      this.selectedIndex = null;
      this.score = 0;
      this.quizFinished = false;
      this.feedback = "";
      this.startTimer();
    },
    playSound(type) {
      let audio = new Audio(type === 'win' ? 'win-sound.mp3' : 'lose-sound.mp3');
      audio.play();
    }
  },
  mounted() {
    this.startTimer();
  }
};
</script>

<style scoped>
.quiz-container {
  text-align: center;
  max-width: 600px;
  margin: auto;
}
.question-box h2 {
  font-size: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  background: lightgray;
  padding: 10px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s ease;
}
li:hover {
  background: darkgray;
}
.correct {
  background: lightgreen !important;
}
.incorrect {
  background: lightcoral !important;
}
button {
  margin-top: 20px;
  padding: 10px;
  background: blue;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
}
button:hover {
  background: darkblue;
}
.result {
  animation: fadeIn 1s ease-in-out;
  padding: 20px;
}
.win {
  animation: winAnimation 2s ease-in-out infinite alternate;
  background: lightgreen;
}
.lose {
  animation: loseAnimation 2s ease-in-out infinite alternate;
  background: lightcoral;
}
.fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes winAnimation {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}
@keyframes loseAnimation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(5deg); }
}
</style>
