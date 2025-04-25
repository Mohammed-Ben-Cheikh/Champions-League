<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Match Details</h1>

    <div v-if="loading" class="text-center py-4">Loading match details...</div>

    <div v-else-if="match" class="bg-white shadow-md rounded-lg p-6">
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
        <span class="text-sm text-gray-600">(Result after this leg)</span>
      </p>
      <router-link to="/" class="text-blue-500 hover:underline mt-4 inline-block">
        &larr; Back to Matches
      </router-link>
    </div>

    <p v-else class="text-red-500">Match not found.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// Import the correct store
import { useMatchesStore } from '@/stores/matches'

// Get route and store instances
const route = useRoute()
const matchesStore = useMatchesStore()

// Ref for loading state
const loading = ref(true)

// Get match ID from route params
const matchId = computed(() => route.params.id) // Make it computed in case route changes somehow

// Get the match data reactively using computed
const match = computed(() => {
  // Pass the ID as a number if your getMatchById expects it
  return matchesStore.getMatchById(Number(matchId.value))
})

// Fetch data if needed when component mounts
onMounted(async () => {
  loading.value = true
  // Check if matches are loaded AND if the specific match exists
  if (matchesStore.matches.length === 0 || !match.value) {
    try {
      // console.log('Match data not found in store, fetching...');
      await matchesStore.fetchMatches()
    } catch (err) {
      console.error('Failed to fetch matches for details page:', err)
      // Error handling (e.g., show an error message) could be added here
    }
  } else {
    // console.log('Match data found in store.');
  }
  loading.value = false
})

// Helper function to format timestamp (same as in list view)
const formatDate = (timestamp) => {
  if (!timestamp) return 'Date N/A'
  const date = new Date(timestamp * 1000) // Assuming timestamp is in seconds
  return date.toLocaleString(undefined, {
    // Use browser's default locale
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
</script>
