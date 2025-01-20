<template>
  <Popover class="dropdown">
    <PopoverButton as="div">
      <button ref="trigger" class="trigger unstyled">
        <slot name="trigger" />
      </button>
    </PopoverButton>

    <Teleport to="body">
      <PopoverPanel
        class="dropdown-panel"
        :style="panelStyle"
        v-slot="{ close }"
      >
        <div class="dropdown-items">
          <PopoverButton
            v-for="(item, index) in items"
            :key="index"
            :disabled="item.disabled"
            :to="item.to"
            @click="item.onClick"
            class="button option"
          >
            <Icon v-if="item.icon" :type="item.icon" />
            <span>{{ item.text }}</span>
          </PopoverButton>
          <slot name="content" :close="close" />
        </div>
      </PopoverPanel>
    </Teleport>
  </Popover>
</template>

<script setup>
import { useElementBounding, useWindowSize } from '@vueuse/core'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import Button from '@vv/components/Button.vue'

const { align, xOffset } = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  align: {
    type: String,
    default: 'left',
  },
  xOffset: {
    type: Number,
    default: 8,
  },
})

const trigger = ref()
const { x, y, right, width, height } = useElementBounding(trigger)
const { width: windowWidth } = useWindowSize()

const panelStyle = computed(() => {
  const pos = {
    top: `${y.value + height.value}px`,
  }

  if (align === 'left') {
    pos.left = `${x.value - xOffset}px`
  } else {
    pos.right = `${windowWidth.value - right.value - xOffset}px`
  }

  return pos
})
</script>

<style>
.dropdown {
  padding: 0;
  margin: 0;
  position: relative;

  > .trigger {
    &:--highlight {
      outline: none;
    }
  }
}

.dropdown-panel {
  display: grid;
  z-index: var(--z-index-dialog);
  position: absolute;

  background: var(--gray-z-1);
  border: var(--border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);

  .dropdown-items {
    display: grid;
  }

  .option {
    border-radius: 0;
  }

  .option:first-of-type {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);

    &:--highlight {
      border-top-left-radius: var(--border-radius);
      border-top-right-radius: var(--border-radius);
    }
  }

  .option:last-of-type {
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);

    &:--highlight {
      border-bottom-left-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
    }
  }

  .button {
    border: 0;
    background: transparent;
    width: 100%;

    &:--highlight {
      background: var(--gray-z-2);
    }

    .icon {
      color: var(--gray-z-5);
    }

    span {
      display: block;
      height: 1em;
      width: 100%;
      text-align: left;
    }
  }
}
</style>
