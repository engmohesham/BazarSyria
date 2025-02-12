export const useNotification = () => {
  const notification = reactive({
    show: false,
    message: '',
    type: 'success' // 'success' | 'error'
  });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    notification.show = true;
    notification.message = message;
    notification.type = type;

    // Auto hide after 3 seconds
    setTimeout(() => {
      notification.show = false;
    }, 3000);
  };

  return {
    notification,
    showNotification
  };
}; 