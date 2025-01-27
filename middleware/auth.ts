export default defineNuxtRouteMiddleware((to, from) => {
  const token = process.client 
    ? localStorage.getItem('session-token')
    : useCookie('session-token').value
  
  // Check if token exists and is valid
  const isAuthenticated = () => {
    return !!token
  }

  if (isAuthenticated() === false) {
    return navigateTo("/login");
  }
});
