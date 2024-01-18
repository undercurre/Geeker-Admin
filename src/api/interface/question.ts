// 题目管理模块
export declare namespace Question {
  type Entity = {
    id: string;
    content: string;
    options: string[];
    correctAnswer: string;
    difficulty: number;
    hints: string[];
    created_at: Date;
    updated_at: Date;
  };
}
