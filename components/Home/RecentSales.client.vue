<template>
  <section v-if="sales.length" class="recent-sales">
    <header>
      <SectionTitle>Recent Sales</SectionTitle>
    </header>

    <ul class="feed">
      <li v-for="sale in sales" :key="sale.id">
        <NuxtLink :to="`/opepen/${sale.token_id}`" class="sale">
          <Image v-if="sale.opepen?.image" :image="sale.opepen.image" :aspect-ratio="1" class="thumb" />
          <span v-else class="thumb placeholder" />

          <span class="info">
            <span class="name">
              #{{ sale.token_id }}
              <small v-if="sale.opepen?.set?.submission?.name">
                · {{ sale.opepen.set.submission.name }}
              </small>
            </span>
            <span class="time">{{ timeAgo(sale.timestamp) }}</span>
          </span>

          <span class="price">
            <span class="eth">{{ priceEth(sale) }} Ξ</span>
            <small v-if="sale.data?.price?.usd" class="usd">
              ${{ formatNumber(Math.round(Number(sale.data.price.usd))) }}
            </small>
          </span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup>
const { sales } = useRecentSales(8)

const priceEth = (sale) => {
  const eth = sale?.data?.price?.eth
  if (eth) return Number(eth).toFixed(2)
  return sale?.value ? (Number(sale.value) / 1e18).toFixed(2) : '0'
}

const timeAgo = (iso) => {
  try {
    return DateTime.fromISO(iso).toRelative({ style: 'short' })
  } catch (e) {
    return ''
  }
}
</script>

<style scoped>
.recent-sales {
  display: grid;
  gap: var(--spacer);
}

.feed {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--size-1);
}

.sale {
  display: grid;
  grid-template-columns: var(--size-8) 1fr auto;
  align-items: center;
  gap: var(--spacer);
  padding: var(--size-2);
  border: 0;
  border-radius: var(--size-2);
  text-decoration: none;
  transition: background var(--speed);

  &:hover {
    background: var(--gray-z-1);
  }
}

.thumb {
  width: var(--size-8);
  height: var(--size-8);
  border-radius: var(--size-1);
  overflow: hidden;

  &.placeholder {
    background: var(--gray-z-2);
  }
}

.info {
  display: grid;
  gap: 2px;
  min-width: 0;

  .name {
    @mixin ui-font;
    color: var(--color);

    small {
      color: var(--muted);
    }
  }

  .time {
    font-size: var(--font-xs);
    color: var(--gray-z-6);
  }
}

.price {
  text-align: right;
  display: grid;
  gap: 2px;

  .eth {
    @mixin ui-font;
    color: var(--color);
    font-variant-numeric: tabular-nums;
  }

  .usd {
    font-size: var(--font-xs);
    color: var(--gray-z-6);
  }
}
</style>
