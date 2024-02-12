import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { UserQuestionRecord } from "../interface/userquestionrecord";

/**
 * @name 答题模块
 */
// 创建回答

export const createRecord = (record: UserQuestionRecord.CreateParams) => {
  return http.post(PORT1 + "/userquestionrecords", record);
};

// 获取个人回答记录

export const queryRecord = () => {
  return http.get<Array<UserQuestionRecord.Entity>>(PORT1 + "/userquestionrecords/getByUserId");
};

// 修改回答的对错定义
export const updateRecord = (record: UserQuestionRecord.UpdateParams) => {
  const { id, ...fixObj } = record;
  return http.put<Array<UserQuestionRecord.Entity>>(PORT1 + `/userquestionrecords/${id}`, fixObj);
};
