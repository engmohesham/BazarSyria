export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    // حفظ موقع السكرول فقط عند الانتقال من الصفحة الرئيسية إلى صفحة المنتج
    if (from.path === '/' && to.path.startsWith('/products/')) {
      const scrollPosition = window.scrollY;
      sessionStorage.setItem('lastScrollPosition', scrollPosition.toString());
    }
  }
}); 