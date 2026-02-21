<template>
  <div class="collapsible-section" :class="{ open: isOpen, [status]: true }">
    <button type="button" class="section-header" @click="toggle">
      <div class="header-content">
        <Icon :type="icon" class="section-icon" />
        <span class="section-title">{{ title }}</span>
        <span v-if="status === 'complete'" class="status-badge complete">
          <Icon type="check-circle" />
        </span>
        <span v-else-if="status === 'incomplete'" class="status-badge incomplete">
          <Icon type="alert-circle" />
        </span>
        <span v-else-if="status === 'optional'" class="status-badge optional">Optional</span>
      </div>
      <Icon :type="isOpen ? 'chevron-up' : 'chevron-down'" class="chevron" />
    </button>

    <div v-if="isOpen" class="section-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'file',
  },
  status: {
    type: String,
    default: 'incomplete', // 'complete', 'incomplete', 'optional'
  },
})

const emit = defineEmits(['update:open', 'click'])

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const toggle = () => {
  isOpen.value = !isOpen.value
  emit('click')
}
</script>

<style scoped>
.collapsible-section {
  border: var(--border);
  border-radius: var(--border-radius);
  background: var(--gray-z-0);
  transition: all var(--speed);

  &.complete {
    border-color: var(--success);
  }

  &.incomplete {
    border-color: var(--warning);
  }

  &.open {
    box-shadow: var(--shadow);
  }
}

.section-header {
  @mixin button-reset;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacer);
  padding: var(--spacer);
  cursor: pointer;
  transition: background var(--speed);

  &:hover {
    background: var(--gray-z-1);
  }
}

.header-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);
}

.section-icon {
  width: var(--size-5);
  height: var(--size-5);
  color: var(--gray-z-5);
  flex-shrink: 0;
}

.section-title {
  @mixin ui-font;
  font-weight: 600;
  font-size: var(--font-md);
  color: var(--color);
  text-align: left;
}

.status-badge {
  @mixin ui-font;
  font-size: var(--font-xs);
  display: flex;
  align-items: center;
  gap: var(--spacer-xs);
  margin-left: auto;
  padding: var(--spacer-xs) var(--spacer-sm);
  border-radius: var(--border-radius);

  :deep(svg) {
    width: var(--size-4);
    height: var(--size-4);
  }

  &.complete {
    color: var(--success);
    background: var(--success-bg, rgba(var(--success-rgb), 0.1));
  }

  &.incomplete {
    color: var(--warning);
    background: var(--warning-bg, rgba(var(--warning-rgb), 0.1));
  }

  &.optional {
    color: var(--muted);
    background: var(--gray-z-2);
  }
}

.chevron {
  width: var(--size-5);
  height: var(--size-5);
  color: var(--muted);
  flex-shrink: 0;
  transition: transform var(--speed);
}

.section-content {
  padding: var(--spacer);
  border-top: var(--border);
  display: flex;
  flex-direction: column;
  gap: var(--spacer);
}
</style>
