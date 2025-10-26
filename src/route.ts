import { onLoad } from "@dcloudio/uni-app";
import { get, isUndefined, mapValues } from "lodash-es";
import { reactive, type UnwrapRef } from "vue";
import type { SearchParamsQuery, SearchParamsKeys, SearchParams } from "./typings";

/**
 * 获取当前页面的路由信息
 * @template T 查询参数类型
 * @returns 包含 query、path、fullPath 的响应式路由对象
 */
export function useUniRoute<T extends SearchParamsKeys | SearchParams>() {
  type Query = T extends SearchParamsKeys ? SearchParamsQuery<T> : T;

  const route = reactive<{
    query: Query;
    path: string;
    fullPath: string;
  }>({
    query: {} as Query,
    path: "",
    fullPath: "",
  });

  onLoad((query) => {
    const pages = getCurrentPages();
    const page = pages[pages.length - 1] ?? null;

    if (!isUndefined(query)) {
      route.query = mapValues(query, (value) => decodeURIComponent(value)) as UnwrapRef<Query>;
    }

    route.path = page?.route ?? "";
    route.fullPath = get(page, "$page.fullPath", "");
  });

  return route;
}
