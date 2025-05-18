<template>
  <div class="quiz-container">
    <div v-if="quizFinished" class="result" :class="{ win: score >= questions.length / 2, lose: score < questions.length / 2 }">
      <h2>Quiz terminé !</h2>
      <p>Score: {{ score }} / {{ questions.length }}</p>
      <button @click="restartQuiz">Rejouer</button>
    </div>
    <div v-else-if="firstGame" class="welcome">
      <h2>Bienvenue dans le Quiz !</h2>
      <p>{{ quizTitle }}</p>
      <p>Vous avez 10 secondes pour répondre à chaque question.</p>
      <p>Bonne chance !</p>
      <button @click="startQuiz">Commencer le Quiz</button>
    </div>
    <div v-else class="question-box" :class="{ fadeIn: transitionActive }">
      <h2 v-if="currentQuestion">{{ currentQuestion.text }}</h2>
      <p v-else>Chargement de la question...</p>
      <p>Temps restant: {{ timer }}s</p>
      <ul>
        <li
          v-for="(option, index) in (currentQuestion && currentQuestion.options) || []"
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
      quizId: 1, // Hardcoded for now, can be dynamic later
      quizTitle: "",
      questions: [],
      currentQuestionIndex: 0,
      selectedIndex: null,
      score: 0,
      isCorrect: false,
      quizFinished: false,
      firstGame: true,
      timer: 10,
      timerInterval: null,
      transitionActive: false,
      feedback: "",
      userId: 1, // Replace with the actual logged-in user ID
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || null;
    }
  },
  methods: {
    async fetchQuiz() {
      try {
        const response = await fetch(`http://localhost:9000/quiz/${this.quizId}`);
        if (!response.ok) throw new Error("Failed to fetch quiz data");
        const quiz = await response.json();

        this.quizTitle = quiz.quiz_title;
        this.questions = quiz.questions.map((q) => ({
          text: q.text,
          options: q.options,
          answer: q.answer,
          feedback: q.feedback
        }));
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    },
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
        this.isCorrect = this.currentQuestion && index === this.currentQuestion.answer;
        this.feedback = (this.currentQuestion && this.currentQuestion.feedback) || "";
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
          this.submitQuizResult(); // Submit the result when the quiz is finished
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
    },
    async submitQuizResult() {
      try {
        const timeTaken = this.questions.length * 10 - this.timer; // Calculate total time
        const token = localStorage.getItem("authToken"); // Retrieve the token

        if (!token) {
          console.error("User is not authenticated. Redirecting to login...");
          alert("You need to log in to submit your quiz result.");
          this.$router.push("/login"); // Redirect to login page (if using Vue Router)
          return;
        }

        const response = await fetch("http://localhost:9000/quiz/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Include the token
          },
          body: JSON.stringify({
            id_user: this.userId,
            id_quiz: this.quizId,
            score: this.score,
            time: timeTaken,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit quiz result");
        }

        const result = await response.json();
        console.log("Quiz result submitted successfully:", result);
      } catch (error) {
        console.error("Error submitting quiz result:", error);
      }
    },
  },
  async mounted() {
    await this.fetchQuiz();
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
