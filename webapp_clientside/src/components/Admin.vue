<template>
  <div class="admin">

    <div v-if="action === 'panel' " class="admin-panel">
      <h1>Admin Panel</h1>
      <div class="admin-section">
        <h2>Manage Users</h2>
        <p>Here you can manage users, view statistics, and perform administrative tasks.</p>
        <button @click="goToUserManagement">User Management</button>
        <button @click="goToStatistics">View Statistics</button>
        <button @click="goToSettings">Settings</button>
      </div>

      <div class="admin-section">
        <h2>Manage Games</h2>
        <p>Here you can manage games, view statistics, and perform administrative tasks.</p>
        <button @click="goToGameManagement">Game Management</button>
        <button @click="goToStatistics">View Statistics</button>
        <button @click="goToSettings">Settings</button>
      </div>

      <div class="admin-section">
        <h2>Manage Blog</h2>
        <p>Here you can manage blog posts, view statistics, and perform administrative tasks.</p>
        <button @click="goToBlogManagement">Blog Management</button>
        <button @click="goToStatistics">View Statistics</button>
        <button @click="goToSettings">Settings</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  methods: {
    goToUserManagement() {
      this.$router.push('/admin/user-management');
    },
    goToGameManagement() {
      this.$router.push('/admin/game-management');
    },
    goToBlogManagement() {
      this.$router.push('/admin/blog-management');
    },
    goToStatistics() {
      this.$router.push('/admin/statistics');
    },
    goToSettings() {
      this.$router.push('/admin/settings');
    },
  },
};
</script>

<style scoped>
.admin {
  font-family: Arial, sans-serif;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.admin-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  margin-bottom: 10px;
  color: #2c3e50;
}

p {
  margin-bottom: 15px;
  color: #555;
}

button {
  margin-right: 10px;
  padding: 10px 15px;
  background-color: #0077b6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #005f8a;
}

.admin-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.admin-panel h1 {
  font-size: 2.5em;
  color: #0077b6;
}
.admin-panel p {
  font-size: 1.2em;
  color: #333;
}
.admin-panel button {
  font-size: 1em;
  padding: 12px 24px; /* Slightly increased padding for better appearance */
  background-color: #0077b6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.admin-panel button:hover {
  background-color: #005f8a;
}
.admin-panel .admin-section {
  background: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
