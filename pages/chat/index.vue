<template>
  <div class="flex h-screen">
    <!-- Right Sidebar - Chat List -->
    <div class="w-80 border-r bg-white">
      <div class="p-4 border-b">
        <div class="flex items-center justify-between">
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
          class="p-4 border-b hover:bg-gray-50 cursor-pointer"
          :class="{ 'bg-gray-50': selectedChat?._id === chat._id }"
          @click="selectChat(chat)"
        >
          <div class="flex items-center gap-3">
            <img
              :src="chat.avatar || '/default-avatar.png'"
              class="w-12 h-12 rounded-full"
            />
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <h3 class="font-medium">{{ chat.name }}</h3>
                <span class="text-xs text-gray-500">{{
                  formatTime(chat.lastMessageTime)
                }}</span>
              </div>
              <p class="text-sm text-gray-500 truncate mt-1">
                {{ chat.lastMessage }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <div class="bg-white p-4 flex items-center justify-between border-b">
        <div class="flex items-center gap-4">
          <!-- زر الرجوع -->
          <button @click="goBack" class="text-gray-600">
            <Icon name="heroicons:arrow-right" class="w-5 h-5" />
          </button>
          <div class="flex items-center gap-2">
            <img
              :src="selectedChat?.avatar || '/default-avatar.png'"
              class="w-10 h-10 rounded-full"
            />
            <div class="text-right">
              <h3 class="font-semibold">{{ selectedChat?.name }}</h3>
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
      <div class="flex-1 bg-gray-50 p-4 overflow-y-auto">
        <div v-for="message in messages" :key="message._id" class="mb-4">
          <!-- رسائل المستخدم الحالي (أنت) -->
          <div
            v-if="message.sender.email !== 'pazarsyria@gmail.com'"
            class="flex items-start justify-end gap-2"
          >
            <div class="flex flex-col items-end">
              <div
                class="bg-white text-gray-800 rounded-lg py-2 px-4 shadow-sm max-w-[80%]"
              >
                <p class="text-sm">{{ message.content }}</p>
              </div>
              <div class="flex items-center gap-1 mt-1">
                <span class="text-xs text-gray-500">{{
                  formatTime(message.createdAt)
                }}</span>
                <Icon name="heroicons:check" class="w-3 h-3 text-gray-400" />
              </div>
            </div>
            <img
              :src="userAvatar || '/default-avatar.png'"
              class="w-8 h-8 rounded-full"
            />
          </div>

          <!-- رسائل المستخدم الآخر -->
          <div
            v-else
            class="flex items-start gap-2"
          >
            <img
              :src="selectedChat?.avatar || '/default-avatar.png'"
              class="w-8 h-8 rounded-full"
            />
            <div class="flex flex-col items-start">
              <div
                class="bg-green-600 text-white rounded-lg py-2 px-4 shadow-sm max-w-[80%]"
              >
                <p class="text-sm">{{ message.content }}</p>
              </div>
              <span class="text-xs text-gray-500 mt-1">{{
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
            class="bg-green-600 text-white rounded-full p-2"
            :disabled="!newMessage.trim()"
          >
            <Icon name="heroicons:paper-airplane" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal إنشاء محادثة جديدة -->
    <div v-if="showNewChatModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">محادثة جديدة</h3>
          <button @click="showNewChatModal = false">
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">اختر المستخدمين</label>
          <select 
            v-model="selectedUsers" 
            multiple 
            class="w-full p-2 border rounded-lg"
          >
            <option v-for="user in availableUsers" :key="user._id" :value="user._id">
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
import { ref, onMounted, watch, onUnmounted } from "vue";
import io from "socket.io-client";
import { useServices } from "@/composables/useServices";
import { useRouter } from "vue-router";

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
const userAvatar = ref(null);
const showNewChatModal = ref(false);
const selectedUsers = ref<string[]>([]);
const availableUsers = ref<any[]>([]);
const router = useRouter();

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
    return 'الآن'; // إرجاع "الآن" في حالة التاريخ غير صالح
  }
  
  try {
    return new Date(date).toLocaleTimeString('ar-SA', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (err) {
    console.error('Error formatting time:', err);
    return 'الآن';
  }
};

// مراقبة التغييرات في الرسائل
watch(messages, (newMessages) => {
  if (selectedChat.value?._id) {
    // حفظ الرسائل في التخزين المحلي
    localStorage.setItem(
      `chat_${selectedChat.value._id}`, 
      JSON.stringify(newMessages)
    );
    
    // التمرير لأسفل عند إضافة رسالة جديدة
    if (newMessages.length > 0) {
      scrollToBottom();
    }
  }
}, { deep: true });

// تحديث دالة إرسال الرسالة
const sendNewMessage = async () => {
  if (!newMessage.value.trim() || !selectedChat.value) return;

  const currentUserId = localStorage.getItem('userId');
  const messageContent = newMessage.value;

  const tempMessage = {
    _id: `temp-${Date.now()}`,
    content: messageContent,
    sender: {
      _id: currentUserId
    },
    createdAt: new Date().toISOString(),
    chatId: selectedChat.value._id,
    pending: true
  };

  try {
    messages.value = [...messages.value, tempMessage];
    newMessage.value = '';
    scrollToBottom();

    // إرسال الرسالة عبر Socket.IO
    socket.value.emit("sendMessage", {
      chatId: selectedChat.value._id,
      message: messageContent,
      senderId: currentUserId,
    });

  } catch (err) {
    console.error('Error in sendNewMessage:', err);
    messages.value = messages.value.filter(m => m._id !== tempMessage._id);
  }
};

// تحديث دالة تهيئة Socket.IO
const initializeSocket = () => {
  socket.value = io("ws://147.93.120.237", {
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

  // استقبال الرسائل الجديدة في الوقت الفعلي
  socket.value.on("receiveMessage", (message) => {
    console.log("Received new message:", message);
    if (message.chatId === selectedChat.value?._id) {
      // إزالة الرسالة المؤقتة إذا كانت موجودة
      messages.value = messages.value.filter(m => !m.pending);
      
      // إضافة الرسالة الجديدة
      messages.value = [...messages.value, {
        ...message,
        createdAt: isValidDate(message.createdAt) ? message.createdAt : new Date().toISOString()
      }].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      scrollToBottom();
    }
  });

  socket.value.on("error", (error) => {
    console.error("Socket error:", error);
  });

  socket.value.on("disconnect", () => {
    console.log("Disconnected from socket server");
    isConnected.value = false;
  });
};

// التمرير إلى آخر رسالة
const scrollToBottom = () => {
  setTimeout(() => {
    const container = document.querySelector(".messages-container");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, 100);
};

// تحديث دالة اختيار المحادثة
const selectChat = async (chat) => {
  selectedChat.value = chat;
  messages.value = []; // مسح الرسائل السابقة
  
  if (socket.value?.connected) {
    // الانضمام إلى غرفة المحادثة
    socket.value.emit("joinChat", {
      chatId: chat._id,
      userId: localStorage.getItem('userId')
    });
    
    // جلب الرسائل باستخدام API
    const { data, error } = await getChatMessages(chat._id);
    if (data && !error) {
      const validMessages = data.map(msg => ({
        ...msg,
        createdAt: isValidDate(msg.createdAt) ? msg.createdAt : new Date().toISOString()
      }));

      messages.value = validMessages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      scrollToBottom();
    }
  }
};

// تحديث مراقب المحادثة المحددة
watch(selectedChat, async (newChat) => {
  if (newChat && socket.value?.connected) {
    messages.value = []; // مسح الرسائل السابقة
    
    socket.value.emit("joinChat", {
      chatId: newChat._id,
      userId: localStorage.getItem('userId')
    });

    // جلب الرسائل باستخدام API
    const { data, error } = await getChatMessages(newChat._id);
    if (data && !error) {
      const validMessages = data.map(msg => ({
        ...msg,
        createdAt: isValidDate(msg.createdAt) ? msg.createdAt : new Date().toISOString()
      }));

      messages.value = validMessages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      scrollToBottom();
    }
  }
});

onMounted(() => {
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
      const validMessages = data.map(msg => ({
        ...msg,
        createdAt: isValidDate(msg.createdAt) ? msg.createdAt : new Date().toISOString()
      }));

      const pendingMessages = messages.value.filter(m => m.pending);
      
      messages.value = [...validMessages, ...pendingMessages].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      localStorage.setItem(`chat_${selectedChat.value._id}`, JSON.stringify(messages.value));
    }
  } catch (err) {
    console.error('Error in refreshMessages:', err);
  }
};

// دالة جلب المستخدمين المتاحين
const fetchAvailableUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    availableUsers.value = data.filter((user: any) => user._id !== userId.value);
  } catch (err) {
    console.error('Error fetching users:', err);
  }
};

// دالة إنشاء محادثة جديدة
const createNewChat = async () => {
  try {
    const { data, error } = await createChatRoom({
      users: selectedUsers.value
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
    console.error('Error creating chat:', err);
  }
};

// دالة الرجوع
const goBack = () => {
  selectedChat.value = null;
  messages.value = [];
  router.back();
};

// جلب المستخدمين عند فتح النافذة المنبثقة
watch(showNewChatModal, (newValue) => {
  if (newValue) {
    fetchAvailableUsers();
  }
});

// تحديث التحقق من هوية المرسل
const isCurrentUser = (message) => {
  return message.sender.email === 'pazarsyria@gmail.com' // أو استخدم message.sender._id === userId
}

// يمكنك أيضًا طباعة بيانات الرسائل للتحقق
watch(messages, (newMessages) => {
  console.log('Messages:', newMessages.map(m => ({
    content: m.content,
    sender: m.sender.email,
    isCurrentUser: isCurrentUser(m)
  })))
}, { deep: true })
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
