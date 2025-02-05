export const API_BASE_URL = 'https://bazar-syria.vercel.app'

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // User
  PROFILE: '/users/profile',
  FOLLOWERS: '/users/followers',
  FOLLOWING: '/users/following',
  FOLLOW: '/users/follow',
  UNFOLLOW: '/users/unfollow',
  
  // Ads
  ADS: '/advertisement',
  USER_ADS: '/advertisement/all',
  TOGGLE_AD: '/advertisement/toggle',
}

// تحديث دالة getAuthHeaders لتكون متوافقة مع SSR
export const getAuthHeaders = () => {
  if (process.client) {
    const token = localStorage.getItem('session-token')
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  }
  return {
    'Content-Type': 'application/json'
  }
}

// تصدير كائن واحد يحتوي على كل الإعدادات
export default {
  API_BASE_URL,
  API_ENDPOINTS,
  getAuthHeaders
} 