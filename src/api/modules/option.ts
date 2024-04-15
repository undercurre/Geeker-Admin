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
  type: string;
  options: { data: OptionData[] };
}

interface QuestionData {
  id: number;
  attributes: QuestionAttributes;
}

interface QuestionnaireAttributes {
  qid: string | null;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  questions: {
    data: QuestionData[];
  };
}

export interface QuestionnaireData {
  id: number;
  attributes: QuestionnaireAttributes;
}

interface QuestionnaireResponse {
  data: QuestionnaireData[];
  meta: Meta;
}

interface QuestionnaireOneResponse {
  data: QuestionnaireData;
  meta: object;
}

interface CreateQuestionnaireParams {
  name: string;
  questions: number[];
}

type UpdateQuestionParams = Partial<CreateQuestionnaireParams>;

export async function getQuestionnaires() {
  // return data
  return await http.post<QuestionnaireResponse>(PORT1 + "/questionnaire/penetrate", {
    url: "/api/questionnaires?pagination[limit]=40&populate[questions][populate][0]=options",
    method: "GET"
  });
}

export async function getOneQuestionnaires(id: number) {
  // return data
  return await http.post<QuestionnaireOneResponse>(PORT1 + "/questionnaire/penetrate", {
    url: `/api/questionnaires/${id}?populate[questions][populate][0]=options`,
    method: "GET"
  });
}

export async function delQuestionnaires(id: number) {
  // return data
  return await http.post<QuestionnaireOneResponse>(PORT1 + "/questionnaire/penetrate", {
    url: `/api/questionnaires/${id}`,
    method: "DELETE"
  });
}

export async function updateQuestionnaires(id: number, data: UpdateQuestionParams) {
  // return data
  return await http.post<QuestionnaireOneResponse>(PORT1 + "/questionnaire/penetrate", {
    url: `/api/questionnaires/${id}`,
    method: "PUT",
    data
  });
}

export async function createQuestionnaires(data: CreateQuestionnaireParams) {
  // return data
  return await http.post<QuestionnaireOneResponse>(PORT1 + "/questionnaire/penetrate", {
    url: `/api/questionnaires`,
    method: "POST",
    data
  });
}
