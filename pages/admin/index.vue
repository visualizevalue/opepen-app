<template>
  <div class="overview">
    <div>
      <StatsOverview #default="{ stats }">
        <div class="stat-group">
          <h1>Curate</h1>
          <div>
            <p>{{ formatNumber(stats.optIns) }}</p>
            <small class="muted">Opt-Ins</small>
          </div>
          <div>
            <p>{{ formatNumber(stats.votes) }}</p>
            <small class="muted">Votes</small>
            <NuxtLink :to="`/curate/view/all`"><span>View Curations</span></NuxtLink>
          </div>
        </div>

        <div class="stat-group">
          <h1>Curators</h1>
          <div>
            <p>{{ formatNumber(stats.users.curators) }}</p>
            <small class="muted">Opters</small>
            <NuxtLink :to="`/curate/nodes/patrons`"><span>View Opters</span></NuxtLink>
          </div>
          <div>
            <p>{{ formatNumber(stats.users.voters) }}</p>
            <small class="muted">Voters</small>
            <NuxtLink :to="`/curate/nodes`"><span>View Voters</span></NuxtLink>
          </div>
        </div>

        <div class="stat-group">
          <h1>Collect</h1>
          <div>
            <p>{{ formatNumber(16000 - stats.revealed.opepen) }}</p>
            <small class="muted">Unrevealed</small>
            <NuxtLink :to="`/collect/buy/unrevealed`"><span>View Listings</span></NuxtLink>
          </div>
          <div>
            <p>{{ formatNumber(stats.revealed.opepen) }}</p>
            <small class="muted">Revealed</small>
            <NuxtLink :to="`/collect/buy/revealed`"><span>View Revealed Listings</span></NuxtLink>
          </div>
        </div>

        <div class="stat-group">
          <h1>Create</h1>
          <div>
            <p>{{ formatNumber(stats.submissions.sets) }}</p>
            <small class="muted">Submissions</small>
            <NuxtLink :to="`/admin/sets`"><span>View Submissions</span></NuxtLink>
          </div>
          <div>
            <p>{{ formatNumber(stats.submissions.images) }}</p>
            <small class="muted">Images</small>
          </div>
        </div>

        <div class="stat-group">
          <h1>Emails</h1>
          <div>
            <p>{{ formatNumber(stats.emails.total) }}</p>
            <small class="muted">Total Emails</small>
          </div>
          <div>
            <p>{{ formatNumber(stats.emails.verified) }}</p>
            <small class="muted">Verified Emails</small>
          </div>
        </div>

        <div class="stat-group">
          <h1>Price</h1>
          <div>
            <p>{{ formatEther(stats.markets.floor.revealed) }} ETH</p>
            <small class="muted">Revealed Price</small>
          </div>
          <div>
            <p>{{ formatEther(stats.markets.floor.unrevealed) }} ETH</p>
            <small class="muted">Unrevealed Price</small>
          </div>
        </div>

        <div class="stat-group">
          <h1>Users</h1>
          <div>
            <p>{{ formatNumber(stats.users.artists) }}</p>
            <small class="muted">Artists</small>
            <NuxtLink :to="`/curate/nodes/artists`"><span>View Artists</span></NuxtLink>
          </div>
          <div>
            <p>{{ formatNumber(stats.users.holders) }}</p>
            <small class="muted">Owners</small>
            <NuxtLink :to="`/curate/nodes/patrons`"><span>View Owners</span></NuxtLink>
          </div>
        </div>
      </StatsOverview>
    </div>
  </div>
</template>

<script setup>
import { formatEther } from 'viem'
import { formatNumber } from '~/helpers/format'
</script>

<style lang="postcss" scoped>
.overview {
  display: grid;
  align-items: flex-start;
  grid-auto-rows: min-content;
}
</style>
