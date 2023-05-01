<script lang="ts" setup>
import { ref } from "vue";
import { Cloud } from "laf-client-sdk"; // 引入

// 创建cloud对象
const cloud = new Cloud({
  baseUrl: "https://pn1efz.laf.run", // 这里的 <AppID> 需要换成自己的 AppID
  getAccessToken: () => "" // 这里先为空
});

const newTodo = ref("");
const list = ref<
  Array<{
    _id: any;
    name: string;
    complete: boolean;
  }>
>([]);

// ===============================function===============================
getList();
async function getList() {
  const res = await cloud.invoke("get-list");
  list.value = res.data;
}

async function submit() {
  if (!newTodo.value) return;

  const obj = {
    name: newTodo.value,
    complete: false
  };

  await cloud.invoke("add-todo", obj);
  newTodo.value = "";

  getList();
}

async function complete(index: any, id: any) {
  list.value[index].complete = !list.value[index].complete;
  await cloud.invoke("update-todo", {
    id,
    data: list.value[index]
  });
}

async function del(id: any) {
  await cloud.invoke("del-todo", { id });
  getList();
}
</script>

<template>
  <div class="todo-app">
    <h1>Todo App</h1>

    <div class="todo-form">
      <input type="text" v-model="newTodo" class="todo-input" placeholder="Add a todo" />
      <button class="todo-button" @click="submit">Add Todo</button>
    </div>

    <ul v-for="(item, index) in list" :key="item._id">
      <li :class="[item.complete ? 'completed todo-row' : 'todo-row']">
        <div class="item">
          <div>
            <input type="checkbox" :checked="item.complete" @click="complete(index, item._id)" />
            <span>{{ item.name }}</span>
          </div>
          <div class="del" @click="del(item._id)">del</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style>
* {
  font-family: "Open Sans";
}
body {
  background: linear-gradient(90deg, rgb(105 20 204 / 100%) 0%, rgb(44 114 251 / 100%) 100%);
}
.todo-app {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  justify-items: center;
  min-height: 500px;
  padding: 0 20px;
  margin: 0 20px;
  margin-top: 40px;
  text-align: center;
  background: #ffffff;
  border-radius: 5px;
}
h1 {
  margin: 32px 0;
  font-size: 24px;
}
.completed {
  text-decoration: line-through;
  opacity: 0.4;
}
.item {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.del {
  color: red;
  cursor: pointer;
}
.todo-form {
  display: flex;
  margin-bottom: 32px;
}
.todo-button {
  padding: 16px;
  color: #ffffff;
  text-transform: capitalize;
  cursor: pointer;
  background: linear-gradient(90deg, rgb(105 20 204 / 100%) 0%, rgb(44 114 251 / 100%) 100%);
  border: none;
  border-radius: 0 20px 20px 0;
  outline: none;
}
.todo-input {
  width: 60%;
  padding: 15px 32px 15px 16px;
  background: transparent;
  border: 1px solid #dfe1e5;
  border-radius: 20px 0 0 20px;
  outline: none;
}
.todo-input.edit {
  border: 2px solid #149fff;
}
.todo-button.edit {
  padding: 16px 22px;
  background: linear-gradient(90deg, rgb(20 159 255 / 100%) 0%, rgb(17 122 255 / 100%) 100%);
}
.todo-container {
  position: relative;
  display: flex;
  flex-direction: row;
}
ul {
  padding: 0;
  margin: 0;
  list-style-type: none;
}
.todo-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  padding: 16px;
  margin: 4px auto;
  border-radius: 20px;
  box-shadow: rgb(149 157 165 / 20%) 0 8px 24px;
}
.todo-row input {
  margin-right: 10px;
}
</style>
