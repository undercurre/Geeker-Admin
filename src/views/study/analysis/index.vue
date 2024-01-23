<template>
  <div class="dataVisualize-box">
    <div class="card top-box">
      <div class="top-title">做题分析</div>
      <div class="top-content">
        <el-row :gutter="40">
          <el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="item-left sle">
              <span class="left-title">做题总量</span>
              <div class="img-box">
                <img src="./images/book-sum.png" alt="" />
              </div>
              <span class="left-number">{{ records.length }}</span>
            </div>
          </el-col>
          <el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-center">
              <div class="gitee-traffic traffic-box">
                <div class="traffic-img">
                  <img src="./images/success.svg" alt="" />
                </div>
                <span class="item-value">{{ successRecords.length }}</span>
                <span class="traffic-name sle">训练成功</span>
              </div>
              <div class="gitHub-traffic traffic-box">
                <div class="traffic-img">
                  <img src="./images/error.svg" alt="" />
                </div>
                <span class="item-value">{{ failRecords.length }}</span>
                <span class="traffic-name sle">训练失败</span>
              </div>
              <div class="today-traffic traffic-box">
                <div class="traffic-img">
                  <img src="./images/today.png" alt="" />
                </div>
                <span class="item-value">{{ todayRecords.length }}</span>
                <span class="traffic-name sle">今日训练量</span>
              </div>
              <div class="yesterday-traffic traffic-box">
                <div class="traffic-img">
                  <img src="./images/book_sum.png" alt="" />
                </div>
                <span class="item-value">{{ yesterdayRecords.length }}</span>
                <span class="traffic-name sle">昨日训练量</span>
              </div>
            </div>
          </el-col>
          <el-col class="mb40" :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
            <div class="item-right">
              <div class="echarts-title">训练占比</div>
              <div class="book-echarts">
                <Pie ref="pieRef" />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="dataVisualize">
import moment from "moment";
import { ref, onMounted, computed } from "vue";
import Pie from "./components/pie.vue";
import { UserQuestionRecord } from "@/api/interface/userquestionrecord";
import { Question } from "@/api/interface/question";
import { queryRecord } from "@/api/modules/userquestionrecord";
import { getQuestionList } from "@/api/modules/question";

const pieRef = ref();

const questions = ref<Array<Question.Entity>>([]);

const records = ref<Array<UserQuestionRecord.Entity>>([]);

const successRecords = computed(() => {
  return records.value.filter(item => item.score >= 90);
});

const failRecords = computed(() => {
  return records.value.filter(item => item.score < 90);
});

const todayRecords = computed(() => {
  const todayDate = new Date();
  return records.value.filter(
    item => moment(new Date(item.created_at)).format("YYYY-MM-DD") === moment(todayDate).format("YYYY-MM-DD")
  );
});

const yesterdayRecords = computed(() => {
  return records.value.filter(
    item => moment(new Date(item.created_at)).format("YYYY-MM-DD") === moment(new Date()).subtract(1, "days").format("YYYY-MM-DD")
  );
});

const doneQuestion = computed(() => {
  return questions.value.filter(item => records.value.map(record => record.questionId).includes(item.id));
});

const undoQuestion = computed(() => {
  return questions.value.filter(item => !records.value.map(record => record.questionId).includes(item.id));
});

const pieData = ref([
  { value: 0, name: "已训练" },
  { value: 0, name: "未训练" }
]);

onMounted(async () => {
  const res = await queryRecord();
  records.value = res.data;
  const questionRes = await getQuestionList();
  questions.value = questionRes.data;
  console.log(doneQuestion, undoQuestion);
  pieData.value[0].value = doneQuestion.value.length;
  pieData.value[1].value = undoQuestion.value.length;
  pieRef.value.initChart(pieData.value);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
