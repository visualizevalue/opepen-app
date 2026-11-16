<template>
  <ul v-if="stats" class="list-group">
    <li>
      <span>Sets complete</span>
      <span class="detail">{{ completeSets.length }} of 200</span>
    </li>
    <li>
      <span>Submissions</span>
      <span class="detail">{{ formatNumber(stats.submissions.sets) }}</span>
    </li>
    <li>
      <span>Artists</span>
      <span class="detail">{{ formatNumber(stats.users.artists) }}</span>
    </li>
    <li>
      <span>Artists in the collection</span>
      <span class="detail">{{ formatNumber(stats.users.permanentArtists) }}</span>
    </li>
    <li>
      <span>Collectors</span>
      <span class="detail">{{ formatNumber(stats.users.holders) }}</span>
    </li>
    <li>
      <span>Voters</span>
      <span class="detail">{{ formatNumber(stats.users.curators) }}</span>
    </li>
    <li>
      <span>Votes cast</span>
      <span class="detail">{{ formatNumber(stats.optIns) }}</span>
    </li>
    <li>
      <span>Tokens burned</span>
      <span class="detail">{{ formatNumber(stats.optOuts.total) }}</span>
    </li>
    <li>
      <span>Sales volume</span>
      <span class="detail">${{ formatNumber(stats.markets.history.totalUSD || 0) }}</span>
    </li>
    <li>
      <span>Days since launch</span>
      <span class="detail">{{ formatNumber(day) }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
const { day, stats } = await useStats()
const { completeSets } = await useSets()
</script>
