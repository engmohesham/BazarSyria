<script setup>
import { PhX, PhCamera } from "@phosphor-icons/vue";

const emit = defineEmits(['capture', 'close']);

const canvas = ref(null);
const video = ref(null);
const ctx = ref(null);
const isStreaming = ref(false);

const constraints = ref({
  audio: false,
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'environment' // Try to use back camera first
  }
});

// Add prop for capture type
const props = defineProps({
  type: {
    type: String,
    default: 'id', // 'id' or 'selfie'
  }
});

// console.log(props.type);

onMounted(async () => {
  if (video.value && canvas.value) {
    ctx.value = canvas.value.getContext("2d");
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints.value);
      SetStream(stream);
    } catch (err) {
      console.error('Failed to get camera:', err);
      // Fallback to any available camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true
        });
        SetStream(stream);
      } catch (e) {
        console.error('Camera access failed:', e);
      }
    }
  }
});

function SetStream(stream) {
  video.value.srcObject = stream;
  video.value.play();
  
  video.value.onloadedmetadata = () => {
    isStreaming.value = true;
    Draw();
  };
}

function Draw() {
  if (isStreaming.value && ctx.value && video.value) {
    ctx.value.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
    requestAnimationFrame(Draw);
  }
}

const captureImage = () => {
  if (canvas.value) {
    const imageData = canvas.value.toDataURL('image/jpeg', 0.8);
    emit('capture', imageData);
  }
};

const closeCamera = () => {
  if (video.value?.srcObject) {
    const tracks = video.value.srcObject.getTracks();
    tracks.forEach(track => track.stop());
  }
  isStreaming.value = false;
  emit('close');
};

onUnmounted(() => {
  if (video.value?.srcObject) {
    const tracks = video.value.srcObject.getTracks();
    tracks.forEach(track => track.stop());
  }
  isStreaming.value = false;
});
</script>

<template>
  <div class="relative">
    <video 
      ref="video" 
      autoplay 
      playsinline 
      webkit-playsinline 
      muted 
      class="hidden"
    ></video>

    <div class="relative">
      <canvas 
        ref="canvas" 
        width="1280" 
        height="720" 
        class="bg-black rounded-3xl max-w-full"
      ></canvas>

      <!-- ID Card Guide Frame -->
      <div v-if="type === 'id'" class="absolute inset-0 flex items-center justify-center">
        <!-- Darkened overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50">
          <!-- Cut out rectangle for ID card -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="relative w-[75%] h-[70%]">
              <!-- Transparent cutout -->
              <div class="absolute inset-0 bg-transparent border-2 border-white rounded-lg">
                <!-- Corner markers -->
                <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white"></div>
                <div class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white"></div>
                <div class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white"></div>
                <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white"></div>
              </div>
              <!-- Guide text -->
              <div class="absolute -top-8 left-0 right-0 text-center">
                <p class="text-white text-sm bg-black bg-opacity-50 py-1 px-2 rounded inline-block">
                  ضع البطاقة داخل الإطار
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selfie Guide Frame -->
      <div v-else class="absolute inset-0 flex items-center justify-center">
        <div class="absolute inset-0 bg-black bg-opacity-50">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="relative w-[30%] h-[50%]">
              <div class="absolute inset-0 bg-transparent border-2 border-white rounded-full">
                <!-- Guide text -->
                <div class="absolute -top-8 left-0 right-0 text-center">
                  <p class="text-white text-sm bg-black bg-opacity-50 py-1 px-2 rounded inline-block">
                    ضع وجهك داخل الدائرة
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Camera controls -->
    <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
      <button
        type="button"
        @click="captureImage"
        :disabled="!isStreaming"
        class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        <PhCamera class="w-5 h-5" />
        التقاط الصورة
      </button>
      <button
        type="button"
        @click="closeCamera"
        class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
      >
        <PhX class="w-5 h-5" />
        إلغاء
      </button>
    </div>

    <button @click="$emit('close')" class="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg">
      <PhX class="w-6 h-6 text-gray-600" />
    </button>
  </div>
</template> 