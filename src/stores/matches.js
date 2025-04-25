import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = (today.getMonth() + 1).toString().padStart(2, '0') // Months are 0-indexed
  const day = today.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const useMatchesStore = defineStore('matches', () => {
  const matches = ref([])
  const currentPage = ref(1)
  const matchesPerPage = 2 // Matches displayed per page
  const errorFetching = ref(null) // To store potential fetch errors
  const selectedDate = ref(getTodayDateString()) // Initialize with today's date

  // Function to fetch matches from the Sofascore API for a specific date
  const fetchMatches = async (date) => {
    // Update selectedDate if a new date is provided
    if (date) {
      selectedDate.value = date
    }
    const dateToFetch = selectedDate.value // Use the stored selected date

    errorFetching.value = null // Reset error state
    matches.value = [] // Clear previous matches
    currentPage.value = 1 // Reset pagination

    try {
      // Use the provided date in the API call
      const response = await fetch(
        `https://api.sofascore.com/api/v1/sport/football/scheduled-events/${dateToFetch}`,
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      if (!data || !Array.isArray(data.events)) {
        console.error('API did not return events array:', data)
        throw new Error('Invalid API response format')
      }

      matches.value = data.events
        .filter((event) => event.tournament?.uniqueTournament?.name === 'UEFA Champions League')
        .map((event) => {
          const homeScoreAgg = event.homeScore?.aggregated
          const awayScoreAgg = event.awayScore?.aggregated
          const hasAggregate = typeof homeScoreAgg === 'number' && typeof awayScoreAgg === 'number'

          return {
            id: event.id,
            homeTeam: event.homeTeam?.name ?? 'N/A',
            awayTeam: event.awayTeam?.name ?? 'N/A',
            homeScore: event.homeScore?.current ?? 'N/A',
            awayScore: event.awayScore?.current ?? 'N/A',
            aggregateScore: hasAggregate ? `${homeScoreAgg}-${awayScoreAgg}` : 'N/A',
            status: event.status?.description ?? 'Scheduled',
            startTimestamp: event.startTimestamp ?? null,
          }
        })
    } catch (error) {
      console.error('Error fetching matches:', error)
      errorFetching.value = error.message || 'Failed to fetch matches' // Store the error message
      // Clear matches on error, don't show fallback data for a specific date request
      matches.value = []
      currentPage.value = 1 // Ensure pagination is reset
    }
  }

  // Pagination logic
  const totalPages = computed(() => {
    if (!matches.value || matches.value.length === 0) return 0
    return Math.ceil(matches.value.length / matchesPerPage)
  })

  const currentMatches = computed(() => {
    if (!matches.value) return []
    const start = (currentPage.value - 1) * matchesPerPage
    return matches.value.slice(start, start + matchesPerPage)
  })

  const setPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  // Get match by ID
  const getMatchById = (id) => {
    if (!matches.value) return undefined
    const numericId = Number(id)
    return matches.value.find((match) => match.id === numericId)
  }

  // Return state, getters, and actions
  return {
    matches,
    currentPage,
    selectedDate, // Expose selectedDate
    errorFetching,
    fetchMatches,
    currentMatches,
    totalPages,
    setPage,
    getMatchById,
  }
})
