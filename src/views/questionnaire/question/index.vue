<template>
  <div class="bg-#fff">
    <p class="leading-30px text-20px px-10px pt-20px">问卷管理</p>
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
      <el-table-column label="Name" prop="name" :formatter="nameFormatter" />
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

    <el-dialog
      v-model="dialogVisible"
      :title="opearationType === 'edit' ? 'Questionnaire Edit' : 'Questionnaire Add'"
      width="50%"
    >
      <el-form v-show="opearationType === 'edit'" :model="editForm" label-width="240px">
        <el-form-item label="Questionnaires Name">
          <el-input v-model="editForm.name" />
        </el-form-item>
      </el-form>
      <el-form v-show="opearationType === 'add'" :model="addForm" label-width="240px">
        <el-form-item label="Questionnaires Name">
          <el-input v-model="addForm.name" />
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
import {
  createQuestionnaires,
  delQuestionnaires,
  getQuestionnaires,
  QuestionnaireData,
  updateQuestionnaires
} from "@/api/modules/questionnaire";
import { computed, nextTick, onMounted, reactive, ref } from "vue";

const questionnaires = ref<Array<QuestionnaireData>>([]);

const questionnairesTable = ref<InstanceType<typeof ElTable> | null>(null);

const opearationType = ref("add");

const dialogVisible = ref(false);

const search = ref("");

const searchDate = ref("");

searchDate.value = moment(new Date()).format("YYYY-MM-DD");

const filterTableData = computed(() =>
  questionnaires.value.filter(data => !search.value || data.attributes.name.toLowerCase().includes(search.value.toLowerCase()))
);

type QuestionnaireForm = { name: string; questions: Array<number> };

let addForm = reactive<QuestionnaireForm>({
  name: "",
  questions: []
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let editId: number = -1;

let editForm = reactive<QuestionnaireForm>({
  name: "",
  questions: []
});

const resetForm = () => {
  addForm = reactive<QuestionnaireForm>({
    name: "",
    questions: []
  });

  editForm = reactive<QuestionnaireForm>({
    name: "",
    questions: []
  });
};

const handleAdd = () => {
  dialogVisible.value = true;
  opearationType.value = "add";
};

const handleEdit = (index: number, row: QuestionnaireData) => {
  dialogVisible.value = true;
  editId = row.id;
  editForm = reactive({
    name: row.attributes.name,
    questions: []
  });
  console.log(index, row);
  opearationType.value = "edit";
};

async function submit() {
  if (opearationType.value === "edit") {
    await updateQuestionnaires(editId, editForm);
  } else {
    await createQuestionnaires(addForm);
  }
  resetForm();
  dialogVisible.value = false;
  refreshMethod();
}

const handleDelete = async (index: number, row: QuestionnaireData) => {
  await delQuestionnaires(row.id);
  refreshMethod();
};

const refreshMethod = async () => {
  const res = await getQuestionnaires();
  questionnaires.value = res.data.data;
  console.log(questionnaires.value);
  await nextTick();
  questionnairesTable.value?.sort("updated_at", "ascending");
};

const timeFormatter = (row: QuestionnaireData) => {
  // 获取当前年份
  const currentYear = moment().year();
  return moment(row.attributes.createdAt.slice(0, 10)).year(currentYear).format("YYYY-MM-DD");
};

const nameFormatter = (row: QuestionnaireData) => {
  return row.attributes.name;
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
