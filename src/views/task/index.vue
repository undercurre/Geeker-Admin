<template>
  <div class="bg-#fff">
    <p class="leading-30px text-20px px-10px pt-20px">任务管理</p>
    <div class="w-full flex justify-between items-center p-10px">
      <div>
        <el-button type="primary" @click="handleAdd"
          ><el-icon><Plus /></el-icon>添加</el-button
        >
        <el-date-picker
          class="ml-20px"
          v-model="searchDate"
          value-format="YYYY-MM-DD"
          type="date"
          placeholder="Pick a day"
          size="default"
          @change="searchByDate"
        />
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
      <el-table-column label="Title" prop="title" />
      <el-table-column label="Status" prop="status" />
      <el-table-column label="Deadline" prop="due_date" />
      <el-table-column label="Updated" prop="updated_at" sortable :formatter="timeFormatter" :sort-orders="['ascending']" />
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

    <el-dialog v-model="dialogVisible" :title="opearationType === 'edit' ? 'Task Edit' : 'Task Add'" width="50%">
      <el-form v-show="opearationType === 'edit'" :model="editForm" label-width="120px">
        <el-form-item label="Task Title">
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item label="Task Description">
          <el-input type="textarea" v-model="editForm.description" />
        </el-form-item>
        <el-form-item label="Task Status">
          <el-switch :value="editForm.status === 'Done'" @change="handleTaskStatusChange" />
        </el-form-item>
        <el-form-item label="Task Priority">
          <el-input-number v-model="editForm.priority" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="Task DueDate">
          <el-date-picker v-model="editForm.due_date" value-format="YYYY-MM-DD" type="date" placeholder="Pick a day" />
        </el-form-item>
      </el-form>
      <el-form v-show="opearationType === 'add'" :model="addForm" label-width="120px">
        <el-form-item label="Task Title">
          <el-input v-model="addForm.title" />
        </el-form-item>
        <el-form-item label="Task Description">
          <el-input type="textarea" v-model="addForm.description" />
        </el-form-item>
        <el-form-item label="Task Status">
          <el-switch :value="addForm.status === 'Done'" @change="handleTaskStatusChange" />
        </el-form-item>
        <el-form-item label="Task Priority">
          <el-input-number v-model="addForm.priority" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="Task DueDate">
          <el-date-picker v-model="addForm.due_date" value-format="YYYY-MM-DD" type="date" placeholder="Pick a day" />
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
import { Task } from "@/api/interface/task";
import { ElTable } from "element-plus";
import { getTaskListByUser, addTask, editTask, deleteTask } from "@/api/modules/task";
import { computed, nextTick, onMounted, reactive, ref } from "vue";

const tasks = ref<Array<Task.Entity>>([]);

const taskTable = ref<InstanceType<typeof ElTable> | null>(null);

const opearationType = ref("add");

const dialogVisible = ref(false);

const search = ref("");

const searchDate = ref("");

searchDate.value = moment(new Date()).format("YYYY-MM-DD");

const filterTableData = computed(() =>
  tasks.value.filter(data => !search.value || data.title.toLowerCase().includes(search.value.toLowerCase()))
);

let addForm = reactive<Task.ReqAddData>({
  title: "",
  description: "",
  status: "Todo",
  priority: 1,
  due_date: moment(new Date()).add(1, "days").format("YYYY-MM-DD")
});

let editId: Task.Entity["id"] = "";

let editForm = reactive<Task.ReqUpdateData>({});

const resetForm = () => {
  addForm = reactive<Task.ReqAddData>({
    title: "",
    description: "",
    status: "Todo",
    priority: 1,
    due_date: moment(new Date()).add(1, "days").format("YYYY-MM-DD")
  });

  editForm = reactive<Task.ReqUpdateData>({});
};

const handleAdd = () => {
  dialogVisible.value = true;
  opearationType.value = "add";
};

const handleEdit = (index: number, row: Task.Entity) => {
  dialogVisible.value = true;
  editId = row.id;
  editForm = row;
  opearationType.value = "edit";
};

async function submit() {
  if (opearationType.value === "edit") {
    await editTask(editId, editForm);
  } else {
    await addTask(addForm);
  }
  resetForm();
  dialogVisible.value = false;
  refreshMethod();
}

const handleDelete = async (index: number, row: Task.Entity) => {
  await deleteTask({ id: row.id });
  refreshMethod();
};

const refreshMethod = async () => {
  const res = await getTaskListByUser({
    due_date: searchDate.value
  });
  tasks.value = res.data;
  console.log(tasks.value);
  await nextTick();
  taskTable.value?.sort("updated_at", "ascending");
};

const searchByDate = async () => {
  const res = await getTaskListByUser({
    due_date: searchDate.value
  });
  tasks.value = res.data;
  await nextTick();
  taskTable.value?.sort("updated_at", "ascending");
};

const timeFormatter = (row: Task.Entity) => {
  return moment(row.updated_at).format("YYYY-MM-DD hh:mm:ss");
};

const handleTaskStatusChange = () => {
  if (opearationType.value === "edit") {
    if (editForm.status === "Todo" || editForm.status === "In Progress") {
      editForm.status = "Done";
    } else {
      editForm.status = "In Progress";
    }
  } else {
    if (addForm.status === "Todo") {
      addForm.status = "Done";
    } else {
      addForm.status = "In Progress";
    }
  }
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
