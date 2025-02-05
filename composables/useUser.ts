import { API_BASE_URL, API_ENDPOINTS } from '~/utils/config'
import { useApi } from './useApi'

export const useUser = () => {
  const api = useApi()

  const getProfile = async () => {
    try {
      const { data, error } = await api.getProfile()
      if (error.value) throw error.value
      return { data: data.value, error: null }
    } catch (err) {
      console.error('Error fetching profile:', err)
      return { data: null, error: err }
    }
  }

  const getFollowers = async () => {
    try {
      const response = await api.getFollowers()
      console.log('API Response:', response) // للتحقق من الاستجابة

      if (response.error?.value) {
        throw response.error.value
      }

      return { 
        data: response.data.value, 
        error: null 
      }
    } catch (err) {
      console.error('Error in getFollowers:', err)
      return { data: null, error: err }
    }
  }

  const getFollowing = async () => {
    try {
      const response = await api.getFollowing()
      console.log('API Response:', response) // للتحقق من الاستجابة

      if (response.error?.value) {
        throw response.error.value
      }

      return { 
        data: response.data.value, 
        error: null 
      }
    } catch (err) {
      console.error('Error in getFollowing:', err)
      return { data: null, error: err }
    }
  }

  const followUser = async (userId) => {
    try {
      const response = await api.followUser(userId)
      if (response.error?.value) throw response.error.value
      return { error: null }
    } catch (err) {
      console.error('Error in followUser:', err)
      return { error: err }
    }
  }

  const unfollowUser = async (userId) => {
    try {
      const response = await api.unfollowUser(userId)
      if (response.error?.value) throw response.error.value
      return { error: null }
    } catch (err) {
      console.error('Error in unfollowUser:', err)
      return { error: err }
    }
  }

  return {
    getProfile,
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser
  }
} 