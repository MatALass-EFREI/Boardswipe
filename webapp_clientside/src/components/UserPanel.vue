<template>
  <div class="My account">
    <h1>My Account</h1>
    <div class="account-info">
      <h2>Account Information</h2>
      <p><strong>Username:</strong> {{ username }}</p>
      <p><strong>Email:</strong> {{ email }}</p>
      <p><strong>Registration Date:</strong> {{ registrationDate }}</p>
    </div>
    <div class="account-actions">
      <h2>Actions</h2>
      <button @click="goToEditProfile">Edit Profile</button>
      <button @click="goToChangePassword">Change Password</button>
      <button @click="goToDeleteAccount">Delete Account</button>
    </div>
    <div class="account-history">
      <h2>History</h2>
      <p><strong>Games Played:</strong> {{ gamesPlayed }}</p>
      <p><strong>Games Liked:</strong> {{ gamesLiked }}</p>
      <p><strong>Games Disliked:</strong> {{ gamesDisliked }}</p>
    </div>

  </div>
</template>

<script>
export default {
  name: 'UserPanel',
  data() {
    return {
      username: '',
      email: '',
      registrationDate: '',
      gamesPlayed: 0,
      gamesLiked: 0,
      gamesDisliked: 0
    };
  },
  getUserData(){
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    this.username = storedUser.username;
    this.email = storedUser.email;
    this.registrationDate = storedUser.registrationDate;
    this.gamesPlayed = storedUser.gamesPlayed;
    this.gamesLiked = storedUser.gamesLiked;
    this.gamesDisliked = storedUser.gamesDisliked;
  }
};

</script>

<style scoped>

</style>
