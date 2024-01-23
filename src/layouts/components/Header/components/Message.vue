<template>
  <div class="message">
    <el-popover placement="bottom" :width="310" trigger="click">
      <template #reference>
        <el-badge :value="needRemind.length" class="item">
          <i :class="'iconfont icon-xiaoxi'" class="toolBar-icon"></i>
        </el-badge>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="通知" name="first">
          <div class="message-list" v-if="needRemind.length">
            <div class="message-item" v-for="item in needRemind" :key="item.id">
              <img src="@/assets/images/msg01.png" alt="" class="message-icon" />
              <div class="message-content">
                <span class="message-title">{{ item.name }} 🧡</span>
                <span class="message-date">{{ formatDistance(item.reminder_days, item.date) }}天后</span>
              </div>
            </div>
          </div>
          <div class="message-list" v-if="!needRemind.length">暂无提醒</div>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { getAnniversariesListByUser } from "@/api/modules/anniversaries";
import { Anniversaries } from "@/api/interface/anniversaries";
const activeName = ref("first");

const anniversaries = ref<Array<Anniversaries.Entity>>([]);

const needRemind = computed(() => {
  return anniversaries.value.filter(item => {
    const start = moment(item.date.slice(0, 10)).subtract(item.reminder_days, "days").format("YYYY-MM-DD");
    if (new Date(start) < new Date()) {
      return true;
    } else {
      return false;
    }
  });
});

function formatDistance(days: number, date: string) {
  const currentYear = moment().year();
  const today = moment(new Date()).format("YYYY-MM-DD");
  const start = moment(date.slice(0, 10)).year(currentYear).format("YYYY-MM-DD");
  if (new Date(start) > new Date()) {
    const momentDate1 = moment(new Date(today));
    const momentDate2 = moment(new Date(start));
    console.log(momentDate1, momentDate2);
    return -1 * momentDate1.diff(momentDate2, "days");
  }
}

onMounted(async () => {
  const res = await getAnniversariesListByUser();
  anniversaries.value = res.data;
});
</script>

<style scoped lang="scss">
.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  line-height: 45px;
}
.message-list {
  display: flex;
  flex-direction: column;
  .message-item {
    display: flex;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid var(--el-border-color-light);
    &:last-child {
      border: none;
    }
    .message-icon {
      width: 40px;
      height: 40px;
      margin: 0 20px 0 5px;
    }
    .message-content {
      display: flex;
      flex-direction: column;
      .message-title {
        margin-bottom: 5px;
      }
      .message-date {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style>
