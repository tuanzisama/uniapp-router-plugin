import { onLoad } from "@dcloudio/uni-app";
import { get, isUndefined, mapValues } from "lodash-es";
import { reactive, type UnwrapRef } from "vue";

/**
 * 提供当前页面路由信息的响应式封装。
 *
 * 该方法会在页面的 `onLoad` 生命周期中自动初始化：
 * - 将 `onLoad` 入参中的 `query` 各字段使用 `decodeURIComponent` 进行解码；
 * - 通过 `getCurrentPages()` 获取当前页面，填充 `path` 与 `fullPath`；
 *
 * 使用场景：在组合式 API 中便捷地读取并类型安全地访问当前页面的路由信息。
 *
 * @template T extends SearchParams 查询参数对象的类型。为 T 指定结构可获得更精准的类型提示。
 * @returns {{ query: T; path: string; fullPath: string }} 一个 Vue 的响应式对象，包含：
 * - `query`: 已解码的查询参数对象（类型为 T）；
 * - `path`: 当前页面的路由路径；
 * - `fullPath`: 当前页面的完整路径（包含查询字符串）。
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

/**
 * 通用的查询参数类型定义。
 *
 * 表示路由查询参数的键值对结构：键为字符串，值为未知类型的可序列化数据（常见为字符串或数字）。
 */
type SearchParams = {
  [x: string]: unknown;
};