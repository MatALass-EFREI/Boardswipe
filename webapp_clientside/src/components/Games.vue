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
export default {
  name: 'Games',
  data() {
    return {
      games: [
        { id: 1, name: 'Game A', releaseDate: '2022-01-01', rating: 4.5 },
        { id: 2, name: 'Game B', releaseDate: '2021-05-15', rating: 3.8 },
        { id: 3, name: 'Game C', releaseDate: '2023-03-10', rating: 4.9 },
        { id: 4, name: 'Game D', releaseDate: '2020-07-20', rating: 4.2 },
        { id: 5, name: 'Game E', releaseDate: '2019-11-11', rating: 3.5 },
        { id: 6, name: 'Game F', releaseDate: '2021-03-25', rating: 4.7 },
        { id: 7, name: 'Game G', releaseDate: '2022-09-15', rating: 4.0 },
        { id: 8, name: 'Game H', releaseDate: '2020-01-30', rating: 3.9 },
        { id: 9, name: 'Game I', releaseDate: '2023-06-05', rating: 4.8 },
      ],
      sortBy: 'name',
      sortOrder: 'asc',
    };
  },
  computed: {
    sortedGames() {
      return [...this.games].sort((a, b) => {
        let modifier = this.sortOrder === 'asc' ? 1 : -1;
        if (this.sortBy === 'name') {
          return a.name.localeCompare(b.name) * modifier;
        } else if (this.sortBy === 'releaseDate') {
          return (new Date(a.releaseDate) - new Date(b.releaseDate)) * modifier;
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
