<template>
  <div class="home">
    <div class="banner">
      <img src="@/assets/image.jpg" alt="Board Games" class="banner-image" />
      <div class="banner-text">
        <h1>{{ msg }}</h1>
        <p>Vous allez retrouver tous les jeux de société de vos rêves YOUHOUUUUUUUU</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Bienvenue dans notre application BoardSwipe !',
    }
  }
}
</script>

<style scoped>
.banner {
  position: relative;
  width: 100%;
  height: 1000px;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
}

h1 {
  font-weight: normal;
  margin-bottom: 10px;
}

p {
  font-size: 20px;
}
</style>
