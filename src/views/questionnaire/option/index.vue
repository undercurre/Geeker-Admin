<template>
  <div class="bg-#fff">
    <p class="leading-30px text-20px px-10px pt-20px">选项管理</p>
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
      <el-table-column label="Content" prop="content" :formatter="contentFormatter" />
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

    <el-dialog v-model="dialogVisible" :title="opearationType === 'edit' ? 'Option Edit' : 'Option Add'" width="50%">
      <el-form v-show="opearationType === 'edit'" :model="editForm" label-width="240px">
        <el-form-item label="Option content">
          <el-input v-model="editForm.content" />
        </el-form-item>
      </el-form>
      <el-form v-show="opearationType === 'add'" :model="addForm" label-width="240px">
        <el-form-item label="Option content">
          <el-input v-model="addForm.content" />
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
import { createOption, delOption, getOptions, updateOption } from "@/api/modules/option";
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { OptionData } from "@/api/modules/naireQuestion";

const options = ref<Array<OptionData>>([]);

const optionsTable = ref<InstanceType<typeof ElTable> | null>(null);

const opearationType = ref("add");

const dialogVisible = ref(false);

const search = ref("");

const searchDate = ref("");

searchDate.value = moment(new Date()).format("YYYY-MM-DD");

const filterTableData = computed(() =>
  options.value.filter(data => !search.value || data.attributes.content.toLowerCase().includes(search.value.toLowerCase()))
);

type OptionForm = { content: string };

let addForm = reactive<OptionForm>({
  content: ""
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let editId: number = -1;

let editForm = reactive<OptionForm>({
  content: ""
});

const resetForm = () => {
  addForm = reactive<OptionForm>({
    content: ""
  });

  editForm = reactive<OptionForm>({
    content: ""
  });
};

const handleAdd = () => {
  dialogVisible.value = true;
  opearationType.value = "add";
};

const handleEdit = (index: number, row: OptionData) => {
  dialogVisible.value = true;
  editId = row.id;
  editForm = reactive({
    content: row.attributes.content
  });
  console.log(index, row);
  opearationType.value = "edit";
};

async function submit() {
  if (opearationType.value === "edit") {
    await updateOption(editId, editForm);
  } else {
    await createOption(addForm);
  }
  resetForm();
  dialogVisible.value = false;
  refreshMethod();
}

const handleDelete = async (index: number, row: OptionData) => {
  await delOption(row.id);
  refreshMethod();
};

const refreshMethod = async () => {
  const res = await getOptions();
  options.value = res.data.data;
  console.log(options.value);
  await nextTick();
  optionsTable.value?.sort("updated_at", "ascending");
};

const contentFormatter = (row: OptionData) => {
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
