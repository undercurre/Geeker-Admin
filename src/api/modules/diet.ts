import http from "@/api";
import { Diet } from "@/api/interface/diet";

/**
 * @name Diet模块
 */

export const getDietRecord = () => {
  return http.get<Array<Diet.Entity>>("diet/getByUserId");
};
