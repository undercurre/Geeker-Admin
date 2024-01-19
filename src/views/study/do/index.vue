<template>
  <div class="bg-#fff w-full min-h-full">
    <p class="leading-30px text-20px px-10px pt-20px">今日必做</p>
    <div class="w-full flex justify-between items-center p-10px">
      <el-button type="primary" @click="handleAdd"
        ><el-icon><Plus /></el-icon>加码</el-button
      >
      <el-button type="primary" @click="refreshMethod"
        ><el-icon><RefreshRight /></el-icon>刷新表格</el-button
      >
    </div>
    <div class="flex w-full h-full">
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

      <div class="w-full">
        <p class="mb-10px">
          <span class="text-20px">Content：</span><span class="text-16px">{{ doingItem.content }}</span>
        </p>

        <div v-show="doingHints.length">
          <span class="block text-20px">Hints：</span>
          <p class="indent-16" v-for="item in doingHints" :key="item">{{ item }}</p>
        </div>
        <div class="w-full flex">
          <div class="w-1/2">
            <p class="indent-2">提示区：</p>
            <iframe :srcdoc="doingCode" class="w-full h-500px" frameborder="0"></iframe>
          </div>
          <div class="w-1/2">
            <p class="indent-2">预览区：</p>
            <iframe :srcdoc="previewCode" class="w-full h-500px" frameborder="0"></iframe>
          </div>
        </div>

        <monacoEditor
          v-model="previewCode"
          :language="language"
          :hight-change="hightChange"
          :read-only="false"
          width="70%"
          height="100%"
          @editor-mounted="editorMounted"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Question } from "@/api/interface/question";
import { getQuestionList } from "@/api/modules/question";
import { computed, onMounted, ref, watch } from "vue";
import monacoEditor from "@/components/CodeEditBox/index.vue";
const language = ref("html");

const hightChange = ref<boolean>(false);

const editorMounted = (editor: any) => {
  console.log("editor实例加载完成", editor);
};

const questions = ref<Array<Question.Entity>>([]);

const search = ref("");

const doingId = ref("");

const filterTableData = computed(() =>
  questions.value.filter(data => !search.value || data.content.toLowerCase().includes(search.value.toLowerCase()))
);

const doingItem = computed(() => {
  const temp = questions.value.find(item => item.id === doingId.value);
  return temp
    ? temp
    : {
        id: "",
        content: "内容缺失",
        options: [""],
        correctAnswer: "",
        difficulty: 10,
        hints: [""],
        created_at: new Date(),
        updated_at: new Date()
      };
});

const doingHints = computed(() => {
  const temp = questions.value.find(item => item.id === doingId.value);

  return temp
    ? temp.hints.filter(item => !item.includes("Title") && !item.includes("Code") && !item.includes("Preview"))
    : ["数据缺失"];
});

const doingCode = computed(() => {
  const temp = questions.value.find(item => item.id === doingId.value);
  if (!temp)
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Grid Center Demo</title>
    <style>
      .parent {
        display: grid;
        place-items: center;
        height: 100vh;
        border: 1px solid #ccc;
      }
      .content {
        background-color: red;
        padding: 20px;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="parent">
      <div class="content">
        <h1>Error!</h1>
      </div>
    </div>
  </body>
</html>
`;
  const code = temp.hints.find(item => item.includes("Code"));
  if (code) {
    console.log(code.split("Code:")[1]);
    return code.split("Code:")[1];
  } else
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Grid Center Demo</title>
    <style>
      .parent {
        display: grid;
        place-items: center;
        height: 100vh;
        border: 1px solid #ccc;
      }
      .content {
        background-color: red;
        padding: 20px;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="parent">
      <div class="content">
        <h1>Error!</h1>
      </div>
    </div>
  </body>
</html>
`;
});

const previewCode = ref(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Grid Center Demo</title>
    <style>
      .parent {
        display: grid;
        place-items: center;
        height: 100vh;
        border: 1px solid #ccc;
      }
      .content {
        background-color: orange;
        padding: 20px;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="parent">
      <div class="content">
        <h1>Null!</h1>
      </div>
    </div>
  </body>
</html>
`);

watch(doingId, newVal => {
  const temp = questions.value.find(item => item.id === newVal);
  if (temp) {
    const preview = temp.hints.find(item => item.includes("Preview"));
    if (preview) previewCode.value = preview.split("Preview:")[1];
  }
});

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
