<template>
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

  <el-dialog v-model="dialogVisible" :title="opearationType ? 'User Edit' : 'User Add'" width="30%" :before-close="handleClose">
    <el-form :model="form" label-width="120px">
      <el-form-item label="Activity name">
        <el-input v-model="form.username" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, reactive } from "vue";
import { deleteUser, getUserList } from "@/api/modules/user";
import { User } from "@/api/interface";

interface User {
  date: string;
  name: string;
  address: string;
}

const users = ref<Array<User.ResUserList>>([]);

const search = ref("");

const filterTableData = computed(() =>
  users.value.filter(data => !search.value || data.username.toLowerCase().includes(search.value.toLowerCase()))
);

// dialog
const opearationType = ref("add");

const dialogVisible = ref(false);

let form = reactive<User.ResUserList>({
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

const handleEdit = (index: number, row: User.ResUserList) => {
  dialogVisible.value = true;
  form = row;
};
const handleDelete = (index: number, row: User.ResUserList) => {
  deleteUser({ id: row.id });
};

onMounted(async () => {
  const res = await getUserList();
  users.value = res.data;
});
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
