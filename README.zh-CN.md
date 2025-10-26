# uniapp-router-plugin

一个用于 uni-app 的轻量路由工具库，提供：
- 更友好的导航方法封装（自动处理查询串拼接与编码）；
- 在组合式 API 中读取当前页面的路由信息（query、path、fullPath）。

[English](./README.md)

## 安装

```bash
# 使用 pnpm
pnpm add uniapp-router-plugin

# 或使用 npm
npm i uniapp-router-plugin
```

## 快速上手

```ts
import { useUniRouter, useUniRoute } from 'uniapp-router-plugin'

// 导航示例
const router = useUniRouter()
router.navigateTo({ url: '/pages/detail/index', query: { id: 123, from: 'home' } })
router.back() // 返回上一页

// 读取当前路由信息示例

// 完整的类型定义
const route = useUniRoute<{
  /** 页面 ID */
  id: string; 
  /** 来源页面(可选) */
  from?: string
}>() 

 // 或使用更简单的类型定义
const route2 = useUniRoute(['id', 'from'])

console.log(route.query.id)     // "123"
console.log(route.path)         // 如："pages/detail/index"
console.log(route.fullPath)     // 如："/pages/detail/index?id=123&from=home"
```

提示：`switchTab({ url })` 不支持 `query`，与 uni-app 行为一致。

## API 概览

- `useUniRouter()` 返回以下方法：
  - `navigateTo(options)` 保留当前页并跳转，可携带 query
  - `redirectTo(options)` 关闭当前页并跳转，可携带 query
  - `reLaunch(options)` 关闭所有页面并跳转，可携带 query
  - `switchTab(options)` 跳转到 tabBar 页面（不支持 query）
  - `navigateBack(options)` 返回到上一个或多个页面
  - `back(options?)` 返回上一页（`navigateBack({ delta: 1 })` 的简化封装）
  - `push`、`replace`、`go` 为以上方法的语义化别名
- `useUniRoute<T>()` 返回一个响应式对象 `{ query: T, path, fullPath }`

## 运行环境要求

来自 `peerDependencies`：
- `@dcloudio/uni-app >= 3.0.0-alpha-3000020210521001`
- `vue >= 3.0.0`

## 许可证

MIT

## 相关链接

- 仓库与问题反馈：https://github.com/tuanzisama/uniapp-router-plugin