<template>
  <div class="games-page">
    <h1>Games List</h1>
    <div class="sort-options">
      <label for="sortBy">Sort by:</label>
      <select v-model="sortBy" id="sortBy" @change="fetchGames">
        <option value="gameName">Name</option>
        <option value="gameYearPublished">Release Date</option>
        <option value="avgRating">Rating</option>
      </select>

      <label for="sortOrder">Order:</label>
      <select v-model="sortOrder" id="sortOrder" @change="fetchGames">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <div v-if="games.length > 0" class="games-grid">
      <div v-for="game in games" :key="game.id" class="game-card">
        <h2>{{ game.name }}</h2>
        <p>Release Date: {{ game.releaseDate }}</p>
        <p>Rating: {{ game.rating }}</p>
      </div>
    </div>
    <div v-else>
      <p>No games found.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Games',
  data() {
    return {
      games: [], // Holds the list of games
      sortBy: 'gameName', // Default sort column
      sortOrder: 'asc', // Default sort order
    };
  },
  created() {
    this.fetchGames(); // Fetch games when the component is created
  },
  methods: {
    async fetchGames() {
      const url = `http://localhost:9000/games/sort?column=${this.sortBy}&order=${this.sortOrder}`;
      console.log('Fetching games from:', url);
      try {
        const response = await axios.get(url);
        console.log('Games received:', response.data);
        this.games = response.data; // Assign the fetched games to the data property
        console.log('Games assigned to this.games:', this.games);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
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
}
</style>
