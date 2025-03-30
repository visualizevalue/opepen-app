<template>
  <ul v-if="links?.length || alwaysShow">
    <li v-for="item in parsedLinks">
      <Button :to="item.url" target="_blank" :class="[size]">
        <Icon :type="item.icon" />
        <span class="text">
          <span class="muted" v-if="item.prefix">{{ item.prefix }}</span>
          {{ item.name }}
        </span>
      </Button>
    </li>

    <slot name="last" />
  </ul>
</template>

<script setup>
const { links } = defineProps({
  links: Array,
  alwaysShow: Boolean,
  size: {
    type: String,
    default: 'small',
  },
})

const ICONS = {
  'x.com': 'x.com',
  'twitter.com': 'x.com',
  'superrare.com': 'superrare',
  'warpcast.com': 'farcaster',
}

const NAME_EXTRACTORS = {
  'x.com': getFirstSubpath,
  'twitter.com': getFirstSubpath,
  'superrare.com': getFirstSubpath,
  'warpcast.com': getFirstSubpath,
}

const parsedLinks = computed(() => {
  const items = []

  for (const link of links) {
    const url = validateURI(link)
    const domain = getMainDomain(url)
    const icon = ICONS[domain] || 'globe'

    const name = NAME_EXTRACTORS[domain] ? NAME_EXTRACTORS[domain](url) : domain
    const prefix = NAME_EXTRACTORS[domain] ? `@` : ``

    items.push({
      icon,
      prefix,
      url,
      name,
    })
  }

  return items
})
</script>

<style scoped>
ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacer-sm);

  @media (--md) {
    gap: var(--size-3);
  }

  .text {
    gap: 0;

    .muted {
      color: var(--gray-z-5);
      transition: all var(--speed);
    }
  }

  :deep(.button) {
    .icon {
      color: var(--gray-z-5);
      transition: color var(--speed);
    }

    &:--highlight {
      .icon {
        color: var(--color);
      }

      .text .muted {
        color: var(--color);
      }
    }
  }
}
</style>
