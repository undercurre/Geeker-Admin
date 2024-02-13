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
    <div class="h-76vh">
      <el-table :data="filterTableData" style="width: 100%" height="100%">
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
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="opearationType === 'edit' ? 'Question Edit' : 'Question Add'" width="60%">
      <el-form v-show="opearationType === 'add'" :model="addForm" label-width="180px">
        <el-form-item label="Content">
          <el-input v-model="addForm.content" autosize type="textarea" />
        </el-form-item>
        <el-form-item label="Hints">
          <div class="w-full flex mt-10px" v-for="(hint, index) in addForm.hints" :key="index">
            <el-input v-model="addForm.hints[index]" autosize type="textarea"></el-input>
            <el-button class="ml-10px" @click="removeHint(addForm.hints, index)" type="danger" :icon="Delete"></el-button>
          </div>
          <el-button class="w-full mt-10px" @click="addHints(addForm.hints)" type="primary" :icon="Plus">Add Hint</el-button>
        </el-form-item>
        <el-form-item label="correctAnswer">
          <el-input v-model="addForm.correctAnswer" autosize type="textarea" />
        </el-form-item>
      </el-form>
      <el-form v-show="opearationType === 'edit'" :model="editForm" label-width="120px">
        <el-form-item label="Content">
          <el-input v-model="editForm.content" autosize type="textarea" />
        </el-form-item>
        <el-form-item label="Hints">
          <div class="w-full flex mt-10px" v-for="(hint, index) in editForm.hints" :key="index">
            <el-input v-model="editForm.hints[index]" autosize type="textarea"></el-input>
            <el-button class="ml-10px" @click="removeHint(editForm.hints, index)" type="danger" :icon="Delete"></el-button>
          </div>
          <el-button class="w-full mt-10px" @click="addHints(editForm.hints)" type="primary" :icon="Plus">Add Hint</el-button>
        </el-form-item>
        <el-form-item label="correctAnswer">
          <el-input v-model="editForm.correctAnswer" autosize type="textarea" />
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
import { Plus, Delete } from "@element-plus/icons-vue";

const questions = ref<Array<Question.Entity>>([]);

const opearationType = ref("add");

const dialogVisible = ref(false);

const search = ref("");

const filterTableData = computed(() =>
  questions.value.filter(data => !search.value || data.content.toLowerCase().includes(search.value.toLowerCase()))
);

let addForm = reactive<Omit<Question.Entity, "id">>({
  content: "",
  options: [],
  correctAnswer: "",
  difficulty: 0,
  hints: [""],
  created_at: new Date(),
  updated_at: new Date()
});

let editForm = reactive<Question.Entity>({
  id: "",
  content: "",
  options: [],
  correctAnswer: "",
  difficulty: 0,
  hints: [""],
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

const addHints = (arr: string[]) => {
  arr.push("");
};

function removeHint(arr: string[], index: number) {
  arr.splice(index, 1);
}

async function submit() {
  if (opearationType.value === "edit") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { options, difficulty, created_at, updated_at, ...editFormReal } = editForm;
    await updateQuestion(editFormReal);
    editForm = reactive({
      id: "",
      content: "",
      options: [""],
      correctAnswer: "",
      difficulty: 0,
      hints: [""],
      created_at: new Date(),
      updated_at: new Date()
    });
  } else {
    await createQuestion(addForm);
    addForm = reactive({
      content: "",
      options: [""],
      correctAnswer: "",
      difficulty: 0,
      hints: [""],
      created_at: new Date(),
      updated_at: new Date()
    });
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
