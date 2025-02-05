import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '~/utils/config'

export const useServices = () => {
  // State
  const isLoggedIn = ref(false)

  // Auth Methods
  const checkAuthStatus = () => {
    const token = localStorage.getItem('session-token')
    isLoggedIn.value = !!token
    return isLoggedIn.value
  }

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const { data, error } = await useFetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        body: credentials,
        headers: {
          'Content-Type': 'application/json'
        }
      })

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

  const register = async (userData: any) => {
    try {
      const { data, error } = await useFetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        body: userData,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (error.value) throw error.value
      return { data: data.value, error: null }
    } catch (err) {
      console.error('Register error:', err)
      return { data: null, error: err }
    }
  }

  const logout = () => {
    localStorage.removeItem('session-token')
    isLoggedIn.value = false
  }

  // User Methods
  const getProfile = async () => {
    try {
      const { data, error } = await useFetch(`${API_BASE_URL}${API_ENDPOINTS.PROFILE}`, {
        headers: getAuthHeaders()
      })

      if (error.value) throw error.value
      return { data: data.value, error: null }
    } catch (err) {
      console.error('Error fetching profile:', err)
      return { data: null, error: err }
    }
  }

  const getFollowers = async () => {
    try {
      const { data, error } = await useFetch(`${API_BASE_URL}${API_ENDPOINTS.FOLLOWERS}`, {
        headers: getAuthHeaders()
      })

      if (error.value) throw error.value
      return { data: data.value, error: null }
    } catch (err) {
      console.error('Error fetching followers:', err)
      return { data: null, error: err }
    }
  }

  const getFollowing = async () => {
    try {
      const { data, error } = await useFetch(`${API_BASE_URL}${API_ENDPOINTS.FOLLOWING}`, {
        headers: getAuthHeaders()
      })

      if (error.value) throw error.value
      return { data: data.value, error: null }
    } catch (err) {
      console.error('Error fetching following:', err)
      return { data: null, error: err }
    }
  }

  const followUser = async (userId: string) => {
    try {
      const { error } = await useFetch(`${API_BASE_URL}${API_ENDPOINTS.FOLLOW}/${userId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      })

      if (error.value) throw error.value
      return { error: null }
    } catch (err) {
      console.error('Error following user:', err)
      return { error: err }
    }
  }

  const unfollowUser = async (userId: string) => {
    try {
      const { error } = await useFetch(`${API_BASE_URL}${API_ENDPOINTS.UNFOLLOW}/${userId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      })

      if (error.value) throw error.value
      return { error: null }
    } catch (err) {
      console.error('Error unfollowing user:', err)
      return { error: err }
    }
  }

  // Advertisement Methods
  const fetchUserAds = async () => {
    try {
      const { data, error } = await useFetch(`${API_BASE_URL}${API_ENDPOINTS.USER_ADS}`, {
        headers: getAuthHeaders()
      })

      if (error.value) throw error.value
      return { data: data.value?.ads || [], error: null }
    } catch (err) {
      console.error('Error fetching user ads:', err)
      return { data: [], error: err }
    }
  }

  const getProducts = async () => {
    try {
      const { data, error } = await useFetch(`${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}`, {
        headers: getAuthHeaders()
      })

      if (error.value) throw error.value
      return { data: data.value?.products || [], error: null }
    } catch (err) {
      console.error('Error fetching products:', err)
      return { data: [], error: err }
    }
  }

  const createAd = async (adData: any) => {
    try {
      const { data, error } = await useFetch(`${API_BASE_URL}${API_ENDPOINTS.ADS}`, {
        method: 'POST',
        body: adData,
        headers: getAuthHeaders()
      })

      if (error.value) throw error.value
      return { data: data.value, error: null }
    } catch (err) {
      console.error('Error creating ad:', err)
      return { data: null, error: err }
    }
  }

  const updateAd = async (adId: string, adData: any) => {
    try {
      const { data, error } = await useFetch(`${API_BASE_URL}${API_ENDPOINTS.ADS}/${adId}`, {
        method: 'PUT',
        body: adData,
        headers: getAuthHeaders()
      })

      if (error.value) throw error.value
      return { data: data.value, error: null }
    } catch (err) {
      console.error('Error updating ad:', err)
      return { data: null, error: err }
    }
  }

  const deleteAd = async (adId: string) => {
    try {
      const { error } = await useFetch(`${API_BASE_URL}${API_ENDPOINTS.ADS}/${adId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (error.value) throw error.value
      return { error: null }
    } catch (err) {
      console.error('Error deleting ad:', err)
      return { error: err }
    }
  }

  const toggleAdStatus = async (adId: string) => {
    try {
      const { error } = await useFetch(`${API_BASE_URL}${API_ENDPOINTS.TOGGLE_AD}/${adId}`, {
        method: 'PUT',
        headers: getAuthHeaders()
      })

      if (error.value) throw error.value
      return { error: null }
    } catch (err) {
      console.error('Error toggling ad status:', err)
      return { error: err }
    }
  }

  return {
    // State
    isLoggedIn,
    
    // Auth Methods
    login,
    register,
    logout,
    checkAuthStatus,
    
    // User Methods
    getProfile,
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
    
    // Advertisement Methods
    fetchUserAds,
    createAd,
    updateAd,
    deleteAd,
    toggleAdStatus,
    getProducts
  }
} 