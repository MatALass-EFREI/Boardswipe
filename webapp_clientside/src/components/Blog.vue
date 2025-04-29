<template>
  <div class="blog">
    <h1 class="blog-title">Bienvenue sur le Blog</h1>
    <div v-if="action === 'list' && id === 'all'" class="blog-posts">
      <div v-for="post in posts" :key="post.id" class="blog-post" @click="goToPost(post.id)">
        <h2 class="post-title">{{ post.title }}</h2>
        <p class="post-content">{{ post.content }}</p>
      </div>
    </div>
    <div v-else-if="action === 'post'" class="blog-post-detail">
      <button @click="goBack">Back to Games List</button>
      <h2>{{ currentPost ? currentPost.title : 'Article introuvable' }}</h2>
      <p>{{ currentPost ? currentPost.content : 'Le contenu de cet article est introuvable.' }}</p>
    </div>
    <div v-else>
      <p>Action ou ID invalide.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Blog',
  data() {
    return {
      posts: [
        { id: 1, title: 'Article 1', content: 'Contenu de l\'article 1.' },
        { id: 2, title: 'Article 2', content: 'Contenu de l\'article 2.' },
        { id: 3, title: 'Article 3', content: 'Contenu de l\'article 3.' },
      ],
      action: null,
      id: null,
      currentPost: null,
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.updateRouteParams();
      },
    },
  },
  methods: {
    updateRouteParams() {
      this.action = this.$route.params.action;
      this.id = this.$route.params.id;
      if (this.action === 'post') {
        this.currentPost = this.posts.find((post) => post.id === parseInt(this.id)) || null;
      } else {
        this.currentPost = null;
      }
    },
    goToPost(id) {
      this.$router.push(`/blog/post/${id}`);
    },
    goBack() {
        this.$router.push('/blog/list/all');
    },
  },
};
</script>

<style scoped>
.blog {
  padding: 20px;
  font-family: 'Montserrat', sans-serif;
}

.blog-title {
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #2c3e50;
}

.blog-posts {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.blog-post {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.post-title {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #0077b6;
}

.post-content {
  font-size: 1em;
  color: #333;
}

.blog-post-detail {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
button {
  margin-top: 20px;
  padding: 10px 20px;
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
