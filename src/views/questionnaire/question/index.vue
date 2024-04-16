<template>
  <div class="bg-#fff">
    <p class="leading-30px text-20px px-10px pt-20px">问题管理</p>
    <div class="w-full flex justify-between items-center p-10px">
      <div>
        <el-button type="primary" @click="handleAdd"
          ><el-icon><Plus /></el-icon>添加</el-button
        >
      </div>
      <el-button type="primary" @click="refreshMethod"
        ><el-icon><RefreshRight /></el-icon>刷新表格</el-button
      >
    </div>
    <el-table
      ref="taskTable"
      :data="filterTableData"
      style="width: 100%"
      :default-sort="{ prop: 'updated_at', order: 'ascending' }"
    >
      <el-table-column label="Name" prop="name" :formatter="contentFormatter" />
      <el-table-column label="Date" prop="date" sortable :formatter="timeFormatter" :sort-orders="['ascending']" />
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Search Title" />
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="opearationType === 'edit' ? 'Question Edit' : 'Question Add'" width="70%">
      <el-form v-show="opearationType === 'edit'" :model="editForm" label-width="240px">
        <el-form-item label="Question content">
          <el-input v-model="editForm.content" />
        </el-form-item>
        <el-form-item label="Question type">
          <el-select v-model="editForm.type" placeholder="Select" size="large" style="width: 240px">
            <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Question options" v-if="editForm.type !== 'fill'">
          <el-transfer
            v-model="editForm.options"
            :data="options"
            :render-content="renderFunc as any"
            :props="{
              key: 'id'
            }"
            :titles="['Source', 'Target']"
            :button-texts="['Cancel', 'Select']"
          />
        </el-form-item>
      </el-form>
      <el-form v-show="opearationType === 'add'" :model="addForm" label-width="240px">
        <el-form-item label="Question content">
          <el-input v-model="addForm.content" />
        </el-form-item>
        <el-form-item label="Question type">
          <el-select v-model="addForm.type" placeholder="Select" size="large" style="width: 240px">
            <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Question options" v-if="addForm.type !== 'fill'">
          <el-transfer
            v-model="addForm.options"
            :data="options"
            :props="{
              key: 'id'
            }"
            :render-content="renderFunc as any"
            :titles="['Source', 'Target']"
            :button-texts="['Cancel', 'Select']"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submit"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
import { ElTable } from "element-plus";
import { createQuestions, delQuestions, getQuestions, updateQuestions } from "@/api/modules/naireQuestion";
import { VNode, VNodeProps, computed, nextTick, onMounted, reactive, ref } from "vue";
import { QuestionData } from "@/api/modules/naireQuestion";
import { OptionData, getOptions } from "@/api/modules/option";

const questions = ref<Array<QuestionData>>([]);
const options = ref<Array<OptionData>>([]);

const questionsTable = ref<InstanceType<typeof ElTable> | null>(null);

const opearationType = ref("add");

const dialogVisible = ref(false);

const search = ref("");

const searchDate = ref("");

searchDate.value = moment(new Date()).format("YYYY-MM-DD");

const filterTableData = computed(() =>
  questions.value.filter(data => !search.value || data.attributes.content.toLowerCase().includes(search.value.toLowerCase()))
);

type QuestionForm = { content: string; type: "fill" | "single" | "multiple"; options: number[] };

const typeOptions = ["fill", "single", "multiple"];

const renderFunc = (h: (type: string, props: VNodeProps | null, children?: string) => VNode, option: OptionData) => {
  return h("span", null, option.attributes.content);
};

let addForm = reactive<QuestionForm>({
  content: "",
  type: "fill",
  options: []
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let editId: number = -1;

let editForm = reactive<QuestionForm>({
  content: "",
  type: "fill",
  options: []
});

const resetForm = () => {
  addForm = reactive<QuestionForm>({
    content: "",
    type: "fill",
    options: []
  });

  editForm = reactive<QuestionForm>({
    content: "",
    type: "fill",
    options: []
  });
};

const handleAdd = () => {
  dialogVisible.value = true;
  opearationType.value = "add";
};

const handleEdit = (index: number, row: QuestionData) => {
  dialogVisible.value = true;
  editId = row.id;
  editForm = reactive({
    content: row.attributes.content,
    type: row.attributes.type,
    options: row.attributes.options.data.map(item => item.id)
  });
  console.log(index, row);
  opearationType.value = "edit";
};

async function submit() {
  if (opearationType.value === "edit") {
    await updateQuestions(editId, editForm);
  } else {
    await createQuestions(addForm);
  }
  resetForm();
  dialogVisible.value = false;
  refreshMethod();
}

const handleDelete = async (index: number, row: QuestionData) => {
  await delQuestions(row.id);
  refreshMethod();
};

const refreshMethod = async () => {
  const qres = await getQuestions();
  questions.value = qres.data.data;
  const ores = await getOptions();
  options.value = ores.data.data;
  console.log(questions.value);
  await nextTick();
  questionsTable.value?.sort("updated_at", "ascending");
};

const timeFormatter = (row: QuestionData) => {
  // 获取当前年份
  const currentYear = moment().year();
  return moment(row.attributes.createdAt.slice(0, 10)).year(currentYear).format("YYYY-MM-DD");
};

const contentFormatter = (row: QuestionData) => {
  return row.attributes.content;
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
