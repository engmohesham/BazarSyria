export const useAuth = () => {
  const api = useApi()
  const isLoggedIn = ref(false)

  const checkAuthStatus = () => {
    const token = localStorage.getItem('session-token')
    isLoggedIn.value = !!token
    return isLoggedIn.value
  }

  const login = async (credentials) => {
    try {
      const { data, error } = await api.login(credentials)
      if (error.value) throw error.value
      
      if (data.value?.token) {
        localStorage.setItem('session-token', data.value.token)
        isLoggedIn.value = true
      }
      
      return { data: data.value, error: null }
    } catch (err) {
      console.error('Login error:', err)
      return { data: null, error: err }
    }
  }

  const logout = () => {
    localStorage.removeItem('session-token')
    isLoggedIn.value = false
  }

  return {
    isLoggedIn,
    login,
    logout,
    checkAuthStatus
  }
}