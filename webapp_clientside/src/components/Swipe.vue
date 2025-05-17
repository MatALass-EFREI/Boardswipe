<template>
  <div class="swipe">
    <h1>Swipe Game</h1>
    <div v-if="game" class="game-card">
      <h2>{{ game.gameName }}</h2> <!-- Updated to use game.gameName -->
      <div class="actions">
        <button class="dislike" @click="handleSwipe(2)">👎 Je n'aime pas</button>
        <button class="unknown" @click="handleSwipe(0)">🤔 Je ne connais pas</button>
        <button class="like" @click="handleSwipe(1)">👍 J'aime</button>
      </div>
    </div>
    <div v-else>
      <p>Chargement...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      game: null,

    };
  },
  methods: {
    async fetchRandomGame() {
      try {
        const response = await axios.get('http://localhost:9000/swipe/random');
        console.log('Response from backend:', response.data); // Log the full response
        this.game = response.data[0]; // Access the first element of the array
        console.log('Game object in frontend:', this.game); // Log the game object
      } catch (error) {
        console.error('Error fetching random game:', error);
      }
    },
    async handleSwipe(result) {
       console.log("🟡 Envoi du swipe avec :", {
        id_game: this.game.id_game,
        result: result,
        token: localStorage.getItem('token')
      });
      try {
        await axios.post('http://localhost:9000/swipe/save', {
          id_game: this.game.id_game, // Ensure id_game is used correctly
          result
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        }
      );
        
        this.fetchRandomGame(); // Load a new game after the swipe
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du swipe:', error);
      }
    },
  },
  created() {
    this.fetchRandomGame();
  },
};
</script>

<style scoped>
.swipe {
  text-align: center;
  padding: 20px;
}

.game-card {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.actions {
  margin-top: 20px;
}

.actions button {
  font-size: 1.2em;
  margin: 0 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.actions button:hover {
  transform: scale(1.1);
}

.like {
  background-color: #4caf50;
  color: white;
}

.dislike {
  background-color: #f44336;
  color: white;
}

.unknown {
  background-color: #ff9800;
  color: white;
}
</style>
