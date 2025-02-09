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

  // Check if the route requires authentication
  const protectedRoutes = [
    '/account/chat',
    '/account/verification',
    '/account/verification/:type/identity',
    '/account/settings',
    '/account/profile/my-ads',
    '/account/profile/following',
    '/account/profile/followers'
  ];

  if (protectedRoutes.includes(to.path)) {
    // If no token, redirect to home and show login modal
    if (!token) {
      return navigateTo('/', {
        query: { 
          showLogin: 'true',
          redirect: to.fullPath // Store the intended destination
        }
      })
    }
  }
});
