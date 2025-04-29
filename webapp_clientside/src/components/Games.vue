<template>
  <div class="games-page">
    <h1 v-if="!isDetailsView">Games List</h1>
    <h1 v-else>Game Details</h1>

    <div v-if="!isDetailsView">
      <div class="sort-options">
        <label for="sortBy">Sort by:</label>
        <select v-model="sortBy" id="sortBy">
          <option value="name">Name</option>
          <option value="releaseDate">Release Date</option>
          <option value="rating">Rating</option>
        </select>

        <label for="sortOrder">Order:</label>
        <select v-model="sortOrder" id="sortOrder">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div class="games-grid">
        <div
          v-for="game in sortedGames"
          :key="game.id"
          class="game-card"
          @click="goToDetails(game.id)"
        >
          <h2>{{ game.name }}</h2>
          <p>Release Date: {{ game.releaseDate }}</p>
          <p>Rating: {{ game.rating }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="selectedGame">
      <h2>{{ selectedGame.name }}</h2>
      <p><strong>Release Date:</strong> {{ selectedGame.releaseDate }}</p>
      <p><strong>Rating:</strong> {{ selectedGame.rating }}</p>
      <p><strong>Description:</strong> This is a detailed description of the game.</p>
      <button @click="goBack">Back to Games List</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Games',
  data() {
    return {
      games: [],
      sortBy: 'name',
      sortOrder: 'asc',
    };
  },
  created() {
    axios.get('http://localhost:3000/games')
      .then(response => {
        this.games = response.data.map(game => ({
          ...game,
          rating: Math.floor(Math.random() * 3) + 3 + Math.random().toFixed(1) // simule une note (car elle n'existe pas dans ta table)
        }));
      })
      .catch(error => {
        console.error('Error fetching games:', error);
      });
  },
  computed: {
    sortedGames() {
      return [...this.games].sort((a, b) => {
        let modifier = this.sortOrder === 'asc' ? 1 : -1;
        if (this.sortBy === 'name') {
          return a.name.localeCompare(b.name) * modifier;
        } else if (this.sortBy === 'releaseDate') {
          return (a.releaseDate - b.releaseDate) * modifier;
        } else if (this.sortBy === 'rating') {
          return (a.rating - b.rating) * modifier;
        }
      });
    },
    isDetailsView() {
      return this.$route.params.action === 'details';
    },
    selectedGame() {
      const gameId = parseInt(this.$route.params.id, 10);
      return this.games.find((game) => game.id === gameId);
    },
  },
  methods: {
    goToDetails(id) {
      this.$router.push(`/games/details/${id}`);
    },
    goBack() {
      this.$router.push('/games/list/all');
    },
  },
};

</script>

<style scoped>
.games-page {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.sort-options {
  margin-bottom: 20px;
}

.sort-options label {
  margin-right: 10px;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.game-card {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.game-card:hover {
  transform: scale(1.05);
}

.game-card h2 {
  margin: 0 0 10px;
}

.game-card p {
  margin: 5px 0;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #0077b6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #005f8a;
}
</style>
