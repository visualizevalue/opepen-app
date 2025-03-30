<template>
  <Menu as="menu" class="dropdown">
    <MenuButton class="trigger">
      <slot name="trigger" />
    </MenuButton>

    <Teleport to="body">
      <MenuItems class="dropdown-items">
        <MenuItem v-for="(item, index) in items" :key="index" v-slot="{ active }">
          <Button
            :disabled="item.disabled"
            :class="{ active }"
            :to="item.to"
            @click="item.onClick"
          >
            <Icon v-if="item.icon" :type="item.icon" />
            <span>{{ item.text }}</span>
          </Button>
        </MenuItem>
      </MenuItems>
    </Teleport>
  </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  classes: String,
})
</script>

<style scoped>
menu {
  padding: 0;
  margin: 0;
  position: relative;
}

.trigger {
  &:--highlight {
    outline: none;
  }
}

.dropdown-items {
  display: grid;
  gap: var(--size-1);
  position: absolute;
  left: 0;
}
</style>
