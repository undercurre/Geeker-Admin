import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { Anniversaries } from "../interface/anniversaries";

/**
 * @name 提醒模块
 */
// 创建提醒

export const createAnniversaries = (anniversaries: Anniversaries.CreateParams) => {
  return http.post(PORT1 + "/anniversaries", anniversaries);
};

// 获取用户的提醒列表
export const getAnniversariesListByUser = (conditions?: Partial<Anniversaries.Entity>) => {
  if (conditions) {
    const query = Object.keys(conditions)
      .map(item => `${item}=${(conditions as Record<string, number | string>)[item]}`)
      .join("&");
    return http.get<Array<Anniversaries.Entity>>(PORT1 + `/anniversaries/getByUserId?${query}`);
  } else {
    return http.get<Array<Anniversaries.Entity>>(PORT1 + `/anniversaries/getByUserId`);
  }
};

export const deleteAnniversaries = (id: string) => {
  return http.delete(PORT1 + `/anniversaries/${id}`);
};

export const updateAnniversaries = (id: Anniversaries.Entity["id"], data: Anniversaries.ReqUpdateData) => {
  return http.put(PORT1 + `/anniversaries/${id}`, data);
};
