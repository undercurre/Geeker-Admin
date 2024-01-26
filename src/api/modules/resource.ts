import http from "@/api";
import { Resource } from "@/api/interface/resource";

/**
 * @name 资源CMS模块
 */

export const getResourceForUser = () => {
  return http.get<Array<Resource.Entity>>("resources/fineOneByUser");
};

export const uploadResource = (params: FormData) => {
  return http.post("resources/create", params);
};
