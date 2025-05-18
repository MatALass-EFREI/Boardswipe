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
import UserDescription from "../components/UserDescription.vue";
import LeaderBoard from "../components/LeaderBoard.vue";
import Guild from "../components/Guild.vue";

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/quiz',
      name: 'Quiz',
      component: Quiz
    },
    {
      path: '/games',
      redirect: '/games/list/all',
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
      component: Admin,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/swipe',
      name: 'Swipe',
      component: Swipe,
      meta: { requiresAuth: true }
    },
    {
      path: '/userpanel',
      name: 'UserPanel',
      component: UserPanel,
      meta: { requiresAuth: true }
    },
    {
      path:'/userpanel/description',
      name:'UserDescription',
      component: UserDescription,
      meta: { requiresAuth: true }
    },
    {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import("../components/Admin.vue")
    },
    {
      path:'/leaderboard/:id',
      name:'LeaderBoard',
      component: LeaderBoard,
    },
    {
      path: '/guild',
      name: 'Guild',
      component: Guild,
      meta: { requiresAuth: true }
    },
    {
      path: '/guild/all',
      redirect: '/guild'
    }
  ]
});

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    next('/login'); // Redirect to login if not logged in
  } else if (to.matched.some(record => record.meta.requiresAdmin)) {
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    if (payload && payload.role === 'admin') {
      next(); // Allow access for admin
    } else {
      next('/login'); // Redirect to login if not an admin
    }
  } else {
    next(); // Allow access
  }
});

export default router;
