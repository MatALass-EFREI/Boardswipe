<template>
  <div class="games-page">
    <h1 v-if="isListView">Games List</h1>
    <h1 v-else>Game Details</h1>

    <div v-if="isListView">
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
        <div
          v-for="game in games"
          :key="game.id"
          class="game-card"
          @click="goToGameDetails(game.id)"
        >
          <h2>{{ game.name }}</h2>
          <p>Release Date: {{ game.releaseDate }}</p>
          <p>Rating: {{ game.rating }}</p>
        </div>
      </div>
      <div v-else>
        <p>No games found.</p>
      </div>
    </div>

    <div v-else-if="game">

      <div class="game-details">
        <h2>{{ game.name }}</h2>
        <button @click="goBack">Back to Games List</button>
        <p><strong>Description:</strong> {{ game.description }}</p>
        <p><strong>Release Date:</strong> {{ game.releaseDate }}</p>
        <p><strong>Rating:</strong> {{ game.rating }}</p>
        <p><strong>Min Players:</strong> {{ game.minPlayers }}</p>
        <p><strong>Max Players:</strong> {{ game.maxPlayers }}</p>
        <p><strong>Playing Time:</strong> {{ game.playingTime }} minutes</p>
      </div>
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
      game: null, // Holds the details of a single game
      sortBy: 'gameName', // Default sort column
      sortOrder: 'asc', // Default sort order
    };
  },
  computed: {
    isListView() {
      return this.$route.path === '/games/list/all';
    },
  },
  watch: {
    $route: 'fetchData', // Re-fetch data when the route changes
  },
  created() {
    this.fetchData(); // Fetch data when the component is created
  },
  methods: {
    async fetchData() {
      if (this.isListView) {
        await this.fetchGames();
      } else {
        const gameId = this.$route.params.id;
        await this.fetchGameDetails(gameId);
      }
    },
    async fetchGames() {
      const url = `http://localhost:9000/games/sort?column=${this.sortBy}&order=${this.sortOrder}`;
      try {
        const response = await axios.get(url);
        this.games = response.data;
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    },
    async fetchGameDetails(id) {
      const url = `http://localhost:9000/games/${id}`;
      try {
        const response = await axios.get(url);
        this.game = response.data;

        // Replace &#10;&#10; with line breaks in the description
        if (this.game.description) {
          this.game.description = this.game.description.replace(/&#10;&#10;/g, '\n');
        }
      } catch (error) {
        console.error('Error fetching game details:', error);
      }
    },
    goToGameDetails(id) {
      this.$router.push(`/games/desc/${id}`);
    },
    goBack() {
      this.$router.push('/games/list/all');
    },
  }
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
  cursor: pointer;
}

.game-details {
  font-family: Arial, sans-serif;
  padding: 20px;
}
</style>
