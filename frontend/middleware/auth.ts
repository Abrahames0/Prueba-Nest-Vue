import { jwtDecode } from 'jwt-decode';
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to) => {
  if (process.client) {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token) as { exp: number };

        if (decodedToken && decodedToken.exp) {
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken.exp > currentTime) {
            if (to.path === '/login' || to.path === '/register') {
              return navigateTo('/dashboard');
            }
          } else {
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    } else {
      if (to.path !== '/login' && to.path !== '/register') {
        return navigateTo('/login');
      }
    }
  }
});
