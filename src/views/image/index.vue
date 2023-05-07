<template>
  <div class="gallery">
    <div class="category">
      <div class="tab">
        <el-check-tag :checked="true">全部</el-check-tag>
      </div>
      <el-button type="primary" @click="uploadDialogVisible = true">
        Upload<el-icon class="el-icon--right"><Upload /></el-icon>
      </el-button>
    </div>
    <img class="display_image" v-for="(image, index) in images" :key="index" :src="image" @click="showImage(index)" />
    <div v-if="showModal" class="modal" @click="closeModal">
      <img :src="selectedImage" />
    </div>
    <el-dialog v-model="uploadDialogVisible" title="上传图片">
      <el-form :model="form" label-width="120px">
        <el-form-item label="name">
          <el-input v-model="form.name" placeholder="Please input your name of the image" />
        </el-form-item>
        <el-form-item label="decription">
          <el-input
            v-model="form.description"
            :rows="2"
            type="textarea"
            placeholder="Please input your description of the image"
            resize="none"
          />
        </el-form-item>
        <el-form-item label="file">
          <el-upload
            ref="upload"
            v-model:file-list="fileList"
            class="upload-demo"
            list-type="picture-card"
            :limit="1"
            :on-exceed="handleExceed"
            :on-change="handleChange"
            :on-preview="handlePictureCardPreview"
            :auto-upload="false"
          >
            <template #trigger>
              <el-icon><Plus /></el-icon>
            </template>
            <template #tip>
              <div class="el-upload__tip text-red">limit 1 file, new file will cover the old file</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleUpload">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible" :title="form.name || '将要上传的图片'">
      <img class="expand" :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default { name: "Gallery" };
</script>

<script lang="ts" setup>
import { getImageForUser } from "@/api/modules/image";
import { onBeforeMount, reactive, ref } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { UploadUserFile, genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { uploadImage } from "@/api/modules/image";

const userStore = useUserStore();

const form = reactive<{
  user_id: number;
  name: string;
  description: string;
  file: File | null;
}>({
  user_id: userStore.userInfo.userId,
  name: "",
  description: "",
  file: null
});

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

// 上传图片
const uploadDialogVisible = ref(false);

const handleUpload = () => {
  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("user_id", form.user_id.toString());
  formData.append("description", form.description);
  formData.append("file", form.file as Blob);
  uploadImage(formData);
};

const upload = ref<UploadInstance>();

const fileList = ref<UploadUserFile[]>([]);

const handleExceed: UploadProps["onExceed"] = files => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const handleChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile);
  form.file = uploadFile.raw as File;
  fileList.value = [
    {
      name: uploadFile.name,
      url: uploadFile.url
    }
  ];
};

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

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
.gallery .display_image {
  width: 250px;
  height: 250px;
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
.expand {
  box-sizing: border-box;
  width: 100%;
  padding: 32px;
}
</style>
