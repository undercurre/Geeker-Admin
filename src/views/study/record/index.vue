<template>
  <div class="bg-#fff">
    <div class="w-full flex justify-between items-center p-10px">
      <span class="leading-30px text-20px pt-10px">做题记录</span>
      <el-button type="primary" @click="refreshMethod"
        ><el-icon><RefreshRight /></el-icon>刷新表格</el-button
      >
    </div>
    <el-table :data="records" style="width: 100%">
      <el-table-column label="Time">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ formatTime(scope.row.created_at) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Question">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ getQuestionName(scope.row.questionId) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Score">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.score }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
import { onMounted, ref } from "vue";
import { queryRecord } from "@/api/modules/userquestionrecord";
import { UserQuestionRecord } from "@/api/interface/userquestionrecord";
import { Question } from "@/api/interface/question";
import { getQuestionList } from "@/api/modules/question";

const questions = ref<Array<Question.Entity>>([]);

const records = ref<Array<UserQuestionRecord.Entity>>([]);

const refreshMethod = async () => {
  const res = await queryRecord();
  records.value = res.data;
  const questionRes = await getQuestionList();
  questions.value = questionRes.data;
};

function formatTime(time: string) {
  return moment(time).format("YYYY-MM-DD hh:mm:ss");
}

function getQuestionName(id: string) {
  const cur = questions.value.find(item => item.id === id);
  if (cur) return cur.hints[0].split(":")[1];
  else return "未知";
}

onMounted(() => {
  refreshMethod();
});
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
