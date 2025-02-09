<script setup>
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

// Cleanup on component unmount
onUnmounted(() => {
  if (video.value && video.value.srcObject) {
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

    <canvas 
      ref="canvas" 
      width="1280" 
      height="720" 
      class="bg-black rounded-3xl max-w-full"
    ></canvas>
  </div>
</template> 