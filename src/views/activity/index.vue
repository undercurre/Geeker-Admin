<template>
  <div class="bg-#fff">
    <p class="leading-30px text-20px px-10px pt-20px">提醒管理</p>
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
      <el-table-column label="Name" prop="name" />
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

    <el-dialog v-model="dialogVisible" :title="opearationType === 'edit' ? 'Task Edit' : 'Task Add'" width="50%">
      <el-form v-show="opearationType === 'edit'" :model="editForm" label-width="240px">
        <el-form-item label="Anniversaries Name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="Anniversaries Notes">
          <el-input type="textarea" v-model="editForm.notes" />
        </el-form-item>
        <el-form-item label="Anniversaries Type">
          <el-input v-model="editForm.type" />
        </el-form-item>
        <el-form-item label="Anniversaries ReminderDays">
          <el-input-number v-model="editForm.reminder_days" :min="0" :max="10" />
        </el-form-item>
        <el-form-item label="Anniversaries Date">
          <el-date-picker v-model="editForm.date" value-format="YYYY-MM-DD" type="date" placeholder="Pick a day" />
        </el-form-item>
      </el-form>
      <el-form v-show="opearationType === 'add'" :model="addForm" label-width="240px">
        <el-form-item label="Anniversaries Name">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="Anniversaries Notes">
          <el-input type="textarea" v-model="addForm.notes" />
        </el-form-item>
        <el-form-item label="Anniversaries Type">
          <el-input v-model="addForm.type" />
        </el-form-item>
        <el-form-item label="Anniversaries ReminderDays">
          <el-input-number v-model="addForm.reminder_days" :min="0" :max="10" />
        </el-form-item>
        <el-form-item label="Anniversaries Date">
          <el-date-picker v-model="addForm.date" value-format="YYYY-MM-DD" type="date" placeholder="Pick a day" />
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
  getAnniversariesListByUser,
  createAnniversaries,
  updateAnniversaries,
  deleteAnniversaries
} from "@/api/modules/anniversaries";
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { Anniversaries } from "@/api/interface/anniversaries";

const anniversaries = ref<Array<Anniversaries.Entity>>([]);

const anniversariesTable = ref<InstanceType<typeof ElTable> | null>(null);

const opearationType = ref("add");

const dialogVisible = ref(false);

const search = ref("");

const searchDate = ref("");

searchDate.value = moment(new Date()).format("YYYY-MM-DD");

const filterTableData = computed(() =>
  anniversaries.value.filter(data => !search.value || data.name.toLowerCase().includes(search.value.toLowerCase()))
);

let addForm = reactive<Anniversaries.CreateParams>({
  name: "",
  type: "",
  notes: "",
  reminder_days: 0,
  date: moment(new Date()).format("YYYY-MM-DD")
});

let editId: Anniversaries.Entity["id"] = "";

let editForm = reactive<Anniversaries.ReqUpdateData>({});

const resetForm = () => {
  addForm = reactive<Anniversaries.CreateParams>({
    name: "",
    type: "",
    notes: "",
    reminder_days: 0,
    date: moment(new Date()).format("YYYY-MM-DD")
  });

  editForm = reactive<Anniversaries.ReqUpdateData>({});
};

const handleAdd = () => {
  dialogVisible.value = true;
  opearationType.value = "add";
};

const handleEdit = (index: number, row: Anniversaries.Entity) => {
  dialogVisible.value = true;
  editId = row.id;
  editForm = row;
  opearationType.value = "edit";
};

async function submit() {
  if (opearationType.value === "edit") {
    await updateAnniversaries(editId, editForm);
  } else {
    await createAnniversaries(addForm);
  }
  resetForm();
  dialogVisible.value = false;
  refreshMethod();
}

const handleDelete = async (index: number, row: Anniversaries.Entity) => {
  await deleteAnniversaries(row.id);
  refreshMethod();
};

const refreshMethod = async () => {
  const res = await getAnniversariesListByUser();
  anniversaries.value = res.data;
  console.log(anniversaries.value);
  await nextTick();
  anniversariesTable.value?.sort("updated_at", "ascending");
};

const timeFormatter = (row: Anniversaries.Entity) => {
  // 获取当前年份
  const currentYear = moment().year();
  return moment(row.date.slice(0, 10)).year(currentYear).format("YYYY-MM-DD");
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
