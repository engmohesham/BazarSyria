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
    "/account/profile/:id",
    "/chat/:id",
    "/messages",
    "/notifications",
    "/favorites",
    "/settings",
    "/ads/create",
    "/ads/edit/:id"
  ];

  // التحقق من المسارات المتغيرة باستخدام regex
  const isProtectedRoute = protectedRoutes.some(route => {
    // تحويل المسار إلى نمط regex
    const pattern = route.replace(/:\w+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(to.path);
  });

  // Only check on client-side
  if (isProtectedRoute && !token) {
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
