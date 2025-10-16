import { isEmpty, reduce } from "lodash-es";

/**
 * 提供一组封装好的 uni-app 路由导航方法。
 *
 * 返回的对象包含以下对外暴露的方法：
 * - `navigateTo(options)`: 保留当前页面，跳转到应用内某个页面，可携带 query；
 * - `redirectTo(options)`: 关闭当前页面，跳转到应用内某个页面，可携带 query；
 * - `reLaunch(options)`: 关闭所有页面，打开到应用内的某个页面，可携带 query；
 * - `switchTab(options)`: 跳转到 tabBar 页面，不支持 query；
 * - `navigateBack(options)`: 返回页面栈中的前一个或多个页面；
 * - `back(options?)`: 返回上一个页面（`delta=1` 的简化包装）；
 * - `push`: `navigateTo` 的别名；
 * - `replace`: `redirectTo` 的别名；
 * - `go(delta)`: 语义化封装，等价于 `navigateBack({ delta })`。
 *
 * 使用示例：
 * const router = useUniRouter();
 * router.navigateTo({ url: "/pages/detail/index", query: { id: 1 } });
 *
 * @returns {{
 *   navigateTo: (options: RouterParams) => ReturnType<typeof uni.navigateTo>,
 *   redirectTo: (options: RouterParams) => ReturnType<typeof uni.redirectTo>,
 *   reLaunch: (options: RouterParams) => ReturnType<typeof uni.reLaunch>,
 *   switchTab: (options: Omit<RouterParams, "query">) => ReturnType<typeof uni.switchTab>,
 *   navigateBack: (options: Pick<UniNamespace.NavigateBackOptions, "delta" | "animationType" | "animationDuration">) => ReturnType<typeof uni.navigateBack>,
 *   back: (options?: Pick<UniNamespace.NavigateBackOptions, "animationType" | "animationDuration">) => ReturnType<typeof uni.navigateBack>,
 *   push: (options: RouterParams) => ReturnType<typeof uni.navigateTo>,
 *   replace: (options: RouterParams) => ReturnType<typeof uni.redirectTo>,
 *   go: (delta: number) => ReturnType<typeof uni.navigateBack>
 * }} 导航方法集合。
 */
export function useUniRouter() {
  /**
   * 保留当前页面，跳转到指定页面。
   *
   * 会将 `options.query` 序列化为查询字符串并追加到 `url` 后面。
   * @param {RouterParams} options 跳转参数对象。
   * @param {`/${string}`} options.url 以 `/` 开头的目标页面路径。
   * @param {SearchParams|string|null} [options.query] 查询参数：对象将被编码为 query-string；字符串将被直接附加；为 `null` 或不传时不附加。
   * @returns {ReturnType<typeof uni.navigateTo>} 来自 `uni.navigateTo` 的返回值（具体依运行环境而定）。
   */
  const navigateTo = (options: RouterParams) => {
    return uni.navigateTo({ url: options.url + queryBuilder(options.query ?? {}) });
  };

  /**
   * 关闭当前页面，跳转到应用内的某个页面。
   *
   * 会将 `options.query` 序列化为查询字符串并追加到 `url` 后面。
   * @param {RouterParams} options 跳转参数对象。
   * @param {`/${string}`} options.url 以 `/` 开头的目标页面路径。
   * @param {SearchParams|string|null} [options.query] 查询参数：对象将被编码为 query-string；字符串将被直接附加；为 `null` 或不传时不附加。
   * @returns {ReturnType<typeof uni.redirectTo>} 来自 `uni.redirectTo` 的返回值（具体依运行环境而定）。
   */
  const redirectTo = (options: RouterParams) => {
    return uni.redirectTo({ url: options.url + queryBuilder(options.query ?? {}) });
  };

  /**
   * 关闭所有页面，打开到应用内的某个页面。
   *
   * 会将 `options.query` 序列化为查询字符串并追加到 `url` 后面。
   * @param {RouterParams} options 跳转参数对象。
   * @param {`/${string}`} options.url 以 `/` 开头的目标页面路径。
   * @param {SearchParams|string|null} [options.query] 查询参数：对象将被编码为 query-string；字符串将被直接附加；为 `null` 或不传时不附加。
   * @returns {ReturnType<typeof uni.reLaunch>} 来自 `uni.reLaunch` 的返回值（具体依运行环境而定）。
   */
  const reLaunch = (options: RouterParams) => {
    return uni.reLaunch({ url: options.url + queryBuilder(options.query ?? {}) });
  };

  /**
   * 跳转到 `tabBar` 页面。
   *
   * 注意：`switchTab` 不支持携带 `query` 参数。
   * @param {Omit<RouterParams, "query">} options 跳转参数，仅包含 `url`。
   * @param {`/${string}`} options.url 以 `/` 开头的目标 `tabBar` 页面路径。
   * @returns {ReturnType<typeof uni.switchTab>} 来自 `uni.switchTab` 的返回值（具体依运行环境而定）。
   */
  const switchTab = (options: Omit<RouterParams, "query">) => {
    return uni.switchTab({ url: options.url });
  };

  /**
   * 返回到上一个或多个页面。
   *
   * @param {Pick<UniNamespace.NavigateBackOptions, "delta" | "animationType" | "animationDuration">} options 返回配置。
   * @param {number} options.delta 要返回的页面数，`1` 表示返回上一页。
   * @param {string} [options.animationType] 返回动画类型（平台相关）。
   * @param {number} [options.animationDuration] 返回动画时长，单位毫秒。
   * @returns {ReturnType<typeof uni.navigateBack>} 来自 `uni.navigateBack` 的返回值（具体依运行环境而定）。
   */
  const navigateBack = (options: Pick<UniNamespace.NavigateBackOptions, "delta" | "animationType" | "animationDuration">) => {
    return uni.navigateBack(options);
  };

  /**
   * 返回到上一个页面的简化方法，等价于 `navigateBack({ delta: 1, ...options })`。
   *
   * @param {Pick<UniNamespace.NavigateBackOptions, "animationType" | "animationDuration">} [options] 返回动画相关配置（可选）。
   * @returns {ReturnType<typeof uni.navigateBack>} 来自 `uni.navigateBack` 的返回值（具体依运行环境而定）。
   */
  const back = (options?: Pick<UniNamespace.NavigateBackOptions, "animationType" | "animationDuration">) => navigateBack({ delta: 1, ...options });

  /**
   * 别名：与 `navigateTo` 等价。
   * @see navigateTo
   */
  const push = navigateTo;

  /**
   * 别名：与 `redirectTo` 等价。
   * @see redirectTo
   */
  const replace = redirectTo;

  /**
   * 别名：语义化封装，等价于 `navigateBack({ delta })`。
   * @param {number} delta 要返回的页面数。
   * @returns {ReturnType<typeof uni.navigateBack>} 来自 `uni.navigateBack` 的返回值（具体依运行环境而定）。
   */
  const go = (delta: number) => navigateBack({ delta });

  return { navigateTo, redirectTo, reLaunch, switchTab, navigateBack, back, push, replace, go };
}

/**
 * 将查询对象转换为 `query-string` 字符串。
 *
 * @internal
 * @param {SearchParams} query 查询对象。
 * @returns {string | null} 构建好的查询字符串；若对象为空返回 `null`。
 */
function queryDecoder(query: SearchParams): string | null {
  if (isEmpty(query)) return null;
  return reduce<SearchParams, string[]>(query, (result, value, key) => result.concat(`${key}=${encodeURIComponent(String(value))}`), []).join("&");
}

/**
 * 构建带有起始 `?` 的查询字符串。
 *
 * @internal
 * @param {SearchParams | string} params 查询参数对象或已拼接的字符串。
 * @returns {string} 若为对象则返回形如 `?a=1&b=2` 的字符串；对象为空则返回空字符串；传入字符串则前面统一追加 `?`。
 */
function queryBuilder(params: SearchParams | string): string {
  if (typeof params === "string") {
    return `?${params}`;
  } else {
    const qs = queryDecoder(params);
    return qs !== null ? `?${qs}` : "";
  }
}

/**
 * 路由跳转参数定义。
 *
 * - `url`: 以 `/` 开头的目标页面路径；
 * - `query`: 查询参数对象、已拼接的字符串或 `null`；
 */
interface RouterParams {
  url: `/${string}`;
  query?: SearchParams | string | null;
}

/**
 * 通用查询参数类型：键为字符串，值为任意可序列化类型。
 */
type SearchParams = {
  [x: string]: unknown;
};