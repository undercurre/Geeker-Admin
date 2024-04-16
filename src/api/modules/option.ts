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

export interface OptionsResponce {
  data: OptionData[];
  meta: Meta;
}

export interface OptionOneResponce {
  data: OptionData;
  meta: Meta;
}

export async function getOptions() {
  // return data
  return await http.post<OptionsResponce>(PORT1 + "/questionnaire/penetrate", {
    url: "/api/options",
    method: "GET"
  });
}

export async function delOption(id: number) {
  // return data
  return await http.post<OptionOneResponce>(PORT1 + "/questionnaire/penetrate", {
    url: `/api/options/${id}`,
    method: "DELETE"
  });
}

export async function updateOption(id: number, data: any) {
  // return data
  return await http.post<OptionOneResponce>(PORT1 + "/questionnaire/penetrate", {
    url: `/api/options/${id}`,
    method: "PUT",
    data
  });
}

export async function createOption(data: any) {
  // return data
  return await http.post<OptionOneResponce>(PORT1 + "/questionnaire/penetrate", {
    url: `/api/options`,
    method: "POST",
    data
  });
}
