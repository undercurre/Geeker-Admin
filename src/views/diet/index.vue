<template>
  <div class="bg-#fff">
    <p class="leading-30px text-20px px-10px pt-20px">饮食管理</p>
    <div class="w-full flex justify-between items-center p-10px">
      <el-button type="primary" @click="refreshMethod"
        ><el-icon><RefreshRight /></el-icon>刷新表格</el-button
      >
    </div>
    <el-table :data="diet" style="width: 100%">
      <el-table-column label="Name" prop="name" />
      <el-table-column label="Calories" prop="calories" />
      <el-table-column label="Time" prop="meal_time" :formatter="timeFormatter" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { Diet } from "@/api/interface/diet";
import { getDietRecord } from "@/api/modules/diet";
import moment from "moment";
import { onMounted, ref } from "vue";

const diet = ref<Array<Diet.Entity>>([]);

const refreshMethod = async () => {
  const res = await getDietRecord();
  diet.value = res.data;
};

const timeFormatter = (row: Diet.Entity) => {
  return moment(row.updated_at).format("YYYY-MM-DD hh:mm:ss");
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
