<template>
  <div class="bg-#fff">
    <p class="leading-30px text-20px px-10px pt-20px">今日必做</p>
    <div class="w-full flex justify-between items-center p-10px">
      <el-button type="primary" @click="handleAdd"
        ><el-icon><Plus /></el-icon>加码</el-button
      >
      <el-button type="primary" @click="refreshMethod"
        ><el-icon><RefreshRight /></el-icon>刷新表格</el-button
      >
    </div>
    <el-table :data="filterTableData" style="width: 20%">
      <el-table-column label="Keyword">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.hints[0].split(":")[1] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Search Name" />
        </template>
        <template #default="scope">
          <el-button size="small" @click="handle2Do(scope.$index, scope.row)">Do</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <monacoEditor
        v-model="value"
        :language="language"
        :hight-change="hightChange"
        :read-only="false"
        width="100%"
        height="100%"
        @editor-mounted="editorMounted"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Question } from "@/api/interface/question";
import { getQuestionList } from "@/api/modules/question";
import { computed, onMounted, ref } from "vue";
import monacoEditor from "@/components/CodeEditBox/index.vue";

const value = ref("-- select * from infrastructure;");
const language = ref("sql");
const hightChange = ref<any>(false);
const editorMounted = (editor: any) => {
  console.log("editor实例加载完成", editor);
};

const questions = ref<Array<Question.Entity>>([]);

const search = ref("");

const doingId = ref("");

const filterTableData = computed(() =>
  questions.value.filter(data => !search.value || data.content.toLowerCase().includes(search.value.toLowerCase()))
);

const handleAdd = () => {
  // 增加题目
};

const handle2Do = (index: number, row: Question.Entity) => {
  doingId.value = row.id;
};

// async function submit() {
//   refreshMethod();
// }

const refreshMethod = async () => {
  const res = await getQuestionList();
  questions.value = res.data;
};

onMounted(() => {
  refreshMethod();
});
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
