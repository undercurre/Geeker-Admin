import { ResPage, User } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import md5 from "js-md5";

/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getUserList = () => {
  return http.get<Array<User.ResUserItem>>(PORT1 + `/users/list`);
};

// 获取树形用户列表
export const getUserTreeList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserItem>>(PORT1 + `/user/tree/list`, params);
};

// 新增用户
export const addUser = (params: User.ResUserItemAdd) => {
  params.password = md5(params.password);
  return http.post(PORT1 + `/users/create`, params);
};

// 批量添加用户
export const BatchAddUser = (params: FormData) => {
  return http.post(PORT1 + `/user/import`, params);
};

// 编辑用户
export const editUser = (params: User.UserParams) => {
  return http.put(PORT1 + `/users/update`, params);
};

// 删除用户
export const deleteUser = (params: { id: number }) => {
  return http.delete(PORT1 + `/users/delete`, params);
};

// 切换用户状态
export const changeUserStatus = (params: { id: string; status: number }) => {
  return http.post(PORT1 + `/user/change`, params);
};

// 重置用户密码
export const resetUserPassWord = (params: { id: string }) => {
  return http.post(PORT1 + `/user/rest_password`, params);
};

// 导出用户数据
export const exportUserInfo = (params: User.ReqUserParams) => {
  return http.download(PORT1 + `/user/export`, params);
};

// 获取用户状态
export const getUserStatus = () => {
  return http.get<User.ResStatus>(PORT1 + `/user/status`);
};

// 获取用户性别字典
export const getUserGender = () => {
  return http.get<User.ResGender>(PORT1 + `/user/gender`);
};

// 获取用户部门列表
export const getUserDepartment = () => {
  return http.get<User.ResDepartment>(PORT1 + `/user/department`);
};

// 获取用户角色字典
export const getUserRole = () => {
  return http.get<User.ResRole>(PORT1 + `/user/role`);
};

// 获取用户角色信息
export const getUserProfile = () => {
  return http.get<User.ResProfile>("/profile");
};
