<template>
  <div v-if="showSpecifications" class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="font-medium text-lg mb-4">المواصفات</h3>

    <div class="space-y-4">
      <!-- Condition -->
      <div v-if="hasSpecialProperty('Condition')">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          الحالة *
        </label>
        <select
          v-model="modelValue.condition"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
          required
        >
          <option value="" disabled selected>اختر الحالة</option>
          <option
            v-for="condition in conditions"
            :key="condition._id"
            :value="condition._id"
          >
            {{ condition.name }}
          </option>
        </select>
      </div>

      <!-- Fuel Type -->
      <div v-if="hasSpecialProperty('Fuel Type')">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          نوع الوقود *
        </label>
        <select
          v-model="modelValue.fuelType"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
          required
        >
          <option value="" disabled selected>اختر نوع الوقود</option>
          <option v-for="type in fuelTypes" :key="type._id" :value="type._id">
            {{ type.name }}
          </option>
        </select>
      </div>

      <!-- Transmission -->
      <div v-if="hasSpecialProperty('Transmission')">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          ناقل الحركة *
        </label>
        <select
          v-model="modelValue.transmission"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
          required
        >
          <option value="" disabled selected>اختر نوع ناقل الحركة</option>
          <option
            v-for="trans in transmissions"
            :key="trans._id"
            :value="trans._id"
          >
            {{ trans.name }}
          </option>
        </select>
      </div>

      <!-- Color -->
      <div v-if="hasSpecialProperty('Color')" class="space-y-2">
        <label class="block text-sm font-medium text-gray-700"> اللون </label>
        <input
          type="text"
          v-model="modelValue.color"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
          placeholder="ادخل لون السيارة"
        />
      </div>

      <!-- Dynamic Special Properties -->
      <div v-for="prop in otherSpecialProperties" :key="prop.property">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ prop.property }}
        </label>
        <input
          v-if="prop.type === 'text'"
          type="text"
          v-model="prop.value"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
          :placeholder="`ادخل ${prop.property}`"
        />
        <select
          v-else-if="prop.type === 'select'"
          v-model="prop.value"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
        >
          <option value="" disabled selected>اختر {{ prop.property }}</option>
          <option v-for="value in prop.values" :key="value" :value="value">
            {{ value }}
          </option>
        </select>
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
  conditions: {
    type: Array,
    default: () => [],
  },
  fuelTypes: {
    type: Array,
    default: () => [],
  },
  transmissions: {
    type: Array,
    default: () => [],
  },
  selectedCategory: {
    type: Object,
    default: null
  }
});

const showSpecifications = computed(() => {
  return props.selectedCategory && props.selectedCategory.specialProperties?.length > 0;
});

const hasSpecialProperty = (propertyName) => {
  return props.selectedCategory?.specialProperties?.some(
    prop => prop.property === propertyName
  );
};

const otherSpecialProperties = computed(() => {
  if (!props.selectedCategory?.specialProperties) return [];
  
  return props.selectedCategory.specialProperties.filter(
    prop => !['Condition', 'Fuel Type', 'Transmission', 'Color'].includes(prop.property)
  );
});
</script>
