<template>
  <div>
    <h1>Actual Description</h1>
    <p>{{ userDescription }}</p>
    <h1>Change Description</h1>
    <textarea v-model="userDescription" placeholder="Enter your new description"></textarea>
    <button @click="changeDescription">Change Description</button>
    <button @click="userpanel">Back to the User Panel</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userDescription:[],
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
        this.userDescription = data.userDescription || 'No description available';
      } catch (error) {
        console.error('Error fetching user profile:', error);
        this.isLoggedIn = false;
      }
    },
    async changeDescription(){
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("❌ Token is missing.");
        return;
      }

      try {
        const payloadBase64 = token.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        const userId = decoded.id_user;

        const res = await fetch(`http://localhost:9000/user/description/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ description: this.userDescription }),
        });

        if (!res.ok) throw new Error('Failed to update user description');

        console.log("✅ Description updated successfully");
      } catch (error) {
        console.error('Error updating user description:', error);
      }
    },
    userpanel() {
      this.$router.push('/userpanel');
    },
  },
  mounted() {
    this.fetchUserProfile();
  },
};
</script>

<style scoped>
/* General container styling */
div {
  font-family: Arial, sans-serif;
  padding: 20px;
  text-align: center;
}

/* Headings */
h1 {
  margin-bottom: 20px;
  color: #333;
}

/* Paragraph styling */
p {
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
}

/* Textarea styling */
textarea {
  width: 100%;
  max-width: 600px;
  height: 100px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Buttons */
button {
  padding: 10px 20px;
  background-color: #0077b6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin: 5px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #005f8a;
}

/* Responsive design */
@media (max-width: 768px) {
  textarea {
    width: 90%;
  }

  button {
    width: 90%;
    padding: 10px;
  }
}
</style>
