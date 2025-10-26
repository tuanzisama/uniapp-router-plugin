/**
 * 路由跳转参数定义。
 *
 * - `url`: 以 `/` 开头的目标页面路径；
 * - `query`: 查询参数对象、已拼接的字符串或 `null`；
 */
export interface RouterParams {
  url: `/${string}`;
  query?: SearchParams | string | null;
}

/**
 * 通用查询参数类型：键为字符串，值为任意可序列化类型。
 */
export type SearchParams = {
  [x: string]: string;
};

export type SearchParamsKeys = string[];

export type SearchParamsQuery<T extends SearchParamsKeys> = {
  [K in T[number]]: string;
};
