import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomePage.vue';
import Register from '../views/RegisterPage.vue';
import AdminLogin from '../views/AdminLogin.vue';
import AdminPanel from '../views/AdminPanel.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/admin/login',
      name: 'adminLogin',
      component: AdminLogin
    },
    {
      path: '/admin/panel',
      name: 'adminPanel',
      component: AdminPanel,
      meta: { requiresAuth: true }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('adminToken');
  
  if (to.meta.requiresAuth && !token) {
    next('/admin/login');
  } else {
    next();
  }
});

export default router;