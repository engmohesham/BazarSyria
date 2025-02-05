import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '~/utils/config'

export const useApi = () => {
  // Auth APIs
  const login = async (credentials: { email: string; password: string }) => {
    return await useFetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      body: credentials,
      headers: getAuthHeaders()
    })
  }

  const register = async (userData: any) => {
    return await useFetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
      method: 'POST',
      body: userData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  // User APIs
  const getProfile = async () => {
    return await useFetch(`${API_BASE_URL}${API_ENDPOINTS.PROFILE}`, {
      headers: getAuthHeaders()
    })
  }

  const getFollowers = async () => {
    return await useFetch(`${API_BASE_URL}${API_ENDPOINTS.FOLLOWERS}`, {
      headers: getAuthHeaders()
    })
  }

  const getFollowing = async () => {
    return await useFetch(`${API_BASE_URL}${API_ENDPOINTS.FOLLOWING}`, {
      headers: getAuthHeaders()
    })
  }

  const followUser = async (userId: string) => {
    return await useFetch(`${API_BASE_URL}${API_ENDPOINTS.FOLLOW}/${userId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
  }

  const unfollowUser = async (userId: string) => {
    return await useFetch(`${API_BASE_URL}${API_ENDPOINTS.UNFOLLOW}/${userId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
  }

  // Advertisement APIs
  const fetchUserAds = async () => {
    return await useFetch(`${API_BASE_URL}${API_ENDPOINTS.USER_ADS}`, {
      headers: getAuthHeaders()
    })
  }

  const deleteAd = async (adId: string) => {
    return await useFetch(`${API_BASE_URL}${API_ENDPOINTS.ADS}/${adId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
  }

  const toggleAdStatus = async (adId: string) => {
    return await useFetch(`${API_BASE_URL}${API_ENDPOINTS.TOGGLE_AD}/${adId}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    })
  }

  const createAd = async (adData: any) => {
    return await useFetch(`${API_BASE_URL}${API_ENDPOINTS.ADS}`, {
      method: 'POST',
      body: adData,
      headers: getAuthHeaders()
    })
  }

  const updateAd = async (adId: string, adData: any) => {
    return await useFetch(`${API_BASE_URL}${API_ENDPOINTS.ADS}/${adId}`, {
      method: 'PUT',
      body: adData,
      headers: getAuthHeaders()
    })
  }

  return {
    // Auth
    login,
    register,
    
    // User
    getProfile,
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
    
    // Ads
    fetchUserAds,
    createAd,
    updateAd,
    deleteAd,
    toggleAdStatus
  }
} 