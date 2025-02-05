export const API_BASE_URL = 'https://pzsyria.com/api'

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/user',
  
  // User
  PROFILE: '/auth/profile',
  FOLLOWERS: '/users/followers',
  FOLLOWING: '/users/following',
  FOLLOW: '/users/follow',
  UNFOLLOW: '/users/unfollow',
  
  // Ads
  ADS: '/advertisement',
  USER_ADS: '/advertisement/all',
  TOGGLE_AD: '/advertisement/toggle',
  
  // Categories
  CATEGORIES: '/category/all',
  SUBCATEGORIES: '/category', // /{categoryId}/subcategories
  
  // Brands
  BRANDS: '/brands',
  
  // Cities and Regions
  CITIES: '/cities',
  REGIONS: '/regions', // /{cityId}/regions
  
  // Additional Specifications
  CONDITIONS: '/conditions',
  FUEL_TYPES: '/fuel-types',
  TRANSMISSIONS: '/transmissions',
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