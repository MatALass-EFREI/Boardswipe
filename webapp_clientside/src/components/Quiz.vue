<template>
  <div class="quiz-container">
    <div v-if="quizFinished" class="result" :class="{ win: score >= questions.length / 2, lose: score < questions.length / 2 }">
      <h2>Quiz terminé !</h2>
      <p>Score: {{ score }} / {{ questions.length }}</p>
      <button @click="restartQuiz">Rejouer</button>
    </div>
    <div v-else-if="firstGame" class="welcome">
      <h2>Bienvenue dans le Quiz !</h2>
      <p>Testez vos connaissances sur les jeux de société.</p>
      <p>Vous avez 10 secondes pour répondre à chaque question.</p>
      <p>Bonne chance !</p>
      <button @click="startQuiz">Commencer le Quiz</button>
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
        {
          text: "Comment gagne-t-on à Uno?",
          options: ["En accumulant le plus de cartes", "En se débarrassant de toutes ses cartes", "En obtenant 50 points", "En ayant une carte spéciale"],
          answer: 1,
          feedback: "Pour gagner à Uno, il faut être le premier à ne plus avoir de cartes."
        },
        {
          text: "Quelle est la condition de victoire aux échecs?",
          options: ["Capturer toutes les pièces de l'adversaire", "Mettre le roi adverse en échec et mat", "Atteindre l'autre côté de l'échiquier", "Jouer 20 coups sans capture"],
          answer: 1,
          feedback: "L'objectif aux échecs est de mettre le roi adverse en échec et mat."
        },
        {
          text: "Combien de wagons faut-il pour jouer à 'Les Aventuriers du Rail' ?",
          options: ["20", "35", "45", "60"],
          answer: 2,
          feedback: "Chaque joueur commence avec 45 wagons dans 'Les Aventuriers du Rail'."
        },
        {
          text: "Dans le jeu 'Catan', que faut-il pour construire une ville ?",
          options: ["2 blés, 3 pierres", "1 blé, 1 pierre, 2 moutons", "3 argiles, 2 bois", "4 moutons"],
          answer: 0,
          feedback: "Pour construire une ville dans 'Catan', vous avez besoin de 2 blés et 3 pierres."
        },
        {
          text: "Comment déclenche-t-on la fin d’une partie de Monopoly ?",
          options: ["Quand un joueur fait faillite", "Quand toutes les propriétés sont achetées", "Après 3 tours de plateau", "Quand une rue a un hôtel"],
          answer: 0,
          feedback: "Une partie de Monopoly se termine généralement lorsqu'un joueur fait faillite."
        }
      ],
      currentQuestionIndex: 0,
      selectedIndex: null,
      score: 0,
      isCorrect: false,
      quizFinished: false,
      firstGame: true,
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
          this.stopTimer();
        }
      }, 500);
    },
    startQuiz() {
      this.firstGame = false;
      this.quizFinished = false;
      this.currentQuestionIndex = 0;
      this.selectedIndex = null;
      this.score = 0;
      this.feedback = "";
      this.startTimer();
    },
    restartQuiz() {
      this.startQuiz();
    }
  },
  mounted() {
    // Timer starts only when the quiz begins
  },
  beforeDestroy() {
    this.stopTimer();
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
  padding: 20px;
}
</style>
