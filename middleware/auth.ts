export default defineNuxtRouteMiddleware((to, from) => {
  const token = process.client ? localStorage.getItem('session-token') : null
  
  if (!token) {
    // If no token, redirect to home and show login modal
    if (to.path !== '/') {
      return navigateTo('/', {
        query: { 
          showLogin: 'true',
          redirect: to.fullPath // Store the intended destination
        }
      })
    }
  }
});
