import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

interface Pagination {
  start: number;
  limit: number;
  total: number;
}

export interface Meta {
  pagination: Pagination;
}

interface OptionAttributes {
  oid: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface OptionData {
  id: number;
  attributes: OptionAttributes;
}

interface QuestionAttributes {
  qid: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  type: "fill" | "single" | "multiple";
  options: { data: OptionData[] };
}

export interface QuestionData {
  id: number;
  attributes: QuestionAttributes;
}

interface QuestionResponse {
  data: QuestionData[];
  meta: Meta;
}

interface QuestionOneResponse {
  data: QuestionData;
  meta: object;
}

interface CreateQuestionParams {
  content: string;
  type: "fill" | "single" | "multiple";
  options: number[];
}

type UpdateQuestionParams = Partial<CreateQuestionParams>;

export async function getQuestions() {
  // return data
  return await http.post<QuestionResponse>(PORT1 + "/questionnaire/penetrate", {
    url: "/api/questions?pagination[limit]=40&populate=*",
    method: "GET"
  });
}

export async function delQuestions(id: number) {
  // return data
  return await http.post<QuestionOneResponse>(PORT1 + "/questionnaire/penetrate", {
    url: `/api/questions/${id}`,
    method: "DELETE"
  });
}

export async function updateQuestions(id: number, data: UpdateQuestionParams) {
  // return data
  return await http.post<QuestionOneResponse>(PORT1 + "/questionnaire/penetrate", {
    url: `/api/questions/${id}`,
    method: "PUT",
    data
  });
}

export async function createQuestions(data: CreateQuestionParams) {
  // return data
  return await http.post<QuestionOneResponse>(PORT1 + "/questionnaire/penetrate", {
    url: `/api/questions`,
    method: "POST",
    data
  });
}
