import http from "@/api";
import { Image } from "@/api/interface/index";

/**
 * @name 图片CMS模块
 */

export const getImageForUser = (params: { id: number }) => {
  return http.get<Array<Image.ResImagesForUser>>("images/fineOneByUser", params);
};

export const uploadImage = (params: FormData) => {
  return http.post("images/create", params);
};
