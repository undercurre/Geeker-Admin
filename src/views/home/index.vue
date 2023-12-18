<template>
  <div class="w-1/2 h-1/2 card content-box">
    <ECharts ref="lineChart" :option="option" />
  </div>
</template>

<script setup lang="ts" name="lineChart">
import { onMounted, ref } from "vue";
import type { Ref } from "vue";
import { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";
import { getGithubContributions } from "@/api/modules/statistics";
import { Statistics } from "@/api/interface/statistics";

const lineChart = ref<ReturnType<typeof ECharts>>(null);

const option: Ref<ECOption> = ref({
  title: {
    text: "Github-Contributions"
  },
  xAxis: {
    type: "category",
    data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [0, 0, 0, 0, 0, 0, 0],
      type: "line",
      smooth: true
    }
  ]
});

function getxAxis(thisWeek: Statistics.GContribution[]) {
  const defaultXAxis = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const splice = defaultXAxis.splice(thisWeek.length - 1);
  defaultXAxis.unshift(...splice);
  console.log(defaultXAxis);
  return defaultXAxis;
}

function getOptionData(lastWeek: number[], thisWeek: number[]) {
  const splice = lastWeek.slice(thisWeek.length - 1 - 7);
  splice.push(...thisWeek.slice(0, thisWeek.length - 1));
  console.log(splice);
  return splice;
}

onMounted(async () => {
  const res = await getGithubContributions();
  const thisWeek = res.data.data.user.contributionsCollection.contributionCalendar.weeks.slice(-1)[0].contributionDays;
  const lastWeek = res.data.data.user.contributionsCollection.contributionCalendar.weeks.slice(-2, -1)[0].contributionDays;
  if (thisWeek.length < 7) {
    option.value.xAxis.data = getxAxis(thisWeek);
    option.value.series[0].data = getOptionData(
      lastWeek.map(item => item.contributionCount),
      thisWeek.map(item => item.contributionCount)
    );
  } else {
    option.value.series[0].data = thisWeek.map(item => item.contributionCount);
  }
  if (lineChart.value !== null) {
    lineChart.value.draw();
  }
});
</script>

<style scoped lang="scss"></style>
