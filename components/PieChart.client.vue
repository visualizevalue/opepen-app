<template>
  <Pie
    v-if="type === 'Pie'"
    :data="data" :options="options"
  />
  <Doughnut
    v-else-if="type === 'Doughnut'"
    :data="data" :options="options"
  />
</template>

<script setup>
import { Chart as ChartJS, ArcElement } from 'chart.js'
import { Doughnut, Pie } from 'vue-chartjs'

const props = defineProps({
  type: {
    type: String,
    default: 'Pie',
  },
  onHover: {
    type: Function,
    default: () => null,
  },
  onClick: {
    type: Function,
    default: () => null,
  },
  data: {
    type: Object,
    default: () => ({
      labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
      datasets: [
        {
          data: [40, 20, 80, 10]
        }
      ]
    })
  }
})

ChartJS.register(ArcElement)

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  animation: false,
  borderWidth: 1,
  borderColor: borderColor.value,
  backgroundColor: Z_COLORS.value.grayZ2,
  onHover: props.onHover,
  onClick: props.onClick,
  // plugins: {
  //   tooltip: {
  //     cornerRadius: {
  //       topLeft: 2,
  //       topRight: 8,
  //       bottomRight: 8,
  //       bottomLeft: 8,
  //     },
  //     // position: 'nearest',
  //     position: 'average',
  //     padding: 10,
  //     titleColor: Z_COLORS.value.grayZ9,
  //     titleMarginBottom: 0,
  //     bodyColor: Z_COLORS.value.grayZ8,
  //     backgroundColor: Z_COLORS.value.grayZ1,
  //     borderColor: borderColor.value,
  //     borderWidth: 1,
  //     caretSize: 0,
  //     displayColors: false,
  //     // This more specific font property overrides the global property
  //     titleFont: {
  //       family: 'Carbon',
  //       size: 14
  //     },
  //     bodyFont: {
  //       family: 'Carbon',
  //       size: 14
  //     },
  //   }
  // }
}))
</script>
