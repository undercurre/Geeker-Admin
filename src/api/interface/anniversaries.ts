// 提醒模块
export declare namespace Anniversaries {
  type Entity = {
    id: string;
    userId: string;
    name: string;
    date: string;
    type: string;
    notes: string;
    reminder_days: number;
    created_at: string;
    updated_at: string;
  };

  type CreateParams = Partial<Entity>;

  type ReqUpdateData = Partial<Omit<Entity, "id" | "created_at" | "updated_at" | "userId">>;
}
