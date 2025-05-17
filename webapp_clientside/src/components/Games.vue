<template>
  <div class="games-page">
    <h1 v-if="isListView">Games List</h1>
    <h1 v-else>Game Details</h1>

    <!-- Games List View -->
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

    <!-- Game Details View -->
    <div v-else-if="game">
      <div class="game-details">
        <div class="game-header">
          <button @click="goBack" class="back-button">← Back to Games List</button>
          <h2>{{ game.name }}</h2>
        </div>
        <div class="game-layout">
          <!-- Description Section -->
          <div class="game-description">
            <h3>Description</h3>
            <p>{{ game.description }}</p>
          </div>
          <!-- Details Section -->
          <div class="game-info">
            <h3>Details</h3>
            <p><strong>Release Date:</strong> {{ game.releaseDate }}</p>
            <p><strong>Rating:</strong> {{ game.rating }}</p>
            <p><strong>Min Players:</strong> {{ game.minPlayers }}</p>
            <p><strong>Max Players:</strong> {{ game.maxPlayers }}</p>
            <p><strong>Playing Time:</strong> {{ game.playingTime }} minutes</p>
            <p><strong>Minimum Age:</strong> {{ game.minAge }} years</p>
          </div>
        </div>
        <!-- Additional Details Section -->
        <div v-if="categories.length || publishers.length" class="additional-details">
          <h3>Additional Details</h3>
          <div v-if="publishers.length" class="publishers">
            <h4>Publishers:</h4>
            <div class="publishers-list">
              <span v-for="(publisher, index) in publishers" :key="index" class="publisher-block">
                {{ publisher }}
              </span>
            </div>
          </div>
          <div v-if="categories.length" class="categories">
            <h4>Categories:</h4>
            <div class="categories-list">
              <span v-for="(category, index) in categories" :key="index" class="category-block">
                {{ category }}
              </span>
            </div>
          </div>
        </div>
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
      categories: [], // Holds the categories of the current game
      publishers: [], // Holds the publishers of the current game
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

        // Replace special characters in the description
        if (this.game.description) {
          this.game.description = this.game.description.replace(/&#10;&#10;/g, '\n');
          this.game.description = this.game.description.replace(/&#10;/g, '');
          this.game.description = this.game.description.replace(/&#226;&#128;&#147;/g, ';');
        }
        // Set categories and publishers
        this.categories = this.game.categories ? this.game.categories.split(',') : [];
        this.publishers = this.game.publishers ? this.game.publishers.split(',') : [];
        console.log('Game details fetched:', this.game);
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
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.back-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #0056b3;
}

.game-layout {
  display: flex;
  gap: 20px;
}

.game-description {
  flex: 2;
}

.game-info {
  flex: 1;
}

.game-info p {
  margin: 10px 0;
}

.game-link {
  display: inline-block;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
}

.game-link:hover {
  text-decoration: underline;
}

.additional-details {
  margin-top: 30px;
}

.publishers-list, .categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.publisher-block, .category-block {
  background: #e9ecef;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}
</style>
