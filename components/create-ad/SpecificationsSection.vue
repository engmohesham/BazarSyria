<template>
  <div v-if="showSpecifications" class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="font-medium text-lg mb-4">{{ selectedCategory?.name || 'المواصفات' }}</h3>

    <div class="space-y-4">
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
            @input="updateSpecialProperty(prop.property, $event.target.value)"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
            required
          >
            <option value="" disabled selected>اختر {{ prop.property }}</option>
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
        <template v-else-if="prop.type === 'text'">
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
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

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

const showSpecifications = computed(() => {
  return props.selectedCategory && props.selectedCategory.specialProperties?.length > 0;
});

const getPropertyValue = (propertyName) => {
  return props.modelValue.specialProperties.find(
    p => p.property === propertyName
  )?.value || '';
};

const updateSpecialProperty = (property, value) => {
  const updatedModelValue = { ...props.modelValue };
  const propertyIndex = updatedModelValue.specialProperties.findIndex(
    p => p.property === property
  );

  if (propertyIndex !== -1) {
    updatedModelValue.specialProperties[propertyIndex].value = value;
  } else {
    updatedModelValue.specialProperties.push({
      property: property,
      value: value
    });
  }

  emit('update:modelValue', updatedModelValue);
};
</script>
