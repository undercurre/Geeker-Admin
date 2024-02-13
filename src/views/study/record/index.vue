<template>
  <div class="bg-#fff">
    <div class="w-full flex justify-between items-center p-10px">
      <span class="leading-30px text-20px pt-10px">做题记录</span>
      <el-button type="primary" @click="refreshMethod"
        ><el-icon><RefreshRight /></el-icon>刷新表格</el-button
      >
    </div>
    <div class="h-80vh">
      <el-table :data="records" style="width: 100%" height="100%">
        <el-table-column label="Time">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span>{{ formatTime(scope.row.created_at) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Question" :filters="questionFilter()" :filter-method="questionFilterHandler">
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
        <el-table-column label="isCorrect">
          <template #default="scope">
            <div style="display: flex; align-items: center" @click.capture="updateRecordSwitchTouch(scope.$index, scope.row)">
              <el-switch
                v-model="scope.row.isCorrect"
                class="ml-2"
                style="

--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                @change="updateRecordSwitch"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template #default="scope">
            <el-button size="small" @click="openDetail(scope.$index, scope.row)">Detail</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogVisible" title="回答详情" width="60%">
      <div v-html="diffHTML"></div>
    </el-dialog>
  </div>
</template>

<script lang="tsx" setup>
import moment from "moment";
import { onMounted, ref, watchEffect } from "vue";
import { queryRecord, updateRecord } from "@/api/modules/userquestionrecord";
import { UserQuestionRecord } from "@/api/interface/userquestionrecord";
import { Question } from "@/api/interface/question";
import { getQuestionList } from "@/api/modules/question";
import { Change, diffChars } from "diff";

const dialogVisible = ref(false);

const diffHTML = ref("");

const detail = ref<UserQuestionRecord.Entity>({
  id: "",
  userId: "",
  questionId: "",
  userAnswer: "",
  isCorrect: false,
  score: 0,
  startTime: new Date(),
  endTime: new Date(),
  created_at: new Date()
});

const openDetail = (index: number, row: UserQuestionRecord.Entity) => {
  dialogVisible.value = true;
  detail.value = row;
};

const updateRecordSwitchTouch = (index: number, row: UserQuestionRecord.Entity) => {
  detail.value = row;
};

const updateRecordSwitch = (val: boolean | string | number) => {
  updateRecord({ id: detail.value.id, isCorrect: val ? true : false });
};

const questions = ref<Array<Question.Entity>>([]);

const records = ref<Array<UserQuestionRecord.Entity>>([]);

const refreshMethod = async () => {
  const res = await queryRecord();
  records.value = res.data.reverse();
  const questionRes = await getQuestionList();
  questions.value = questionRes.data;
};

function formatTime(time: string) {
  return moment(time).format("YYYY-MM-DD hh:mm:ss");
}

function getQuestionName(id: string) {
  const cur = questions.value.find(item => item.id === id);
  if (cur) return cur.content;
  else return "未知";
}

function questionFilter() {
  const set = new Set(records.value.map(item => item.questionId));
  const sort = [...set];

  return sort.map(item => {
    return {
      text: getQuestionName(item),
      value: item
    };
  });
}

const questionFilterHandler = (value: string, row: UserQuestionRecord.Entity) => {
  return row.questionId === value;
};

onMounted(() => {
  refreshMethod();
});

watchEffect(() => {
  diffHTML.value = "";
  const question = questions.value.find(item => item.id === detail.value.questionId);
  if (question) {
    const differences: Change[] = diffChars(question.correctAnswer, detail.value.userAnswer);
    const diffResult = differences
      .map(change => {
        if (change.added) {
          return `**+${change.value}`;
        } else if (change.removed) {
          return `**-${change.value}`;
        } else {
          return ` ${change.value}`;
        }
      })
      .join("")
      .replace(/ /g, "&nbsp;");
    const lines = diffResult.split("\n");
    lines.map(item => {
      if (item.includes("**+")) diffHTML.value += "<p style='background-color: lightgreen;'>" + item + "</p>";
      if (item.includes("**-")) diffHTML.value += "<p style='background-color: pink;'>" + item + "</p>";
      if (!item.includes("**+") && !item.includes("**-")) diffHTML.value += "<p>" + item + "</p>";
    });
  }
});
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
