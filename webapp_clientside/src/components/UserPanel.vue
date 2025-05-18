<template>
  <div class="user-panel">
    <div v-if="isLoggedIn" class="user-info">
      <h1>User Panel</h1>
      <p><strong>Username:</strong> {{ username }}</p>
      <p><strong>Email:</strong> {{ email }}</p>
      <h1>Description</h1>
      <p>{{ userDescription }}</p>
      <button @click="changeDescription">Change Description</button>
      <div>
        <h2>Liked Games</h2>
        <div class="liked-games-list">
          <span
            v-for="(gameName, index) in likedGames"
            :key="index"
            class="game-block"
          >
            {{ gameName }}
          </span>
        </div>
      </div>
      <div>
        <h2>Disliked Games</h2>
        <div class="disliked-games-list">
          <span
            v-for="(gameName, index) in dislikedGames"
            :key="index"
            class="game-block"
          >
            {{ gameName }}
          </span>
        </div>
      </div>
      <button v-if="isAdmin" @click="goToAdmin">Admin</button>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      registrationDate: '',
      likedGames: [],
      dislikedGames: [],
      isLoggedIn: false,
      isAdmin: false,
      userDescription: [],
    };
  },
  methods: {
    async fetchUserProfile() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.isLoggedIn = false;
        return;
      }

      try {
        const payloadBase64 = token.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        const userId = decoded.id_user;
        this.isAdmin = decoded.role === 'admin'; // Check if the user is an admin

        const res = await fetch(`http://localhost:9000/user/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch user profile');

        const data = await res.json();
        this.username = data.userName;
        this.email = data.userEmail;
        this.registrationDate = data.registrationDate || 'N/A';
        this.gamesPlayed = data.gamesPlayed || 0;
        this.isLoggedIn = true;
        this.userDescription = data.userDescription || 'No description available';
      } catch (error) {
        console.error('Error fetching user profile:', error);
        this.isLoggedIn = false;
      }
    },
    async fetchUserSwipes() {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const payloadBase64 = token.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        const userId = decoded.id_user;

        const res = await fetch(`http://localhost:9000/user/swipe/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch user swipes');

        const data = await res.json();

        // Filter games based on the result field
        this.likedGames = data.filter(game => game.result === 1).map(game => game.gameName);
        this.dislikedGames = data.filter(game => game.result === 2).map(game => game.gameName);
      } catch (error) {
        console.error('Error fetching user swipes:', error);
      }
    },
    goToAdmin() {
      this.$router.push('/admin/users'); // Redirect to admin users page
    },
    changeDescription() {
      this.$router.push('/userpanel/description');
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
  },
  mounted() {
    this.fetchUserProfile();
    this.fetchUserSwipes();
  },
};
</script>

<style scoped>
.user-panel {
  font-family: Arial, sans-serif;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  margin-top: 20px;
}

.user-info {
  text-align: center;
  margin-top: 20px;
}

button {
  padding: 10px;
  background-color: #0077b6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #005f8a;
}

.liked-games-list,
.disliked-games-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.game-block {
  background: #e9ecef;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}
</style>
