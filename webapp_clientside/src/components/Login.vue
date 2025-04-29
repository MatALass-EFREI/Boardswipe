<template>
  <div class="login-page">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
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
  </div>

</template>

<script setup>
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
