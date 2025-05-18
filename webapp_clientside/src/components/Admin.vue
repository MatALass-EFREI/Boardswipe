<template>
  <div>
    <h2>Liste des utilisateurs</h2>
    <ul>
      <li v-for="user in users" :key="user.id_user">
        {{ user.userName }} – {{ user.userEmail }} – {{ user.role }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: []
    };
  },
  async mounted() {
    try {
      const res = await fetch('http://localhost:9000/admin/users', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
      this.users = await res.json();
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
    }
  }
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
