import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from "~/utils/config";

export const useServices = () => {
  // State
  const isLoggedIn = ref(false);

  // Auth Methods
  const checkAuthStatus = () => {
    const token = localStorage.getItem("session-token");
    isLoggedIn.value = !!token;
    return isLoggedIn.value;
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`,
        {
          method: "POST",
          body: credentials,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (error.value) {
        // Extract error message from the response
        const errorMessage = error.value?.data?.message || "Login failed";
        console.error("Login error:", errorMessage);
        return { data: null, error: error.value, message: errorMessage };
      }

      if (data.value?.token) {
        localStorage.setItem("session-token", data.value.token);
        localStorage.setItem("userId", data.value.id);
        isLoggedIn.value = true;
      }
      return { data: data.value, error: null, message: data.value.message };
    } catch (err) {
      console.error("Login error:", err);
      return {
        data: null,
        error: err,
        message: "An unexpected error occurred",
      };
    }
  };

  const register = async (userData: any) => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.REGISTER}`,
        {
          method: "POST",
          body: userData,
        }
      );
      // console.log(data.value.message);

      if (error.value) throw error.value;
      return { data: data.value, error: null, message: data.value.message };
    } catch (err) {
      console.error("Register error:", err);
      return { data: null, error: err };
    }
  };

  const logout = () => {
    localStorage.removeItem("session-token");
    localStorage.clear();
    isLoggedIn.value = false;
  };

  // User Methods
  const getProfile = async () => {
    try {
      const data = await $fetch(
        `${API_BASE_URL}${API_ENDPOINTS.PROFILE}`,
        {
          headers: getAuthHeaders(),
        }
      );

      // console.log(data);

      // console.log(data);
      return { data: data, error: null };
    } catch (err) {
      console.error("Error fetching profile:", err);
      return { data: null, error: err };
    }
  };

  const getFollowers = async () => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.FOLLOWERS}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { data: data.value, error: null };
    } catch (err) {
      console.error("Error fetching followers:", err);
      return { data: null, error: err };
    }
  };

  const getFollowing = async () => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.FOLLOWING}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { data: data.value, error: null };
    } catch (err) {
      console.error("Error fetching following:", err);
      return { data: null, error: err };
    }
  };

  const followUser = async (userId: string) => {
    try {
      const { error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.FOLLOW}/${userId}/follow`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { error: null };
    } catch (err) {
      console.error("Error following user:", err);
      return { error: err };
    }
  };

  const unfollowUser = async (userId: string) => {
    try {
      const { error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.UNFOLLOW}/${userId}/unfollow`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { error: null };
    } catch (err) {
      console.error("Error unfollowing user:", err);
      return { error: err };
    }
  };

  // Advertisement Methods
  const fetchUserAds = async () => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.USER_ADS}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { data: data._value?.advertisements || [], error: null };
    } catch (err) {
      console.error("Error fetching user ads:", err);
      return { data: [], error: err };
    }
  };

  const getProducts = async () => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { data: data.value?.products || [], error: null };
    } catch (err) {
      console.error("Error fetching products:", err);
      return { data: [], error: err };
    }
  };

  const createAd = async (adData: any) => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.AD}`,
        {
          method: "POST",
          body: adData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("session-token")}`,
          },
        }
      );

      if (error.value) throw error.value;
      return { data: data.value, error: null };
    } catch (err) {
      console.error("Error creating ad:", err);
      return { data: null, error: err };
    }
  };

  const updateAd = async (adId: string, formData: FormData) => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.AD}/${adId}`,
        {
          method: "PATCH",
          body: formData,
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { data: data.value, error: null };
    } catch (err) {
      console.error('Error updating ad:', err);
      return { data: null, error: err };
    }
  };

  const deleteAd = async (adId: string) => {
    try {
      const { error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.AD}/${adId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { error: null };
    } catch (err) {
      console.error("Error deleting ad:", err);
      return { error: err };
    }
  };

  const toggleAdStatus = async (adId: string) => {
    try {
      const { error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.TOGGLE_AD}/${adId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { error: null };
    } catch (err) {
      console.error("Error toggling ad status:", err);
      return { error: err };
    }
  };

  // Category Methods
  const getCategories = async () => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}`
      );

      if (error.value) throw error.value;
      return { data: data.value?.categories || [], error: null };
    } catch (err) {
      console.error("Error fetching categories:", err);
      return { data: [], error: err };
    }
  };

  const getCategoryById = async (categoryId: string) => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.CATEGORY}/${categoryId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { data: data.value, error: null };
    } catch (err) {
      console.error("Error fetching category:", err);
      return { data: null, error: err };
    }
  };

  const getSubCategoryById = async (subCategoryId: string) => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.SUBCATEGORIES}/${subCategoryId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { data: data.value, error: null };
    } catch (err) {
      console.error("Error fetching subcategory:", err);
      return { data: null, error: err };
    }
  };

  const getSubCategories = async (categoryId: string) => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.SUBCATEGORIES}/${categoryId}/subcategories`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { data: data.value?.subCategories || [], error: null };
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      return { data: [], error: err };
    }
  };

  // Brand Methods
  // const getBrands = async () => {
  //   try {
  //     const { data, error } = await useFetch(
  //       `${API_BASE_URL}${API_ENDPOINTS.BRANDS}`
  //     );

  //     if (error.value) throw error.value;
  //     return { data: data.value?.brands || [], error: null };
  //   } catch (err) {
  //     console.error("Error fetching brands:", err);
  //     return { data: [], error: err };
  //   }
  // };

  // Location Methods
  const getCities = async () => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.CITIES}`
      );

      if (error.value) throw error.value;
      return { data: data.value?.cities || [], error: null };
    } catch (err) {
      console.error("Error fetching cities:", err);
      return { data: [], error: err };
    }
  };

  const getRegions = async (cityId: string) => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.REGIONS}/${cityId}/regions`
      );

      if (error.value) throw error.value;
      return { data: data.value?.regions || [], error: null };
    } catch (err) {
      console.error("Error fetching regions:", err);
      return { data: [], error: err };
    }
  };

  // Specifications Methods
  const getConditions = async () => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.CONDITIONS}`
      );

      if (error.value) throw error.value;
      return { data: data.value?.conditions || [], error: null };
    } catch (err) {
      console.error("Error fetching conditions:", err);
      return { data: [], error: err };
    }
  };

  const getFuelTypes = async () => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.FUEL_TYPES}`
      );

      if (error.value) throw error.value;
      return { data: data.value?.fuelTypes || [], error: null };
    } catch (err) {
      console.error("Error fetching fuel types:", err);
      return { data: [], error: err };
    }
  };

  const getTransmissions = async () => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.TRANSMISSIONS}`
      );

      if (error.value) throw error.value;
      return { data: data.value?.transmissions || [], error: null };
    } catch (err) {
      console.error("Error fetching transmissions:", err);
      return { data: [], error: err };
    }
  };

  // Chat Methods
  const createChatRoom = async (payload: { users: string[] }) => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.CHAT}`,
        {
          method: 'POST',
          body: payload,
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          },
        }
      );

      if (error.value) {
        console.error('Create chat room error:', error.value);
        return { data: null, error: error.value };
      }

      return { data: data.value, error: null };
    } catch (err) {
      console.error('Create chat room error:', err);
      return { data: null, error: err };
    }
  };

  const getUserChats = async () => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.CHAT}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { data: data.value, error: null };
    } catch (err) {
      console.error("Error fetching user chats:", err);
      return { data: null, error: err };
    }
  };

  const getChatMessages = async (chatId: string) => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}/chat/messages/${chatId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      // console.log('Messages Response:', data.value);

      if (error.value) throw error.value;
      return { data: data.value, error: null };
    } catch (err) {
      console.error("Error fetching chat messages:", err);
      return { data: null, error: err };
    }
  };

  const sendMessage = async (chatId: string, content: string) => {
    try {
      const { data, error } = await useFetch(`${API_BASE_URL}/chat/messages`, {
        method: "POST",
        body: JSON.stringify({
          chatId,
          content,
          sender: localStorage.getItem("userId"),
        }),
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });

      // console.log('Send Message Response:', data.value);

      if (error.value) {
        console.error("Send Message Error:", error.value);
        throw error.value;
      }

      return { data: data.value, error: null };
    } catch (err) {
      console.error("Error sending message:", err);
      return { data: null, error: err };
    }
  };

  const getAdById = async (id: string) => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.AD}/${id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      console.log(data);

      if (error.value) throw error.value;
      return { data: data.value, error: null };
    } catch (err) {
      console.error("Error fetching ad:", err);
      return { data: null, error: err };
    }
  };

  const updateIdentity = async (formData: FormData) => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.VERIFICATION}/verify-request`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("session-token")}`,
          },
        }
      );

      if (error.value) throw error.value;
      return { data: data.value, error: null };
    } catch (err) {
      console.error("Error updating identity:", err);
      return { data: null, error: err };
    }
  };

  const updateProfile = async (formData: FormData) => {
    try {
      const userId = formData.get('id');
      // Remove empty fields from FormData
      const cleanFormData = new FormData();
      for (const [key, value] of formData.entries()) {
        if (value !== null && value !== undefined && value !== '') {
          cleanFormData.append(key, value);
        }
      }

      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.UPDATE_PROFILE}/${userId}/update`,
        {
          method: "PATCH",
          body: cleanFormData,
          headers: {
            ...getAuthHeaders(),
          }
        }
      );

      if (error.value) throw error.value;
      return { data: data.value, error: null, message: "تم تحديث الملف الشخصي بنجاح" };
    } catch (err) {
      console.error("Error updating profile:", err);
      return { 
        data: null, 
        error: err, 
        message: "حدث خطأ أثناء تحديث الملف الشخصي" 
      };
    }
  };

  const getUserById = async (userId: string) => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}/user/${userId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      // console.log(data.value);

      if (error.value) throw error.value;
      return { data: data.value, error: null };
    } catch (err) {
      console.error('Error fetching user:', err);
      return { data: null, error: err };
    }
  };

  const getUserProfile = async (userId: string) => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}/user/${userId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { 
        data: {
          ...data.value,
          advertisements: data.value?.advertisements || [] 
        }, 
        error: null 
      };
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return { data: null, error: err };
    }
  };

  const reportUser = async (payload: { 
    reportedUser: string;
    reason: string;
    attachment?: File;
  }) => {
    try {
      const formData = new FormData();
      formData.append('reportedUser', payload.reportedUser);
      formData.append('reason', payload.reason);
      
      if (payload.attachment) {
        formData.append('attachment', payload.attachment);
      }

      const { data, error } = await useFetch(
        `${API_BASE_URL}/reports/create`,
        {
          method: 'POST',
          body: formData,
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { data: data.value, error: null };
    } catch (err) {
      console.error('Error reporting user:', err);
      return { data: null, error: err };
    }
  };

  // Slides Methods
  const getSlides = async () => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}${API_ENDPOINTS.SLIDES}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { data: data.value?.slides || [], error: null };
    } catch (err) {
      console.error("Error fetching slides:", err);
      return { data: [], error: err };
    }
  };

  // Add to favorites
  const addToFavorites = async (productId: string) => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}/advertisement/${productId}/addToFavorites`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { data: data.value, error: null };
    } catch (err) {
      console.error('Error adding to favorites:', err);
      return { data: null, error: err };
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (productId: string) => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}/advertisement/${productId}/removeFromFavorites`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { data: data.value, error: null };
    } catch (err) {
      console.error('Error removing from favorites:', err);
      return { data: null, error: err };
    }
  };

  // Get favorite ads
  const getFavoriteAds = async () => {
    try {
      const { data, error } = await useFetch(
        `${API_BASE_URL}/advertisement/my/favAds`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (error.value) throw error.value;
      return { data: data.value?.advertisements || [], error: null };
    } catch (err) {
      console.error('Error fetching favorite ads:', err);
      return { data: [], error: err };
    }
  };

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
    updateIdentity,
    updateProfile,

    // Advertisement Methods
    fetchUserAds,
    createAd,
    updateAd,
    deleteAd,
    toggleAdStatus,
    getProducts,
    getAdById,

    // New Methods
    getCategories,
    getCategoryById,
    getSubCategoryById,
    getSubCategories,
    // getBrands,
    getCities,
    getRegions,
    // getConditions,
    // getFuelTypes,
    // getTransmissions,

    // Chat Methods
    createChatRoom,
    getUserChats,
    getChatMessages,
    sendMessage,

    getUserById,
    getUserProfile,
    reportUser,

    // Slides Method
    getSlides,

    // New Methods
    addToFavorites,
    removeFromFavorites,
    getFavoriteAds,
  };
};
