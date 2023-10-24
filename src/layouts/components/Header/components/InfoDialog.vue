<template>
  <el-dialog v-model="dialogVisible" title="个人信息" width="500px" draggable>
    <view>
      <p>ID: {{ userStore.userInfo.id }}</p>
      <p>Name: {{ userStore.userInfo.username }}</p>
    </view>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();

const dialogVisible = ref(false);
const openDialog = () => {
  dialogVisible.value = true;
};

defineExpose({ openDialog });
</script>
