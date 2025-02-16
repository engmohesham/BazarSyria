<template>
  <div class="flex h-full min-h-screen mb-40">
    <!-- Right Sidebar - Chat List -->
    <div 
      :class="[
        'border-r bg-white transition-all duration-300',
        selectedChat && isMobile ? 'hidden' : 'w-full md:w-80'
      ]"
    >
      <div class="p-4 border-b">
        <div class="flex items-center gap-5">
          <button @click="goBack" class="text-gray-600">
            <PhArrowRight class="w-5 h-5" />
          </button>
          <h2 class="font-semibold text-lg">المحادثات</h2>
          <!-- <button @click="showNewChatModal = true">
            <PhPlus class="w-5 h-5" />
          </button> -->
        </div>
      </div>
      <div class="overflow-y-auto scroll-smooth">
        <div
          v-for="chat in chats"
          :key="chat._id"
          class="p-4 border-b hover:bg-gray-50 cursor-pointer relative transition-all duration-200"
          :class="{
            'bg-gray-50': selectedChat?._id === chat._id,
            'bg-green-50': chat.unreadCount > 0 && selectedChat?._id !== chat._id,
            'hover:bg-green-100': chat.unreadCount > 0
          }"
          @click="selectChat(chat)"
        >
          <div class="flex items-center gap-3">
            <div class="relative">
              <img :src="chat.avatar || user" class="w-12 h-12 rounded-full" />
              <!-- مؤشر الرسائل غير المقروءة -->
              <div
                v-if="chat.unreadCount > 0"
                class="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-pulse"
              >
                {{ chat.unreadCount }}
              </div>
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <h3 
                  class="font-medium"
                  :class="{ 'text-green-700 font-semibold': chat.unreadCount > 0 }"
                >
                  {{ getChatName(chat) }}
                </h3>
                <span 
                  class="text-xs"
                  :class="chat.unreadCount > 0 ? 'text-green-600' : 'text-gray-500'"
                >
                  {{ formatTime(chat.lastMessageTime) }}
                </span>
              </div>
              <p 
                class="text-sm w-[180px] truncate overflow-hidden mt-1"
                :class="{
                  'text-gray-900 font-medium': chat.unreadCount > 0,
                  'text-gray-500': !chat.unreadCount
                }"
              >
                {{ chat.lastMessageContent || 'انقر للبدء بالمحادثة' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div 
      v-if="selectedChat" 
      :class="[
        'flex-1 flex flex-col',
        isMobile ? 'fixed inset-0 z-10 top-36 bg-white' : ''
      ]"
    >
      <!-- Header -->
      <div class="bg-white p-2.5 flex items-center justify-between border-b">
        <div class="flex items-center gap-4">
          <!-- Back button - only show on mobile -->
          <button 
            @click="closeChat" 
            class="text-gray-600 md:hidden"
          >
            <PhArrowRight class="w-5 h-5" />
          </button>
          <div class="flex items-center gap-2">
            <img
              :src="selectedChat?.avatar || user"
              :alt="selectedChat?.name || 'User'"
              class="w-10 h-10 rounded-full object-cover"
              @error="handleImageError"
            />
            <div class="text-right">
              <h3 class="font-semibold">{{ getChatName(selectedChat) }}</h3>
              <!-- <p class="text-xs text-gray-500">آخر ظهور اليوم 5:07م</p> -->
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button><PhArrowClockwise class="w-5 h-5" /></button>
          <button>
            <PhDotsThreeVertical class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Messages Area -->
      <div
        id="messages-container"
        class="flex-1 bg-gray-50 p-4 overflow-y-auto scroll-smooth"
        ref="messagesContainer"
      >
        <div v-for="message in messages" :key="message._id" class="mb-4">
          <!-- رسائل المستخدم الحالي (أنت) -->
          <div
            v-if="isCurrentUser(message)"
            class="flex items-start justify-end gap-2"
          >
            <div class="flex flex-col items-end max-w-[70%]">
              <div
                class="bg-green-600 text-white rounded-2xl py-2 px-4 shadow-sm"
              >
                <p class="text-sm whitespace-pre-wrap break-words text-wrap w-[200px] max-w-fit">
                  {{ message.content }}
                </p>
              </div>
              <div class="flex items-center gap-1 mt-1 px-1">
                <span class="text-xs text-gray-500 ml-1">{{
                  formatTime(message.createdAt)
                }}</span>
                <PhCheck class="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- رسائل المستخدم الآخر -->
          <div v-else class="flex items-start gap-2">
            <div class="flex flex-col items-start max-w-[70%]">
              <div
                class="bg-white text-gray-800 rounded-2xl py-2 px-4 shadow-sm"
              >
                <p class="text-sm whitespace-pre-wrap break-words">
                  {{ message.content }}
                </p>
              </div>
              <span class="text-xs text-gray-500 mt-1 px-1">{{
                formatTime(message.createdAt)
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="bg-white p-3 border-t">
        <div class="flex items-center gap-3">
          <input
            v-model="newMessage"
            type="text"
            placeholder="اكتب الرسالة..."
            class="flex-1 bg-gray-50 rounded-full px-4 py-2 focus:outline-none text-right"
            @keyup.enter="sendNewMessage"
          />
          <button
            @click="sendNewMessage"
            class="bg-green-600 text-white rounded-full p-2 flex justify-center items-center cursor hover:bg-green-800 ease-linear duration-150"
            :disabled="!newMessage.trim()"
          >
            <PhPaperPlaneRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Placeholder when no chat is selected -->
    <div 
      v-else 
      class="hidden md:flex flex-1 items-center justify-center bg-gray-50"
    >
      <div class="text-center text-gray-500">
        <PhChatCircle class="w-16 h-16 mx-auto mb-4" />
        <p class="text-lg">اختر محادثة للبدء</p>
      </div>
    </div>

    <!-- New Chat Modal -->
    <div
      v-if="showNewChatModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 w-full"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">محادثة جديدة</h3>
          <button @click="showNewChatModal = false">
            <PhXCircle class="w-5 h-5" />
          </button>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >اختر المستخدمين</label
          >
          <select
            v-model="selectedUsers"
            multiple
            class="w-full p-2 border rounded-lg"
          >
            <option
              v-for="user in availableUsers"
              :key="user._id"
              :value="user._id"
            >
              {{ user.name || user.email }}
            </option>
          </select>
        </div>
        <div class="flex justify-end gap-2">
          <button
            @click="showNewChatModal = false"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            إلغاء
          </button>
          <button
            @click="createNewChat"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            :disabled="!selectedUsers.length"
          >
            إنشاء
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  watch,
  onUnmounted,
  onBeforeMount,
  computed,
  nextTick,
} from "vue";
import io from "socket.io-client";
import { useServices } from "@/composables/useServices";
import { useRouter, useRoute } from "vue-router";
import user from "@/assets/user.png";
import {
  PhArrowRight,
  PhPlus,
  PhCheck,
  PhPaperPlaneRight,
  PhCamera,
  PhPaperclip,
  PhArrowClockwise,
  PhDotsThreeVertical,
  PhChatCircle,
  PhXCircle
} from '@phosphor-icons/vue';

const {
  getProfile,
  createChatRoom,
  getUserChats,
  getChatMessages,
  sendMessage,
} = useServices();
const socket = ref(null);
const selectedChat = ref<any>(null);
const newMessage = ref("");
const messages = ref([]);
const chats = ref([]);
const wallet = ref({ balance: 0 });
const isConnected = ref(false);
const userId = ref<string | null>(null);
const USER_EMAIL = ref<string | null>(null);
const showNewChatModal = ref(false);
const selectedUsers = ref<string[]>([]);
const availableUsers = ref<any[]>([]);
const router = useRouter();
const route = useRoute();

// إضافة computed properties للمستخدم الحالي
const currentUserId = computed(() => {
  if (process.client) {
    return localStorage.getItem("userId");
  }
  return null;
});

const currentUserEmail = computed(() => {
  if (process.client) {
    return localStorage.getItem("userEmail");
  }
  return null;
});

// دالة التحقق من المرسل مع طباعة البيانات للتأكد
const isCurrentUser = (message) => {
  // console.log("Message Data:", {
  //   messageId: message._id,
  //   senderId: message.sender?._id,
  //   senderEmail: message.sender?.email,
  //   currentUserId: currentUserId.value,
  //   currentUserEmail: currentUserEmail.value,
  // });

  // التحقق من المرسل باستخدام senderId مباشرة
  if (message.senderId) {
    return message.senderId === currentUserId.value;
  }

  // التحقق من المرسل باستخدام sender object
  if (message.sender) {
    return (
      message.sender._id === currentUserId.value ||
      message.sender.email === currentUserEmail.value
    );
  }

  return false;
};

// تعريف الأنواع
interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    email: string;
  };
  createdAt: string;
  chatId: string;
  pending?: boolean;
}

// Add profile initialization
onMounted(async () => {
  // Fetch user profile
  const { data, error } = await getProfile();

  // console.log("Profile Response:", data); // للتحقق من البيانات القادمة

  if (data && data.user._id) {
    // Save user ID to localStorage and ref
    localStorage.setItem("userId", data.user._id);
    userId.value = data.user._id;
    localStorage.setItem("userEmail", data.user.email);
    USER_EMAIL.value = data.user.email;

    // Initialize socket connection after getting user ID
    initializeSocket();
  } else {
    console.error("Failed to fetch user profile or invalid data:", error);
    console.error("Profile data received:", data);

    // محاولة إعادة جلب البيانات بعد فترة قصيرة
    setTimeout(async () => {
      const retryResponse = await getProfile();
      if (retryResponse.data && retryResponse.data._id) {
        localStorage.setItem("userId", retryResponse.data._id);
        userId.value = retryResponse.data._id;
        initializeSocket();
      }
    }, 1000);
  }

  // استدعاء المحادثات عند تحميل الصفحة
  const { data: chatsData, error: chatsError } = await getUserChats();
  if (chatsData && !chatsError) {
    chats.value = chatsData;
    // console.log(chats.value);

  }

  // Fetch user avatar
  const { data: avatarData } = await getProfile();
  if (avatarData && avatarData.user.avatar) {
    userAvatar.value = avatarData.user.avatar;
  }

  // Add this line to handle initial chat selection
  await handleInitialChatSelection();
});

// دالة للتحقق من صحة التاريخ
const isValidDate = (date: string | Date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

// تحديث دالة formatTime
const formatTime = (date: string | Date) => {
  if (!date || !isValidDate(date)) {
    return "الآن"; // إرجاع "الآن" في حالة التاريخ غير صالح
  }

  try {
    return new Date(date).toLocaleTimeString("ar-SA", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (err) {
    console.error("Error formatting time:", err);
    return "الآن";
  }
};

// دالة التمرير لأسفل المحادثة
const scrollToBottom = () => {
  nextTick(() => {
    const container = document.getElementById("messages-container");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
};

// مراقبة التغييرات في الرسائل
watch(
  messages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

// مراقبة تغيير المحادثة المحددة
watch(selectedChat, () => {
  scrollToBottom();
});

// إضافة متغير للتحكم في عملية التحميل
const isLoadingMessages = ref(false);

const handleInitialChatSelection = async () => {
  const userId = route.query.userId;
  
  // تجنب التحميل المتكرر
  if (isLoadingMessages.value || !userId || !chats.value.length) return;
  
  try {
    isLoadingMessages.value = true;
    
    // البحث عن المحادثة مع المستخدم المحدد
    const targetChat = chats.value.find(chat => 
      chat.users.some(user => user._id === userId)
    );
    
    if (targetChat) {
      // تحميل الرسائل فقط
      selectedChat.value = targetChat;
      messages.value = [];

      const { data } = await getChatMessages(targetChat._id);
      if (data) {
        messages.value = data.map(msg => ({
          ...msg,
          createdAt: isValidDate(msg.createdAt) ? msg.createdAt : new Date().toISOString(),
        }));
        
        await nextTick();
        scrollToBottom();
      }
    }
  } catch (err) {
    console.error('Error loading messages:', err);
  } finally {
    isLoadingMessages.value = false;
  }
};

// تعديل watch لتجنب التكرار
watch(
  () => route.query.userId,
  async (newUserId) => {
    if (newUserId) {
      await handleInitialChatSelection();
    }
  },
  { immediate: true }
);

// تحديث دالة تهيئة Socket.IO
const initializeSocket = () => {
  try {
    socket.value = io("https://pzsyria.com", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      timeout: 10000,
      auth: {
        token: localStorage.getItem("session-token"),
      },
    });

    socket.value.on("connect", () => {
      // console.log("Connected to socket server");
      isConnected.value = true;
    });

    socket.value.on("connect_error", (error) => {
      console.error("Connection error:", error);
      if (socket.value.io.opts.transports.includes('websocket')) {
        socket.value.io.opts.transports = ['polling'];
      }
    });

    socket.value.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socket.value.on("disconnect", (reason) => {
      console.log("Disconnected from socket server, reason:", reason);
      isConnected.value = false;
    });

    // تسجيل معالج استقبال الرسائل
    socket.value.on("receiveMessage", async (message) => {
      console.log("🚀 Socket Message Received:", message);

      // تحديث عدد الرسائل غير المقروءة وآخر رسالة
      const chatToUpdate = chats.value.find(chat => chat._id === message.chatId);
      if (chatToUpdate) {
        chatToUpdate.lastMessageContent = message.content;
        chatToUpdate.lastMessageTime = new Date().toISOString();
        
        if (message.chatId !== selectedChat.value?._id) {
          chatToUpdate.unreadCount = (chatToUpdate.unreadCount || 0) + 1;
        }
      }

      // إعادة ترتيب المحادثات
      chats.value.sort((a, b) => {
        if (a.unreadCount && !b.unreadCount) return -1;
        if (!a.unreadCount && b.unreadCount) return 1;
        return new Date(b.lastMessageTime || b.updatedAt) - new Date(a.lastMessageTime || a.updatedAt);
      });

      // تحديث الرسائل إذا كانت المحادثة مفتوحة
      if (message.chatId === selectedChat.value?._id) {
        await refreshMessages();
      }
    });
  } catch (error) {
    console.error("Error initializing socket:", error);
  }
};

// إضافة دالة لإعادة الاتصال يدوياً
const reconnectSocket = () => {
  if (socket.value) {
    socket.value.disconnect();
  }
  initializeSocket();
};

// تحديث watch للاتصال
watch(isConnected, (newValue) => {
  if (!newValue) {
    setTimeout(() => {
      reconnectSocket();
    }, 5000);
  }
});

// تحديث دالة إرسال الرسالة
const sendNewMessage = async () => {
  if (!newMessage.value.trim() || !selectedChat.value) return;

  const currentUserId = process.client ? localStorage.getItem("userId") : null;
  const messageContent = newMessage.value;

  try {
    // تحديث المحادثة مباشرة مع الرسالة الجديدة
    const chatToUpdate = chats.value.find(chat => chat._id === selectedChat.value._id);
    if (chatToUpdate) {
      chatToUpdate.lastMessageContent = messageContent;
      chatToUpdate.lastMessageTime = new Date().toISOString();
    }

    // إعادة ترتيب المحادثات
    chats.value.sort((a, b) => {
      return new Date(b.lastMessageTime || b.updatedAt) - new Date(a.lastMessageTime || a.updatedAt);
    });

    // إضافة الرسالة مؤقتاً للعرض
    const tempMessage = {
      _id: Date.now().toString(),
      content: messageContent,
      sender: { _id: currentUserId },
      createdAt: new Date().toISOString(),
      chatId: selectedChat.value._id,
      pending: true
    };

    messages.value.push(tempMessage);
    newMessage.value = "";
    scrollToBottom();

    // إرسال الرسالة عبر Socket
    socket.value.emit("sendMessage", {
      message: messageContent,
      chatId: selectedChat.value._id,
      senderId: currentUserId,
    });
    
    await refreshMessages();

  } catch (err) {
    console.error("Error in sendNewMessage:", err);
  }
};

// تحديث دالة تحديث المحادثات
const refreshChats = async () => {
  try {
    const { data: chatsData, error: chatsError } = await getUserChats();
    if (chatsData && !chatsError) {
      // حفظ حالة الرسائل غير المقروءة والرسائل الأخيرة للمحادثات الحالية
      const currentStates = {};
      chats.value.forEach(chat => {
        currentStates[chat._id] = {
          unreadCount: chat.unreadCount || 0,
          lastMessageContent: chat.lastMessageContent,
          lastMessageTime: chat.lastMessageTime
        };
      });

      // دمج البيانات الجديدة مع الحالة الحالية
      chats.value = chatsData.map(chat => ({
        ...chat,
        unreadCount: chat._id !== selectedChat.value?._id ? 
          (currentStates[chat._id]?.unreadCount || chat.unreadCount || 0) : 0,
        lastMessageContent: chat.lastMessageContent || currentStates[chat._id]?.lastMessageContent,
        lastMessageTime: chat.lastMessageTime || currentStates[chat._id]?.lastMessageTime || chat.updatedAt
      }));

      // ترتيب المحادثات
      chats.value.sort((a, b) => {
        if (a.unreadCount && !b.unreadCount) return -1;
        if (!a.unreadCount && b.unreadCount) return 1;
        return new Date(b.lastMessageTime || b.updatedAt) - new Date(a.lastMessageTime || a.updatedAt);
      });
    }
  } catch (err) {
    console.error('Error refreshing chats:', err);
  }
};

// تحديث دالة تحديث الرسائل
const refreshMessages = async () => {
  if (!selectedChat.value?._id) return;

  try {
    const { data, error } = await getChatMessages(selectedChat.value._id);

    if (error) {
      throw error;
    }

    if (data) {
      const validMessages = data.map((msg) => ({
        ...msg,
        createdAt: isValidDate(msg.createdAt)
          ? msg.createdAt
          : new Date().toISOString(),
      }));

      messages.value = validMessages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      // تحديث آخر رسالة في المحادثة
      const updatedChats = chats.value.map(chat => {
        if (chat._id === selectedChat.value._id) {
          return {
            ...chat,
            lastMessage: validMessages[validMessages.length - 1]
          };
        }
        return chat;
      });
      chats.value = updatedChats;

      await nextTick();
      scrollToBottom();
    }
  } catch (err) {
    console.error("Error in refreshMessages:", err);
  }
};

// تحديث دالة اختيار المحادثة
const selectChat = async (chat) => {
  try {
    // نحفظ المحادثة المحددة قبل تحديث الرسائل
    selectedChat.value = chat;
    messages.value = [];

    await refreshMessages();

    if (socket.value?.connected) {
      socket.value.emit("joinChat", {
        chatId: chat._id,
        userId: currentUserId.value
      });
    }

    // نضع علامة مقروء فقط عندما يتم النقر على المحادثة يدوياً
    if (chat.unreadCount > 0) {
      markChatAsRead(chat._id);
    }
  } catch (err) {
    console.error('Error in selectChat:', err);
  }
};

// تحديث دالة تحديث عدد الرسائل غير المقروءة
const updateUnreadCount = (chatId) => {
  const updatedChats = chats.value.map((chat) => {
    if (chat._id === chatId && chat._id !== selectedChat.value?._id) {
      const newUnreadCount = (chat.unreadCount || 0) + 1;
      return {
        ...chat,
        unreadCount: newUnreadCount,
        lastMessageTime: new Date().toISOString()
      };
    }
    return chat;
  });
  
  chats.value = updatedChats.sort((a, b) => {
    if (a.unreadCount && !b.unreadCount) return -1;
    if (!a.unreadCount && b.unreadCount) return 1;
    return new Date(b.lastMessageTime || b.updatedAt) - new Date(a.lastMessageTime || a.updatedAt);
  });
};

// تحديث دالة وضع علامة "مقروء" على المحادثة - frontend only
const markChatAsRead = (chatId) => {
  try {
    // تحديث حالة المحادثات محلياً
    const updatedChats = chats.value.map((chat) => {
      if (chat._id === chatId) {
        return {
          ...chat,
          unreadCount: 0,
          lastMessageTime: new Date().toISOString()
        };
      }
      return chat;
    });

    // إعادة ترتيب المحادثات بناءً على وقت آخر رسالة والرسائل غير المقروءة
    chats.value = updatedChats.sort((a, b) => {
      // المحادثات غير المقروءة أولاً
      if (a.unreadCount && !b.unreadCount) return -1;
      if (!a.unreadCount && b.unreadCount) return 1;
      // ثم بناءً على وقت آخر رسالة
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });

  } catch (err) {
    console.error('Error updating chat read status:', err);
  }
};

// تحديث دالة جلب المحادثات
const fetchChats = async () => {
  try {
    const { data } = await getUserChats();
    if (data) {
      chats.value = data.map(chat => ({
        ...chat,
        unreadCount: chat.unreadCount || 0,
        lastMessageTime: chat.lastMessageTime || chat.updatedAt
      }));

      // ترتيب المحادثات
      chats.value.sort((a, b) => {
        if (a.unreadCount && !b.unreadCount) return -1;
        if (!a.unreadCount && b.unreadCount) return 1;
        return new Date(b.lastMessageTime || b.updatedAt) - new Date(a.lastMessageTime || a.updatedAt);
      });

      // بعد تحميل المحادثات، نتحقق من وجود userId في الـ URL
      if (route.query.userId) {
        await handleInitialChatSelection();
      }
    }
  } catch (err) {
    console.error('Error fetching chats:', err);
  }
};

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});

// دالة جلب المستخدمين المتاحين
const fetchAvailableUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    availableUsers.value = data.filter(
      (user: any) => user._id !== userId.value
    );
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};

// دالة إنشاء محادثة جديدة
const createNewChat = async () => {
  try {
    const { data, error } = await createChatRoom({
      users: selectedUsers.value,
    });

    if (error) {
      throw error;
    }

    if (data) {
      // إضافة المحادثة الجديدة للقائمة
      chats.value = [...chats.value, data];

      // اختيار المحادثة الجديدة
      selectChat(data);

      // إغلاق النافذة المنبثقة
      showNewChatModal.value = false;
      selectedUsers.value = [];
    }
  } catch (err) {
    console.error("Error creating chat:", err);
  }
};

// دالة الرجوع
const goBack = () => {
  selectedChat.value = null;
  messages.value = [];
  router.back();
};

// دالة إغلاق المحادثة
const closeChat = () => {
  selectedChat.value = null;
  messages.value = [];
  if (socket.value?.connected) {
    socket.value.emit("leaveChat", {
      chatId: selectedChat.value?._id,
    });
  }
};

// جلب المستخدمين عند فتح النافذة المنبثقة
watch(showNewChatModal, (newValue) => {
  if (newValue) {
    fetchAvailableUsers();
  }
});

// دالة معالجة خطأ تحميل الصورة
const handleImageError = (event) => {
  event.target.src = user;
};

// يمكنك أيضًا إضافة computed property للصورة
const userAvatar = computed(() => {
  return selectedChat?.avatar || user;
});

// Add this computed function to get the other user's name
const getChatName = (chat) => {
  // If it's a group chat, return the chat name directly
  if (chat.isGroup) {
    return chat.name;
  }
  
  // For one-on-one chats, find the other user
  const otherUser = chat.users?.find(user => user._id !== currentUserId.value);
  return otherUser?.name || 'مستخدم';
};

// Add responsive state
const isMobile = ref(false);

// Check screen size on mount and resize
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768; // 768px is the md breakpoint
};

onMounted(() => {
  if (process.client) {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', checkScreenSize);
  }
});

// Update message input styles
const messageInputClass = computed(() => {
  return [
    'flex-1',
    'bg-gray-50',
    'rounded-full',
    'px-4',
    'py-2',
    'focus:outline-none',
    'text-right',
    isMobile.value ? 'text-sm' : 'text-base'
  ].join(' ');
});

definePageMeta({
  middleware: ["auth"]
});
</script>

<style scoped>
/* تنسيق السكرول بار */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

/* توجيه النص للعربية */
.rtl {
  direction: rtl;
}

/* Add responsive styles */
@media (max-width: 768px) {
  .messages-container {
    padding: 1rem;
  }

  .message-bubble {
    max-width: 85%;
  }
}

/* Prevent body scroll when modal is open */
.modal-open {
  overflow: hidden;
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Ensure proper touch handling on mobile */
@media (hover: none) {
  .hover\:bg-gray-50:hover {
    background-color: inherit;
  }
}
</style>

