import http from "@/api";

/**
 * @name 图片CMS模块
 */

export const getImageForUser = (params: { id: string }) => {
  return http.get("images/fineOneByUser", params);
};
