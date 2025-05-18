<template>
  <div class="guild">
    <div v-if="!isLoggedIn">
      <p>Please <router-link to="/login">log in</router-link> to access guilds.</p>
    </div>
    <div v-else-if="!userGuild">
      <h1>Available Guilds</h1>
      <ul class="guild-list">
        <li v-for="guild in guilds" :key="guild.id_guild" class="guild-list-item">
          <span class="guild-name">{{ guild.guildName }}</span>
          <button
            :class="{
              'join-button': guild.isPublic,
              'request-button': !guild.isPublic,
              'disabled-button': requestedGuildId && requestedGuildId !== guild.id_guild
            }"
            :disabled="requestedGuildId && requestedGuildId !== guild.id_guild"
            @click="handleGuildClick(guild)"
          >
            {{ requestedGuildId === guild.id_guild ? 'Cancel Request' : guild.isPublic ? 'Join' : 'Request' }}
          </button>
        </li>
      </ul>
      <form @submit.prevent="createGuild" class="create-guild-form">
        <input v-model="newGuildName" placeholder="Guild Name" required class="guild-input" />
        <label>
          <input type="checkbox" v-model="isPublic" />
          Public Guild
        </label>
        <button type="submit" class="create-button">Create Guild</button>
      </form>
    </div>
    <div v-else>
      <h1>{{ userGuild.guildName }}</h1>
      <p>Your role: {{ userGuild.role }}</p>

      <!-- Display members -->
      <div>
        <h2>Members</h2>
        <ul>
          <li v-for="member in members" :key="member.id_user">
            {{ member.userName }} ({{ member.role }})
            <div v-if="userGuild.role === 'president'">
              <button v-if="member.role !== 'president'" @click="promoteMember(member.id_user)">Promote</button>
              <button v-if="member.role !== 'president'" @click="removeMember(member.id_user)">Remove</button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Display join requests -->
      <div v-if="userGuild.role === 'president'">
        <h2>Join Requests</h2>
        <ul>
          <li v-for="request in joinRequests" :key="request.id_user">
            {{ request.userName }}
            <button @click="acceptRequest(request.id_user)">Accept</button>
            <button @click="rejectRequest(request.id_user)">Reject</button>
          </li>
        </ul>
      </div>
      <!-- Chat Section -->
      <div class="chat">
        <h2>Guild Chat</h2>
        <div class="messages">
          <div v-for="message in messages" :key="message.id_chat" class="message">
            <strong>{{ message.userName }}:</strong> {{ message.message_text }}
            <span class="date">{{ new Date(message.message_date).toLocaleString() }}</span>
          </div>
        </div>
        <form @submit.prevent="sendMessage" class="chat-input">
          <input
            v-model="newMessage"
            placeholder="Type your message..."
            required
          />
          <button type="submit">Send</button>
        </form>
      </div>

      <!-- Leave guild button -->
      <div v-if="userGuild.role === 'member'">
        <button class="leave-button" @click="leaveGuild">Leave Guild</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isLoggedIn: !!localStorage.getItem('token'),
      userGuild: null,
      guilds: [],
      members: [],
      joinRequests: [],
      requestedGuildId: null,
      newGuildName: '',
      isPublic: true,
      messages: [], // Add messages array
      newMessage: '' // Add newMessage for chat input
    };
  },
  methods: {
    async fetchGuilds() {
      try {
        const response = await axios.get('http://localhost:9000/guild/all');
        this.guilds = response.data;
      } catch (error) {
        console.error('Error fetching guilds:', error);
      }
    },
    async fetchUserGuild() {
      try {
        const response = await axios.get('http://localhost:9000/guild/my', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.userGuild = response.data;
        if (this.userGuild) {
          this.fetchMembers();
          this.fetchMessages();
          if (this.userGuild.role === 'president') {
            this.fetchJoinRequests();
          }
        } else {
          this.fetchGuilds();
        }
      } catch (error) {
        console.error('Error fetching user guild:', error);
        this.fetchGuilds();
      }
    },
    async fetchMembers() {
      try {
        const response = await axios.get(`http://localhost:9000/guild/${this.userGuild.id_guild}/members`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        // Filter out "demandeur" role
        this.members = response.data.filter(member => member.role !== 'demandeur');
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    },
    async fetchMessages() {
      try {
        const response = await axios.get(`http://localhost:9000/guild/${this.userGuild.id_guild}/messages`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        // Sort messages by date (oldest first)
        this.messages = response.data.sort((a, b) => new Date(a.message_date) - new Date(b.message_date));
        this.$nextTick(() => {
          const messagesContainer = this.$el.querySelector('.messages');
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
          }
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },
    async sendMessage() {
      try {
        await axios.post(
          `http://localhost:9000/guild/${this.userGuild.id_guild}/messages`,
          { message_text: this.newMessage },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        this.newMessage = ''; // Clear the input field
        this.fetchMessages(); // Refresh messages
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    async fetchJoinRequests() {
      try {
        const response = await axios.get(`http://localhost:9000/guild/${this.userGuild.id_guild}/requests`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.joinRequests = response.data;
      } catch (error) {
        console.error('Error fetching join requests:', error);
      }
    },
    async promoteMember(userId) {
      try {
        await axios.post(`http://localhost:9000/guild/${this.userGuild.id_guild}/promote`, { userId }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.userGuild.role = 'member'; // Update the user's role locally
        this.fetchMembers(); // Refresh the members list
      } catch (error) {
        console.error('Error promoting member:', error);
      }
    },
    async removeMember(userId) {
      try {
        await axios.post(`http://localhost:9000/guild/${this.userGuild.id_guild}/remove`, { userId }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.fetchMembers();
      } catch (error) {
        console.error('Error removing member:', error);
      }
    },
    async acceptRequest(userId) {
      try {
        await axios.post(`http://localhost:9000/guild/${this.userGuild.id_guild}/accept`, { userId }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.fetchJoinRequests();
        this.fetchMembers();
      } catch (error) {
        console.error('Error accepting request:', error);
      }
    },
    async rejectRequest(userId) {
      try {
        await axios.post(`http://localhost:9000/guild/${this.userGuild.id_guild}/reject`, { userId }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.fetchJoinRequests();
      } catch (error) {
        console.error('Error rejecting request:', error);
      }
    },
    async handleGuildClick(guild) {
      if (this.requestedGuildId === guild.id_guild) {
        await axios.post(`http://localhost:9000/guild/${guild.id_guild}/leave`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.requestedGuildId = null;
      } else if (!guild.isPublic) {
        await axios.post(`http://localhost:9000/guild/${guild.id_guild}/join`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.requestedGuildId = guild.id_guild;
      } else {
        await axios.post(`http://localhost:9000/guild/${guild.id_guild}/join`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.fetchUserGuild();
      }
    },
    async createGuild() {
      await axios.post('http://localhost:9000/guild/create', {
        name: this.newGuildName,
        isPublic: this.isPublic
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      this.fetchGuilds();
    },
    async leaveGuild() {
      try {
        await axios.post(`http://localhost:9000/guild/${this.userGuild.id_guild}/leave`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.userGuild = null;
        this.fetchGuilds();
      } catch (error) {
        console.error('Error leaving guild:', error);
      }
    }
  },
  created() {
    if (this.isLoggedIn) {
      this.fetchUserGuild();
    } else {
      this.fetchGuilds();
    }
  }
};
</script>

<style scoped>
.guild-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.join-button {
  background-color: #4caf50;
  color: white;
}

.request-button {
  background-color: #ff9800;
  color: white;
}

.disabled-button {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

.leave-button {
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.leave-button:hover {
  background-color: #d32f2f;
}
.chat {
  margin-top: 20px;
}

.messages {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  background: #f9f9f9;
}

.message {
  margin-bottom: 10px;
}

.date {
  font-size: 0.8em;
  color: #888;
  margin-left: 10px;
}

.chat-input {
  display: flex;
  margin-top: 10px;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.chat-input button {
  margin-left: 10px;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
