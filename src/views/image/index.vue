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
    <img v-for="(image, index) in images" :key="index" :src="image" @click="showImage(index)" />
    <div v-if="showModal" class="modal" @click="closeModal">
      <img :src="selectedImage" />
    </div>
  </div>
</template>

<script lang="ts">
export default { name: "Gallery" };
</script>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";

const images = ref<string[]>([
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/250",
  "https://via.placeholder.com/350",
  "https://via.placeholder.com/450",
  "https://via.placeholder.com/550"
]);
const showModal = ref(false);
const selectedImage = ref("");

function showImage(index: number) {
  selectedImage.value = images.value[index];
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

onBeforeMount(() => {});
</script>

<style scoped>
.gallery {
  display: flex;
  flex-wrap: wrap;
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
