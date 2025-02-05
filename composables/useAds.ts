export const useAds = () => {
  const api = useApi()

  // Fetch user's ads
  const fetchUserAds = async () => {
    try {
      const { data, error } = await api.fetchUserAds()
      if (error.value) throw error.value
      return { data: data.value?.ads || [], error: null }
    } catch (err) {
      console.error('Error fetching user ads:', err)
      return { data: [], error: err }
    }
  }

  // Delete ad
  const deleteAd = async (adId: string) => {
    try {
      const { error } = await api.deleteAd(adId)
      if (error.value) throw error.value
      return { error: null }
    } catch (err) {
      console.error('Error deleting ad:', err)
      return { error: err }
    }
  }

  // Toggle ad status
  const toggleAdStatus = async (adId: string) => {
    try {
      const { error } = await api.toggleAdStatus(adId)
      if (error.value) throw error.value
      return { error: null }
    } catch (err) {
      console.error('Error toggling ad status:', err)
      return { error: err }
    }
  }

  return {
    fetchUserAds,
    deleteAd,
    toggleAdStatus
  }
} 