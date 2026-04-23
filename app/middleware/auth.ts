export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware on server-side - let client-side handle it
  if (import.meta.server) return

  const authStore = useAuthStore()

  // Restore session first before checking auth
  authStore.restoreSession()

  if (!authStore.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})
