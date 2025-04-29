<template>
  <div class="swipe">
    <div v-if="currentGame" class="game-card">
      <h2>{{ currentGame.name }}</h2>
      <p>{{ currentGame.description }}</p>
    </div>
    <div v-else class="no-more-games">
      <h2>Plus de jeux à afficher</h2>
    </div>
    <div class="actions" v-if="currentGame">
      <button class="dislike" @click="dislikeGame">💔</button>
      <button class="unknown" @click="unknownGame">❓</button>
      <button class="like" @click="likeGame">❤️</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      games: [
        { name: "Catan", description: "Un jeu de stratégie et de commerce." },
        { name: "Uno", description: "Un jeu de cartes amusant et rapide." },
        { name: "Monopoly", description: "Un classique des jeux de société." }
      ],
      currentIndex: 0,
      likedGames: [],
      dislikedGames: [],
      unknownGames: []
    };
  },
  computed: {
    currentGame() {
      return this.games[this.currentIndex] || null;
    }
  },
  methods: {
    likeGame() {
      this.likedGames.push(this.currentGame);
      this.nextGame();
    },
    dislikeGame() {
      this.dislikedGames.push(this.currentGame);
      this.nextGame();
    },
    unknownGame() {
      this.unknownGames.push(this.currentGame);
      this.nextGame();
    },
    nextGame() {
      this.currentIndex++;
    }
  }
};
</script>

<style scoped>
.swipe {
  text-align: center;
  padding: 20px;
}

.game-card {
  margin-bottom: 20px;
}

.game-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin: 10px 0;
}

.actions button {
  font-size: 2em;
  margin: 0 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
}

.actions button:hover {
  transform: scale(1.1);
}

.like {
  background-color: #ff6b6b;
  color: white;
}

.dislike {
  background-color: #4a4a4a;
  color: white;
}

.unknown {
  background-color: #feca57;
  color: white;
}

.no-more-games {
  font-size: 1.5em;
  color: #555;
}
</style>
