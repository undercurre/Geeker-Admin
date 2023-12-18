// 统计模块
export declare namespace Statistics {
  export type GContribution = {
    contributionCount: number;
    date: string;
  };

  interface GContributionRes {
    data: {
      user: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: number;
            week: [
              {
                contributionDays: GContribution[];
              }
            ];
          };
        };
      };
    };
  }
}
