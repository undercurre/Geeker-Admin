<template>
  <div class="card content-box">
    <ECharts :option="option" />
  </div>
</template>

<script setup lang="ts" name="lineChart">
import { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";

const option: ECOption = {
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: "line",
      smooth: true
    }
  ]
};
</script>

<style scoped lang="scss"></style>
