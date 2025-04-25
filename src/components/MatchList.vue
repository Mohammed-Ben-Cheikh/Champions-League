<template>
  <div>
    <div v-if="loading" class="text-center py-4">Loading matches...</div>

    <!-- Use errorFetching state from the store -->
    <div v-if="matchesStore.errorFetching" class="text-center py-4 text-red-600">
      Failed to load matches: {{ matchesStore.errorFetching }}. <br />
      Showing default match data as fallback.
    </div>

    <!-- Display matches -->
    <div class="grid gap-6 mb-6" v-if="!loading && matchesStore.currentMatches.length > 0">
      <div
        v-for="match in matchesStore.currentMatches"
        :key="match.id"
        class="bg-white shadow-md rounded-lg p-4"
      >
        <h2 class="text-xl font-semibold mb-2">{{ match.homeTeam }} vs {{ match.awayTeam }}</h2>
        <p>
          Status: <span class="font-medium">{{ match.status }}</span>
        </p>
        <p>
          Date: <span class="font-medium">{{ formatDate(match.startTimestamp) }}</span>
        </p>
        <p>
          Score: <span class="font-bold">{{ match.homeScore }} - {{ match.awayScore }}</span>
        </p>
        <p v-if="match.aggregateScore !== 'N/A'">
          Aggregate: <span class="font-bold">{{ match.aggregateScore }}</span>
          <span class="text-sm text-gray-600">(After this leg)</span>
        </p>
        <router-link
          :to="{ name: 'MatchDetails', params: { id: match.id } }"
          class="text-blue-500 hover:underline mt-3 inline-block"
        >
          View Details
        </router-link>
      </div>
    </div>

    <!-- Message when no matches are found (and no error occurred) -->
    <div
      v-if="!loading && !matchesStore.errorFetching && matchesStore.currentMatches.length === 0"
      class="text-center py-4 text-gray-500"
    >
      No UEFA Champions League matches found for the selected date.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMatchesStore } from '@/stores/matches'

const matchesStore = useMatchesStore()
const loading = ref(true)
// Removed local error ref, using store's errorFetching instead

onMounted(async () => {
  loading.value = true
  // Fetching logic remains the same, error state is handled by the store
  try {
    await matchesStore.fetchMatches()
  } catch (err) {
    // Catch block might be redundant if store handles all errors, but kept for safety
    console.error('Error during component mount fetch dispatch:', err)
  } finally {
    loading.value = false
  }
})

// ... existing formatDate function ...
const formatDate = (timestamp) => {
  if (!timestamp) return 'Date N/A'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
</script>
