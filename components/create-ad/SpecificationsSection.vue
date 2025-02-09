<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="font-medium text-lg mb-4">المواصفات</h3>

    <div class="space-y-4">
      <!-- Condition -->
      <div>
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
      <div>
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
      <div>
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

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700"> اللون </label>
        <input
          type="text"
          v-model="selectedColor"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
          placeholder="ادخل لون السيارة"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
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
});

// Add color computed property

</script>
