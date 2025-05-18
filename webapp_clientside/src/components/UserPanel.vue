<template>
  <div class="user-panel">
    <div v-if="!isLoggedIn">

    </div>

    <div v-else class="user-info">
      <h1>User Panel</h1>
      <p><strong>Username:</strong> {{ username }}</p>
      <p><strong>Email:</strong> {{ email }}</p>
      <p><strong>Games Played:</strong> {{ gamesPlayed }}</p>
      <p><strong>Games Liked:</strong> {{ gamesLiked }}</p>
      <p><strong>Games Disliked:</strong> {{ gamesDisliked }}</p>
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
      gamesPlayed: 0,
      gamesLiked: 0,
      gamesDisliked: 0,
      isLoggedIn: false,
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
        this.gamesLiked = data.gamesLiked || 0;
        this.gamesDisliked = data.gamesDisliked || 0;
        this.isLoggedIn = true;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        this.isLoggedIn = false;
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
  },
  mounted() {
    this.fetchUserProfile();
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
</style>
