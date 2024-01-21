// 答题模块
export declare namespace UserQuestionRecord {
  type Entity = {
    id: string;
    userId: string;
    questionId: string;
    userAnswer: string;
    isCorrect: 0 | 1;
    score: number;
    startTime: Date;
    endTime: Date;
    updated_at: Date;
  };

  type CreateParams = Partial<Entity>;
}
