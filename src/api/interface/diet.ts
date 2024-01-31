export namespace Diet {
  export interface Entity {
    id: number;
    user_id: string;
    name: string;
    description: string;
    calories: number;
    meal_time: string;
    created_at: string;
    updated_at: string;
    image_url: string;
  }
}
