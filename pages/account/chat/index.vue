<template>
  <div class="flex h-screen">
    <!-- Right Sidebar - Chat List -->
    <div class="w-80 border-r bg-white">
      <div class="p-4 border-b">
        <div class="flex items-center justify-between">
          <button @click="goBack" class="text-gray-600">
            <Icon name="heroicons:arrow-right" class="w-5 h-5" />
          </button>
          <h2 class="font-semibold text-lg">المحادثات</h2>
          <button @click="showNewChatModal = true">
            <Icon name="heroicons:plus" class="w-5 h-5" />
          </button>
        </div>
      </div>
      <div class="overflow-y-auto">
        <div
          v-for="chat in chats"
          :key="chat._id"
          class="p-4 border-b hover:bg-gray-50 cursor-pointer relative"
          :class="{ 'bg-gray-50': selectedChat?._id === chat._id }"
          @click="selectChat(chat)"
        >
          <div class="flex items-center gap-3">
            <div class="relative">
              <img :src="chat.avatar || user" class="w-12 h-12 rounded-full" />
              <!-- مؤشر الرسائل غير المقروءة -->
              <div
                v-if="chat.unreadCount > 0"
                class="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                {{ chat.unreadCount }}
              </div>
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <h3 class="font-medium">{{ chat.name || 'مستخدم' }}</h3>
                <span class="text-xs text-gray-500">{{
                  formatTime(chat.lastMessageTime)
                }}</span>
              </div>
              <p 
                class="text-sm truncate mt-1"
                :class="chat.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'"
              >
                {{ chat.lastMessage }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col" v-if="selectedChat">
      <!-- Header -->
      <div class="bg-white p-2.5 flex items-center justify-between border-b">
        <div class="flex items-center gap-4">
          <!-- زر الرجوع -->
          <button @click="closeChat" class="text-gray-600">
            <Icon name="heroicons:arrow-right" class="w-5 h-5" />
          </button>
          <div class="flex items-center gap-2">
            <img
              :src="selectedChat?.avatar || user"
              :alt="selectedChat?.name || 'User'"
              class="w-10 h-10 rounded-full object-cover"
              @error="handleImageError"
            />
            <div class="text-right">
              <h3 class="font-semibold">{{ selectedChat?.name || 'مستخدم' }}</h3>
              <p class="text-xs text-gray-500">آخر ظهور اليوم 5:07م</p>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button><Icon name="heroicons:arrow-path" class="w-5 h-5" /></button>
          <button>
            <Icon name="heroicons:ellipsis-vertical" class="w-5 h-5" />
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
                <p class="text-sm whitespace-pre-wrap break-words">
                  {{ message.content }}
                </p>
              </div>
              <div class="flex items-center gap-1 mt-1 px-1">
                <span class="text-xs text-gray-500 ml-1">{{
                  formatTime(message.createdAt)
                }}</span>
                <Icon name="heroicons:check" class="w-3 h-3 text-gray-400" />
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
          <div class="flex items-center gap-2">
            <button class="text-gray-400">
              <Icon name="heroicons:photo" class="w-6 h-6" />
            </button>
            <button class="text-gray-400">
              <Icon name="heroicons:paper-clip" class="w-6 h-6" />
            </button>
          </div>
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
            <Icon name="heroicons:paper-airplane" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Placeholder when no chat is selected -->
    <div v-else class="flex-1 flex items-center justify-center bg-gray-50">
      <div class="text-center text-gray-500">
        <Icon
          name="heroicons:chat-bubble-left-right"
          class="w-16 h-16 mx-auto mb-4"
        />
        <p class="text-lg">اختر محادثة للبدء</p>
      </div>
    </div>

    <!-- Modal إنشاء محادثة جديدة -->
    <div
      v-if="showNewChatModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-96">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">محادثة جديدة</h3>
          <button @click="showNewChatModal = false">
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
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
import { useRouter } from "vue-router";
import user from "@/assets/user.png";

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
    console.log(chats.value);

  }

  // Fetch user avatar
  const { data: avatarData } = await getProfile();
  if (avatarData && avatarData.user.avatar) {
    userAvatar.value = avatarData.user.avatar;
  }
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

// تحديث دالة تهيئة Socket.IO
const initializeSocket = () => {
  socket.value = io("ws://pzsyria.com", {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    auth: {
      token: localStorage.getItem("session-token"),
    },
  });

  socket.value.on("connect", () => {
    console.log("Connected to socket server");
    isConnected.value = true;
  });

  socket.value.on("error", (error) => {
    console.error("Socket error:", error);
  });

  socket.value.on("disconnect", () => {
    console.log("Disconnected from socket server");
    isConnected.value = false;
  });

  // تسجيل معالج استقبال الرسائل
  socket.value.on("receiveMessage", (message) => {
    console.log("🚀 Socket Message Received:", message);

    // تحديث عدد الرسائل غير المقروءة
    updateUnreadCount(message.chatId);

    if (message?.chatId === selectedChat.value?._id) {
      refreshMessages();
    }
  });
};

// تحديث دالة إرسال الرسالة
const sendNewMessage = async () => {
  if (!newMessage.value.trim() || !selectedChat.value) return;

  const currentUserId = process.client ? localStorage.getItem("userId") : null;
  const messageContent = newMessage.value;

  try {
    // إرسال الرسالة مباشرة بدون إضافة رسالة مؤقتة
    socket.value.emit("sendMessage", {
      message: messageContent,
      chatId: selectedChat.value._id,
      senderId: currentUserId,
    });

    newMessage.value = "";

    // تحديث الرسائل بعد الإرسال
    setTimeout(async () => {
      await refreshMessages();
    }, 1000);
  } catch (err) {
    console.error("Error in sendNewMessage:", err);
  }
};

// تحديث دالة اختيار المحادثة
const selectChat = async (chat) => {
  selectedChat.value = chat;
  messages.value = [];

  try {
    // تحديث حالة القراءة عند فتح المحادثة
    await markChatAsRead(chat._id);
    
    // تحديث عدد الرسائل غير المقروءة في القائمة
    const updatedChats = chats.value.map((c) => {
      if (c._id === chat._id) {
        return { ...c, unreadCount: 0 };
      }
      return c;
    });
    chats.value = updatedChats;

    // جلب الرسائل
    const { data } = await getChatMessages(chat._id);
    if (data) {
      messages.value = data;
    }

    if (socket.value?.connected) {
      socket.value.emit("joinChat", {
        chatId: chat._id,
        userId: currentUserId.value
      });
    }
  } catch (err) {
    console.error('Error in selectChat:', err);
  }
};

// دالة تحديث عدد الرسائل غير المقروءة
const updateUnreadCount = (chatId) => {
  const updatedChats = chats.value.map((chat) => {
    if (chat._id === chatId && chat._id !== selectedChat.value?._id) {
      return {
        ...chat,
        unreadCount: (chat.unreadCount || 0) + 1
      };
    }
    return chat;
  });
  chats.value = updatedChats;
};

// دالة وضع علامة "مقروء" على المحادثة
const markChatAsRead = async (chatId) => {
  try {
    // هنا يجب إضافة طلب API لتحديث حالة القراءة في الباكند
    await fetch(`/api/chats/${chatId}/read`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('session-token')}`
      }
    });
  } catch (err) {
    console.error('Error marking chat as read:', err);
  }
};

// تحديث دالة جلب المحادثات
const fetchChats = async () => {
  try {
    const { data } = await getUserChats();
    if (data) {
      chats.value = data.map(chat => ({
        ...chat,
        unreadCount: chat.unreadCount || 0
      }));
    }
  } catch (err) {
    console.error('Error fetching chats:', err);
  }
};

onMounted(() => {
  fetchChats();
  initializeSocket();
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});

// تحديث دالة تحديث الرسائل من السيرفر
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

      const pendingMessages = messages.value.filter((m) => m.pending);

      messages.value = [...validMessages, ...pendingMessages].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      localStorage.setItem(
        `chat_${selectedChat.value._id}`,
        JSON.stringify(messages.value)
      );
    }
  } catch (err) {
    console.error("Error in refreshMessages:", err);
  }
};

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

// يمكنك أيضًا طباعة بيانات الرسائل للتحقق
// watch(
//   messages,
//   (newMessages) => {
//     console.log(
//       "Messages:",
//       newMessages.map((m) => ({
//         content: m.content,
//         sender: m.sender.email,
//         isCurrentUser: isCurrentUser(m),
//       }))
//     );
//   },
//   { deep: true }
// );

// دالة معالجة خطأ تحميل الصورة
const handleImageError = (event) => {
  event.target.src = user;
};

// يمكنك أيضًا إضافة computed property للصورة
const userAvatar = computed(() => {
  return selectedChat?.avatar || user;
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
</style>
