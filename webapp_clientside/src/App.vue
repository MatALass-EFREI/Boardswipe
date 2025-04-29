<template>
  <div id="app">
    <nav class="nav-bar">
      <div class="container">
        <div class="nav-content">
          <router-link to="/" class="logo-container">
            <img src="../src/assets/logo.png" alt="Logo" class="logo" @click="$router.push('/')">
          </router-link>
          <router-link to="/" class="nav_bar_button">Home</router-link>
          <router-link to="/games/list/all" class="nav_bar_button games-button">Games</router-link>
          <router-link to="/swipe" class="nav_bar_button games-button">Swipe</router-link>
          <router-link to="/blog" class="nav_bar_button blog-button">Blog</router-link>
          <router-link to="/quiz" class="nav_bar_button">Quiz</router-link>
          <button class="cssbuttons-io-button account-button" @click="$router.push('/login')">Account
            <div class="icon">
              <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </nav>
    <router-view class="page-content"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

body {
  font-family: 'Montserrat', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #EEEFF2;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.nav-bar {
  background-color: rgba(51, 51, 51, 0.4);
  padding: 0px;
  position: relative;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  height: 85px;
}


.nav-bar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

}

.page-content {
  padding-top: 10%;
}
.nav-bar .nav_bar_button {
  color: #fff;
  text-decoration: none;
  margin: 0 20px;
  font-weight: bold;
  font-size: 1.2em;
  padding: 10px 20px;
  border-radius: 80px;
  border: #0077b6 solid 3px;
  transition: background-color 0.3s ease;
}

.nav-bar .nav_bar_button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.logo-container {
  position: absolute;
  left: 0;
  transform: translateX(-50%);
}

.logo {
  height: 60px;
  width: auto;
  max-width: 100%;
}

.account-button {
  background: #0077b6;
  color: white;
  font-family: inherit;
  padding: 0.35em;
  padding-left: 1.2em;
  font-size: 17px;
  font-weight: 500;
  border-radius: 0.9em;
  border: none;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  box-shadow: inset 0 0 1.6em -0.6em #0077b6;
  overflow: hidden;
  position: absolute;
  right: -5%;
  top: 22%;
  height: 2.8em;
  padding-right: 3.3em;
  cursor: pointer;
}

.cssbuttons-io-button .icon {
  background: white;
  margin-left: 1em;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.2em;
  width: 2.2em;
  border-radius: 0.7em;
  box-shadow: 0.1em 0.1em 0.6em 0.2em #0077;
  right: 0.3em;
  transition: all 0.3s;
}

.cssbuttons-io-button:hover .icon {
  width: calc(100% - 0.6em);
}

.cssbuttons-io-button .icon svg {
  width: 1.1em;
  transition: transform 0.3s;
  color: #0077;
}

.cssbuttons-io-button:hover .icon svg {
  transform: translateX(0.1em);
}

.cssbuttons-io-button:active .icon {
  transform: scale(0.95);
}

</style>
