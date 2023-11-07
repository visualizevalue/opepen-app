<template>
  <ul v-if="links?.length">
    <li v-for="item in parsedLinks">
      <Button :to="item.url" target="_blank" class="small">
        <Icon :type="item.icon" />
        <span class="text"><span class="muted" v-if="item.prefix">{{ item.prefix }}</span>{{ item.name }}</span>
      </Button>
    </li>
  </ul>
</template>

<script setup>
import { validateURI, getMainDomain, getFirstSubpath } from '~/helpers/urls'

const { links } = defineProps({
  links: Array,
})

const ICONS = {
  'x.com': 'x',
  'twitter.com': 'x',
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
    const icon = ICONS[domain] || 'link'

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

<style lang="postcss" scoped>
ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-2);

  @media (--md) {
    gap: var(--size-4);
  }

  .text {
    gap: 0;

    .muted {
      color: var(--gray-z-5);
      transition: all var(--speed);
    }
  }

  .button {
    &:--highlight {
      .text .muted {
        color: var(--color);
      }
    }
  }
}
</style>
