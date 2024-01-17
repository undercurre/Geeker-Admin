<template>
  <div class="bg-#fff">
    <p class="leading-30px text-20px px-10px pt-20px">题目管理</p>
    <div class="w-full flex justify-between items-center p-10px">
      <el-button type="primary" @click="handleAdd"
        ><el-icon><Plus /></el-icon>添加</el-button
      >
      <el-button type="primary" @click="refreshMethod"
        ><el-icon><RefreshRight /></el-icon>刷新表格</el-button
      >
    </div>
    <el-table :data="filterTableData" style="width: 100%">
      <el-table-column label="Name" prop="username" />
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Search Name" />
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="opearationType === 'edit' ? 'User Edit' : 'User Add'" width="30%">
      <el-form v-show="opearationType === 'add'" :model="addForm" label-width="120px">
        <el-form-item label="User name">
          <el-input v-model="addForm.content" />
        </el-form-item>
        <el-form-item label="User password">
          <el-input v-model="addForm.correntAnswer" />
        </el-form-item>
      </el-form>
      <el-form v-show="opearationType === 'edit'" :model="editForm" label-width="120px">
        <el-form-item label="User name">
          <el-input v-model="editForm.content" />
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
import { Question } from "@/api/interface/question";
import { deleteQuestion, getQuestionList, createQuestion, updateQuestion } from "@/api/modules/question";
import { computed, onMounted, reactive, ref } from "vue";

const questions = ref<Array<Question.Entity>>([]);

const opearationType = ref("add");

const dialogVisible = ref(false);

const search = ref("");

const filterTableData = computed(() =>
  questions.value.filter(data => !search.value || data.content.toLowerCase().includes(search.value.toLowerCase()))
);

let addForm = reactive<Question.Entity>({
  id: "",
  content: "",
  options: [],
  correntAnswer: "",
  difficulty: 0,
  hints: [],
  created_at: new Date(),
  updated_at: new Date()
});

let editForm = reactive<Question.Entity>({
  id: "",
  content: "",
  options: [],
  correntAnswer: "",
  difficulty: 0,
  hints: [],
  created_at: new Date(),
  updated_at: new Date()
});

const handleAdd = () => {
  dialogVisible.value = true;
  opearationType.value = "add";
};

const handleEdit = (index: number, row: Question.Entity) => {
  dialogVisible.value = true;
  editForm = row;
  opearationType.value = "edit";
};

async function submit() {
  if (opearationType.value === "edit") {
    await updateQuestion(editForm);
    editForm = {
      id: "",
      content: "",
      options: [],
      correntAnswer: "",
      difficulty: 0,
      hints: [],
      created_at: new Date(),
      updated_at: new Date()
    };
  } else {
    await createQuestion(addForm);
    addForm = {
      id: "",
      content: "",
      options: [],
      correntAnswer: "",
      difficulty: 0,
      hints: [],
      created_at: new Date(),
      updated_at: new Date()
    };
  }
  dialogVisible.value = false;
  refreshMethod();
}

const handleDelete = async (index: number, row: Question.Entity) => {
  await deleteQuestion(row.id);
  refreshMethod();
};

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
