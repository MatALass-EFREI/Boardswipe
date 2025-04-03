import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/Home.vue";
import Quiz from "../components/Quiz.vue";


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }
    ,
    {
      path: '/quiz',
      name: 'Quiz',
      component: Quiz
    }
  ]
})
