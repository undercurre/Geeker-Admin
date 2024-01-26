import http from "@/api";
import { Image } from "@/api/interface/image";

/**
 * @name 图片CMS模块
 */

export const getImageForUser = () => {
  return http.get<Array<Image.Entity>>("images/fineOneByUser");
};

export const uploadImage = (params: FormData) => {
  return http.post("images/create", params);
};
