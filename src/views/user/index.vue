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
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import { getUserList } from "@/api/modules/user";
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
const handleEdit = (index: number, row: User) => {
  console.log(index, row);
};
const handleDelete = (index: number, row: User) => {
  console.log(index, row);
};

onMounted(async () => {
  const res = await getUserList();
  users.value = res.data;
});
</script>
