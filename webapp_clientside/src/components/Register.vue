<template>
  <div class="register-page">
    <h1>Register</h1>
    <div class="form-group">
      <input v-model="username" placeholder="Username" />
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="register">Register</button>
      <button @click="login">Back to login</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      password: ''
    };
  },
  methods: {
    async register() {
      try {
        const res = await fetch('http://localhost:9000/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password
          })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Registration failed');

        alert('✅ ' + data.message);
      } catch (error) {
        alert('❌ ' + error.message);
      }
    },
    login() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.register-page {
  font-family: Arial, sans-serif;
  padding: 20px;
}
h1 {
  text-align: center;
  margin-bottom: 20px;
}
.form-group {
  width: 30%;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
.error {
  color: red;
  text-align: center;
}
</style>
