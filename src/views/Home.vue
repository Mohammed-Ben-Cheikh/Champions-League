<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold text-center mb-6">
      UEFA Champions League Matches
    </h1>

    <!-- Date Filter -->
    <div class="flex justify-center items-center mb-6 space-x-2">
      <label for="match-date" class="font-medium">Select Date:</label>
      <input type="date" id="match-date" v-model="selectedDateInput" @change="fetchMatchesForSelectedDate"
        class="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>

    <MatchList />
    <Pagination />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useMatchesStore } from '@/stores/matches';
import MatchList from '@/components/MatchList.vue';
import Pagination from '@/components/Pagination.vue';

const matchesStore = useMatchesStore();
const selectedDateInput = ref(matchesStore.selectedDate);
const fetchMatchesForSelectedDate = async () => {
  matchesStore.selectedDate = selectedDateInput.value;
  await matchesStore.fetchMatches();
};
watch(() => matchesStore.selectedDate, (newDate) => {
  selectedDateInput.value = newDate;
});
</script>
