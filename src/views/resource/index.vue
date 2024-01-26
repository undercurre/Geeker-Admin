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
    <div class="flex flex-col m-10px items-center bg-#ddd p-10px rounded-10px" v-for="item in resources" :key="item.id">
      <el-icon><Files /></el-icon>
      <div class="flex flex-col">
        <text>{{ item.name }}</text>
      </div>
    </div>
    <div v-if="showModal" class="modal" @click="closeModal">
      <el-icon><Files /></el-icon>
      <div class="expandText">
        <text class="name">name: {{ selectedResource?.name }}</text>
        <text class="description">description: {{ selectedResource?.description }}</text>
      </div>
    </div>
    <el-dialog v-model="uploadDialogVisible" title="上传资源">
      <el-form :model="form" label-width="120px">
        <el-form-item label="name">
          <el-input v-model="form.name" placeholder="Please input your name of the resource" />
        </el-form-item>
        <el-form-item label="decription">
          <el-input
            v-model="form.description"
            :rows="2"
            type="textarea"
            placeholder="Please input your description of the resource"
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
    <el-dialog v-model="dialogVisible" :title="form.name || '将要上传的资源'">
      <el-icon><Files /></el-icon>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default { name: "Gallery" };
</script>

<script lang="ts" setup>
import { getResourceForUser } from "@/api/modules/resource";
import { onBeforeMount, reactive, ref } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { ElMessage, UploadUserFile, genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { uploadResource } from "@/api/modules/resource";
import { Resource } from "@/api/interface/resource";

const userStore = useUserStore();

const form = reactive<{
  user_id: number;
  name: string;
  description: string;
  file: File | null;
}>({
  user_id: userStore.userInfo.id,
  name: "",
  description: "",
  file: null
});

const resources = ref<Array<Resource.Entity>>([]);
const showModal = ref(false);
const selectedResource = ref<Resource.Entity>();

// function showResource(resource: Resource.Entity) {
//   selectedResource.value = resource;
//   showModal.value = true;
// }

function closeModal() {
  showModal.value = false;
}

// 上传资源
const uploadDialogVisible = ref(false);

const handleUpload = async () => {
  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("description", form.description);
  formData.append("file", form.file as Blob);
  const res = await uploadResource(formData);
  if (res.code) {
    ElMessage({
      message: "上传成功",
      type: "success"
    });
    uploadDialogVisible.value = false;
    getData();
  } else {
    ElMessage.error("上传失败");
  }
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
  form.file = uploadFile.raw as File;
  fileList.value = [
    {
      name: uploadFile.name,
      url: uploadFile.url
    }
  ];
};

const dialogResourceUrl = ref("");
const dialogVisible = ref(false);

const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  dialogResourceUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

async function getData() {
  const { data } = await getResourceForUser();
  resources.value = data;
}

onBeforeMount(async () => {
  getData();
});
</script>

<style scoped>
.gallery {
  display: flex;
  flex-wrap: wrap;
}
.gallery .display_resource {
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
  z-index: 9999;
  box-sizing: border-box;
  width: 100%;
  padding: 32px;
}
.expandResource {
  position: relative;
}
.expandText {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.name {
  font-size: 22px;
  color: #f3f3f3;
}
.description {
  font-size: 16px;
  color: #dddddd;
}
</style>
