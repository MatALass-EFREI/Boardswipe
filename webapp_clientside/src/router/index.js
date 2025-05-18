import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/Home.vue";
import Quiz from "../components/Quiz.vue";
import Games from "../components/Games.vue";
import Blog from "../components/Blog.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Admin from "../components/Admin.vue";
import Swipe from "../components/Swipe.vue";
import UserPanel from "../components/UserPanel.vue";

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
    },
    {
      path: '/blog',
      redirect: '/blog/list/all',
    },
    {
      path: '/blog/:action/:id',
      name: 'Blog',
      component: Blog
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/admin',
      redirect: '/admin/panel',
    },
    {
      path: '/admin/:action',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/swipe',
      name: 'Swipe',
      component: Swipe,
    },
    {
      path: '/userpanel',
      name: 'UserPanel',
      component: UserPanel,
    },
    {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import("../components/Admin.vue")
    }
  ]
})
