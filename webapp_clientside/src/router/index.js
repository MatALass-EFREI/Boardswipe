import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/Home.vue";
import Quiz from "../components/Quiz.vue";
import Games from "../components/Games.vue";


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home
    }
    ,
    {
      path:'/',
      redirect:'/home',
    },
    {
      path: '/quiz',
      name: 'Quiz',
      component: Quiz
    },
    {
      path : '/games',
      redirect : '/games/list/all',
    },
    {
      path: '/games/:action/:id',
      name: 'Games',
      component: Games
    }
  ]
})
