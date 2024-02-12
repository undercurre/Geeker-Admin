// 答题模块
export declare namespace UserQuestionRecord {
  type Entity = {
    id: string;
    userId: string;
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    score: number;
    startTime: Date;
    endTime: Date;
    created_at: Date;
  };

  type CreateParams = Partial<Entity>;

  type UpdateParams = Pick<Entity, "id"> & Partial<Pick<Entity, "userAnswer" | "score" | "isCorrect">>;
}
