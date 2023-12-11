import { ReqPage } from ".";

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }

  export type UserParams = {
    [K in keyof ResUserItem]?: ResUserItem[K];
  };

  export interface ResUserItem {
    id: number;
    username: string;
    openid: string;
    session_key: string;
    unionid: string;
    access_token: string;
    expires_in: string;
    phone: string;
  }

  export interface ResUserItemAdd extends ResUserItem {
    password: string;
  }

  export interface AddUserItem extends ResUserItem {
    password: string;
  }

  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }

  export interface ResProfile {
    id: number;
    username: string;
  }
}
