import http from "@/api";
import { Statistics } from "@/api/interface/statistics";
import { PORT1 } from "../config/servicePort";

/**
 * @name 统计模块
 */

// 获取github-contributions
export const getGithubContributions = () => {
  return http.post<Statistics.GContributionRes>(PORT1 + `/gc/graphql`, {
    query:
      "query($userName:String!) { user(login: $userName){ contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date } } } } } }",
    variables: {
      userName: "undercurre"
    }
  });
};
