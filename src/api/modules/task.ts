import { Task } from "@/api/interface/task";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 任务管理模块
 */

// 获取用户的任务列表
export const getTaskListByUser = (conditions?: Partial<Task.Entity>) => {
  if (conditions) {
    const query = Object.keys(conditions)
      .map(item => `${item}=${(conditions as Record<string, number | string>)[item]}`)
      .join("&");
    return http.get<Array<Task.Entity>>(PORT1 + `/tasks/findByUserId?${query}`);
  } else {
    return http.get<Array<Task.Entity>>(PORT1 + `/tasks/findByUserId`);
  }
};

// 新增任务
export const addTask = (data: Task.ReqAddData) => {
  return http.post(PORT1 + `/tasks/create`, data);
};

// 删除任务
export const deleteTask = (params: Task.DeleteParams) => {
  return http.delete(PORT1 + `/tasks/delete`, params);
};

// 编辑任务
export const editTask = (id: Task.Entity["id"], data: Task.ReqUpdateData) => {
  return http.put(PORT1 + `/tasks/update?id=${id}`, data);
};
