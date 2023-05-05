<template>
  <div class="gallery">
    <div class="category">
      <div class="tab">
        <el-check-tag :checked="true">全部</el-check-tag>
      </div>
      <el-button type="primary">
        Upload<el-icon class="el-icon--right"><Upload /></el-icon>
      </el-button>
    </div>
    <img class="image" v-for="(image, index) in images" :key="index" :src="image" @click="showImage(index)" />
    <div v-if="showModal" class="modal" @click="closeModal">
      <img :src="selectedImage" />
    </div>
  </div>
</template>

<script lang="ts">
export default { name: "Gallery" };
</script>

<script lang="ts" setup>
import { getImageForUser } from "@/api/modules/image";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();

const images = ref<string[]>([]);
const showModal = ref(false);
const selectedImage = ref("");

function showImage(index: number) {
  selectedImage.value = images.value[index];
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

onBeforeMount(async () => {
  const { data } = await getImageForUser({ id: userStore.userInfo.userId });
  images.value = data.map(item => item.image_url);
});
</script>

<style scoped>
.gallery {
  display: flex;
  flex-wrap: wrap;
}
.image {
  width: 250px;
  height: 250px;
}
.gallery img {
  margin: 10px;
  cursor: pointer;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 70%);
}
.modal img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 5px;
}
.category {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
