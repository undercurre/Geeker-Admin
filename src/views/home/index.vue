<template>
  <div class="w-full h-full flex">
    <el-card shadow="always" class="w-1/2">
      <div>
        <el-text class="mx-1" type="primary">
          <span>🧑‍💼Today is </span>
          <span class="text-20px">{{ moment().format("dddd") }}</span>
        </el-text>
      </div>
      <el-text class="mx-1" type="danger">
        <span>📝Tasks have been </span>
        <span class="text-20px">Completed</span>
      </el-text>
      <el-rate v-model="computedTask" :max="todayTasks.length" :colors="rateColors" text-color="#ff9900" disabled></el-rate>
    </el-card>
    <div class="w-1/2 h-1/2 ml-10px card content-box">
      <ECharts ref="lineChart" :option="option" />
    </div>
  </div>
</template>

<script setup lang="ts" name="lineChart">
import { onMounted, ref } from "vue";
import moment from "moment";
import type { Ref } from "vue";
import { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";
import { getGithubContributions } from "@/api/modules/statistics";
import { Statistics } from "@/api/interface/statistics";
import { getTaskListByUser } from "@/api/modules/task";
import { Task } from "@/api/interface/task";
import { sendMsg } from "@/utils/AI/xinghuo";

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

async function drawContribution() {
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
}

const tasks = ref<Array<Task.Entity>>([]);

const computedTask = ref(4);

const todayTasks = ref<Array<Task.Entity>>([]);

const rateColors = ref(["#99A9BF", "#F7BA2A", "#FF9900"]);

async function generateTaskInShortToday() {
  const res = await getTaskListByUser({
    due_date: moment(new Date()).format("YYYY-MM-DD")
  });

  tasks.value = res.data;
  computedTask.value = tasks.value.filter(
    item => item.due_date === moment(new Date()).format("YYYY-MM-DD") && item.status === "Done"
  ).length;

  todayTasks.value = tasks.value.filter(item => item.due_date === moment(new Date()).format("YYYY-MM-DD"));
}

const AI = ref("");

// const promte = ``;

onMounted(async () => {
  drawContribution();
  generateTaskInShortToday();
  sendMsg("", (err, res) => {
    if (!err) {
      AI.value = res;
    }
  });
});
</script>

<style scoped lang="scss"></style>
