<template>
  <div v-if="showSpecifications" class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="font-medium text-lg mb-4">{{ selectedCategory?.name || 'المواصفات' }}</h3>

    <div class="space-y-4">
      
      <!-- Other Properties -->
      <div 
        v-for="prop in selectedCategory?.specialProperties" 
        :key="prop.property"
        class="space-y-2"
      >
        <!-- Dropdown Type -->
        <template v-if="prop.type === 'dropdown'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ prop.property }} *
          </label>
          <select
            :value="getPropertyValue(prop.property)"
            @change="updateSpecialProperty(prop.property, $event.target.value)"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
            required
          >
            <option value="" disabled>اختر {{ prop.property }}</option>
            <option
              v-for="value in prop.values"
              :key="value"
              :value="value"
            >
              {{ value }}
            </option>
          </select>
        </template>

        <!-- Radio Type -->
        <template v-else-if="prop.type === 'radio'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ prop.property }} *
          </label>
          <div class="space-y-2">
            <label
              v-for="value in prop.values"
              :key="value"
              class="flex items-center space-x-reverse space-x-2"
            >
              <input
                type="radio"
                :name="prop.property"
                :value="value"
                :checked="getPropertyValue(prop.property) === value"
                @change="updateSpecialProperty(prop.property, value)"
                class="text-green-600"
                required
              />
              <span>{{ value }}</span>
            </label>
          </div>
        </template>

        <!-- Text Type -->
        <!-- <template v-else-if="prop.type === 'text'">
          <label class="block text-sm font-medium text-gray-700">
            {{ prop.property }}
          </label>
          <input
            type="text"
            :value="getPropertyValue(prop.property)"
            @input="updateSpecialProperty(prop.property, $event.target.value)"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
            :placeholder="`ادخل ${prop.property}`"
          />
        </template> -->


      </div>
                    <!-- Color Dropdown -->
                    <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          اللون *
        </label>
        <select
          :value="getPropertyValue('color')"
          @input="updateSpecialProperty('color', $event.target.value)"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
          required
        >
          <option value="" disabled selected>اختر اللون</option>
          <option
            v-for="color in colors"
            :key="color.value"
            :value="color.value"
            :style="{ backgroundColor: color.hex }"
          >
            {{ color.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  selectedCategory: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);

// قائمة الألوان
const colors = ref([
  { value: 'white', label: 'أبيض', hex: '#FFFFFF' },
  { value: 'black', label: 'أسود', hex: '#000000' },
  { value: 'silver', label: 'فضي', hex: '#C0C0C0' },
  { value: 'gray', label: 'رمادي', hex: '#808080' },
  { value: 'red', label: 'أحمر', hex: '#FF0000' },
  { value: 'blue', label: 'أزرق', hex: '#0000FF' },
  { value: 'green', label: 'أخضر', hex: '#008000' },
  { value: 'yellow', label: 'أصفر', hex: '#FFFF00' },
  { value: 'brown', label: 'بني', hex: '#A52A2A' },
  { value: 'orange', label: 'برتقالي', hex: '#FFA500' },
  { value: 'beige', label: 'بيج', hex: '#F5F5DC' },
  { value: 'gold', label: 'ذهبي', hex: '#FFD700' },
  { value: 'purple', label: 'بنفسجي', hex: '#800080' },
  { value: 'other', label: 'آخر', hex: '#FFFFFF' }
]);

const showSpecifications = computed(() => {
  return props.selectedCategory && props.selectedCategory.specialProperties?.length > 0;
});

const getPropertyValue = (propertyName) => {
  const property = props.modelValue.specialProperties?.find(
    p => p.property === propertyName
  );
  return property ? property.value : '';
};

const updateSpecialProperty = (property, value) => {
  const updatedModelValue = { ...props.modelValue };
  
  if (!updatedModelValue.specialProperties) {
    updatedModelValue.specialProperties = [];
  }

  const propertyIndex = updatedModelValue.specialProperties.findIndex(
    p => p.property === property
  );

  if (propertyIndex !== -1) {
    updatedModelValue.specialProperties[propertyIndex].value = value;
  } else {
    updatedModelValue.specialProperties.push({
      property,
      value
    });
  }

  emit('update:modelValue', updatedModelValue);
};
</script>

<style scoped>
/* تحسين مظهر قائمة الألوان */
select option {
  padding: 8px;
  margin: 2px;
}

/* تنسيق المسافات */
.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
  margin-right: calc(0.5rem * var(--tw-space-x-reverse));
  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
}
</style>
