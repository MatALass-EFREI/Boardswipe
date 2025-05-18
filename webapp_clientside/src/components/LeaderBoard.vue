<template>
  <div class="leaderboard-container">
    <button @click="goToQuiz">Go Back to the Quiz</button>
    <h1>Leaderboard</h1>
    <p v-if="loading">Loading...</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <table v-if="!loading && !errorMessage">
      <thead>
      <tr>
        <th>Rank</th>
        <th>User ID</th>
        <th>Score</th>
        <th>Time</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(entry, index) in leaderboard" :key="index">
        <td>{{ entry.rank }}</td>
        <td>{{ entry.username }}</td>
        <td>{{ entry.score }}</td>
        <td>{{ entry.time }}s</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quizId: 1, // Hardcoded for now, can be dynamic later
      leaderboard: [], // Leaderboard data
      loading: true, // Loading state
      errorMessage: '', // Error message
    };
  },
  methods: {
    async fetchLeaderboard() {
      try {
        const response = await fetch(`http://localhost:9000/quiz/leaderboard`);
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        this.leaderboard = await response.json();
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.loading = false;
      }
    },
    goToQuiz() {
      this.$router.push(`/quiz`); // Navigate back to the quiz page
    },
  },
  async mounted() {
    await this.fetchLeaderboard();
  },
};
</script>

<style scoped>
.leaderboard-container {
  text-align: center;
  max-width: 800px;
  margin: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.error {
  color: red;
  margin-top: 20px;
}
</style>
