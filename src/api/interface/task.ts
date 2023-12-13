// 用户管理模块
export declare namespace Task {
  export type Entity = {
    id: string;
    title: string;
    description?: string;
    status: "Todo" | "In Progress" | "Done";
    priority: number;
    due_date: string;
    created_at: string;
    updated_at: string;
    user_id: string;
  };

  export type ReqAddData = Omit<Entity, "id" | "created_at" | "updated_at" | "user_id">;

  export type ReqUpdateData = Partial<Omit<Entity, "id" | "created_at" | "updated_at" | "user_id">>;

  export interface DeleteParams {
    id: Entity["id"];
  }
}
