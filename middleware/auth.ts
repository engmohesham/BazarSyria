export default defineNuxtRouteMiddleware(async (to) => {
  // Don't check on server-side to prevent initial redirect
  if (process.server) return;

  const token = localStorage.getItem("session-token");
  
  const protectedRoutes = [
    "/account/chat",
    "/account/verification",
    "/account/verification/:type/identity",
    "/account/settings",
    "/account/profile/my-ads",
    "/account/profile/following",
    "/account/profile/followers",
    "/account",
  ];

  // Only check on client-side
  if (protectedRoutes.includes(to.path) && !token) {
    localStorage.removeItem("session-token");
    window.dispatchEvent(new CustomEvent('invalid-token'));
    
    return navigateTo("/", {
      query: {
        showLogin: "true",
        redirect: to.fullPath,
      },
    });
  }
});
