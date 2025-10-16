import { onLoad } from "@dcloudio/uni-app";
import { get, isUndefined, mapValues } from "lodash-es";
import { reactive, type UnwrapRef } from "vue";
import type { SearchParams } from "./typings";

/**
 * 提供当前页面路由信息的响应式封装。
 * 在组合式 API 中便捷地读取并类型安全地访问当前页面的路由信息。
 *
 * @template T extends SearchParams 查询参数对象的类型。为 T 指定结构可获得更精准的类型提示。
 * @returns {{ query: T; path: string; fullPath: string }} 路由信息
 */
export function useUniRoute<T extends SearchParams>() {
  const route = reactive<{
    query: T;
    path: string;
    fullPath: string;
  }>({
    query: {} as T,
    path: "",
    fullPath: "",
  });

  onLoad((query) => {
    const pages = getCurrentPages();
    const page = pages[pages.length - 1] ?? null;

    if (!isUndefined(query)) {
      route.query = mapValues(query, (value) => decodeURIComponent(value)) as UnwrapRef<T>;
    }

    route.path = page?.route ?? "";
    route.fullPath = get(page, "$page.fullPath", "");
  });

  return route;
}