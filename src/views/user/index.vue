<template>
  <div class="bg-#fff">
    <p class="leading-30px text-20px px-10px pt-20px">用户管理</p>
    <div class="w-full flex justify-between items-center p-10px">
      <el-button type="primary" @click="handleAdd"
        ><el-icon><Plus /></el-icon>添加</el-button
      >
      <el-button type="primary" @click="refresh"
        ><el-icon><RefreshRight /></el-icon>刷新表格</el-button
      >
    </div>
    <el-table :data="filterTableData" style="width: 100%">
      <el-table-column label="ID" prop="id" />
      <el-table-column label="Name" prop="username" />
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog
    v-model="dialogVisible"
    :title="opearationType === 'edit' ? 'User Edit' : 'User Add'"
    width="30%"
    :before-close="handleClose"
  >
    <el-form v-show="opearationType === 'add'" :model="addForm" label-width="120px">
      <el-form-item label="User name">
        <el-input v-model="addForm.username" />
      </el-form-item>
      <el-form-item label="User password">
        <el-input v-model="addForm.password" />
      </el-form-item>
    </el-form>
    <el-form v-show="opearationType === 'edit'" :model="editForm" label-width="120px">
      <el-form-item label="User name">
        <el-input v-model="editForm.username" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submit"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, reactive } from "vue";
import { deleteUser, getUserList, editUser, addUser } from "@/api/modules/user";
import { User } from "@/api/interface";

interface User {
  date: string;
  name: string;
  address: string;
}

const users = ref<Array<User.ResUserItem>>([]);

const search = ref("");

const filterTableData = computed(() =>
  users.value.filter(data => !search.value || data.username.toLowerCase().includes(search.value.toLowerCase()))
);

// dialog
const opearationType = ref("add");

const dialogVisible = ref(false);

let addForm = reactive<User.AddUserItem>({
  id: 0,
  username: "",
  password: "",
  openid: "",
  session_key: "",
  unionid: "",
  access_token: "",
  expires_in: "",
  phone: ""
});

let editForm = reactive<User.ResUserItem>({
  id: 0,
  username: "",
  openid: "",
  session_key: "",
  unionid: "",
  access_token: "",
  expires_in: "",
  phone: ""
});

const handleClose = (done: () => void) => {
  done();
};

const handleAdd = () => {
  dialogVisible.value = true;
  opearationType.value = "add";
};

const handleEdit = (index: number, row: User.ResUserItem) => {
  dialogVisible.value = true;
  editForm = row;
  opearationType.value = "edit";
};
const handleDelete = async (index: number, row: User.ResUserItem) => {
  await deleteUser({ id: row.id });
  refresh();
};

function submit() {
  if (opearationType.value === "edit") editUser(editForm);
  else addUser(addForm);
  dialogVisible.value = false;
  refresh();
}

async function refresh() {
  const res = await getUserList();
  users.value = res.data;
}

onMounted(() => {
  refresh();
});
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
