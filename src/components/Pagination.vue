<template>
  <div class="flex justify-center mt-6" v-if="matchesStore.totalPages > 1">
    <!-- Previous Button -->
    <button
      @click="matchesStore.setPage(matchesStore.currentPage - 1)"
      :disabled="matchesStore.currentPage <= 1"
      class="px-4 py-2 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      &lt; Prev
    </button>

    <!-- Page Number Buttons -->
    <button
      v-for="page in matchesStore.totalPages"
      :key="page"
      :class="[
        'px-4 py-2 mx-1 rounded',
        matchesStore.currentPage === page
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 hover:bg-gray-300',
      ]"
      @click="matchesStore.setPage(page)"
    >
      {{ page }}
    </button>

    <!-- Next Button -->
    <button
      @click="matchesStore.setPage(matchesStore.currentPage + 1)"
      :disabled="matchesStore.currentPage >= matchesStore.totalPages"
      class="px-4 py-2 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next &gt;
    </button>
  </div>
</template>

<script setup>
// Correct import name
import { useMatchesStore } from '@/stores/matches'

// Use setup script for better composition API usage
const matchesStore = useMatchesStore()

// No need to redefine totalPages, currentPage, or setPage here.
// They are accessed directly from the store instance in the template.
// The store's state (currentPage) and computed properties (totalPages) are reactive.
// The store's action (setPage) is directly callable.
</script>
