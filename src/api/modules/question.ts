import { Question } from "@/api/interface/question";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 题目管理模块
 */
// 获取题目列表
export const getQuestionList = () => {
  return http.get<Array<Question.Entity>>(PORT1 + "/questions");
};

export const deleteQuestion = (id: string) => {
  return http.delete(PORT1 + `/questions/${id}`);
};

export const updateQuestion = (question: Partial<Question.Entity>) => {
  const { id, ...fixObj } = question;
  return http.put(PORT1 + `/questions/${id}`, {
    ...fixObj
  });
};

export const createQuestion = (question: Question.Entity) => {
  return http.post(PORT1 + "/questions/", question);
};
