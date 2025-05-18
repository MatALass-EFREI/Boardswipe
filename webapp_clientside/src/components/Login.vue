<template>
  <div class="login-page">
    <h1 v-if="!isLoggedIn">Login</h1>

    <!-- Formulaire de login -->
    <form v-if="!isLoggedIn" @submit.prevent="login">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
    </form>

    <!-- Zone connectée -->
    <div v-else class="welcome">
      <h2>Bienvenue, {{ username }} ! 🎉</h2>
      <button @click="logout">Se déconnecter</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      isLoggedIn: false
    };
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
      const payload = this.decodeToken(token);
      if (payload && payload.username) {
        this.username = payload.username;
      }
    }
  },
  methods: {
    decodeToken(token) {
    try {
      const payloadBase64 = token.split('.')[1];
      const decoded = atob(payloadBase64);
      return JSON.parse(decoded);
    } catch (e) {
      return null;
    }
    },
    async login() {
      try {
        const res = await fetch('http://localhost:9000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Login failed');
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', payload.role);
        localStorage.setItem('username', payload.username);
        this.isLoggedIn = true;
        this.errorMessage = '';
        
        if (payload && payload.username) {
          this.username = payload.username;
        }
        alert('✅ Login successful');
        this.$router.push('/userpanel'); // Redirect to /userpanel after login
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.dispatchEvent(new Event('storage'));
      this.isLoggedIn = false;
      this.username = '';
      this.password = '';
    }
  }
};
</script>

<style scoped>
.login-page {
  font-family: Arial, sans-serif;
  padding: 20px;
}
h1 {
  text-align: center;
  margin-bottom: 20px;
}
.form-group {

  width: 15%;
  margin-bottom: 15px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 5%;
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
.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}
p {
  text-align: center;
}
router-link {
  color: #0077b6;
  text-decoration: none;
}
router-link:hover {
  text-decoration: underline;
}

</style>
