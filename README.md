# uniapp-router-plugin

A lightweight routing utility library for uni-app that provides:
- Friendly navigation method wrappers (automatic query string concatenation and encoding)
- Read current page routing information (query, path, fullPath) in Composition API

[中文文档](./README.zh-CN.md)

## Installation

```bash
# Using pnpm
pnpm add uniapp-router-plugin

# Or using npm
npm i uniapp-router-plugin
```

## Quick Start

```ts
import { useUniRouter, useUniRoute } from 'uniapp-router-plugin'

// Navigation example
const router = useUniRouter()
router.navigateTo({ url: '/pages/detail/index', query: { id: 123, from: 'home' } })
router.back() // Go back to previous page

// Read current route information example
const route = useUniRoute<{
  /** Page ID */
  id: string; 
  /** Source page */
  from?: string
}>() // Complete type definition

const route2 = useUniRoute(['id', 'from']) // Simpler type definition

console.log(route.query.id)     // "123"
console.log(route.path)         // e.g.: "pages/detail/index"
console.log(route.fullPath)     // e.g.: "/pages/detail/index?id=123&from=home"
```

Note: `switchTab({ url })` does not support `query`, consistent with uni-app behavior.

## API Overview

- `useUniRouter()` returns the following methods:
  - `navigateTo(options)` Keep current page and navigate, can carry query
  - `redirectTo(options)` Close current page and navigate, can carry query
  - `reLaunch(options)` Close all pages and navigate, can carry query
  - `switchTab(options)` Navigate to tabBar page (does not support query)
  - `navigateBack(options)` Go back to previous page(s)
  - `back(options?)` Go back to previous page (simplified wrapper for `navigateBack({ delta: 1 })`)
  - `push`, `replace`, `go` are semantic aliases for the above methods
- `useUniRoute<T>()` returns a reactive object `{ query: T, path, fullPath }`

## Runtime Requirements

From `peerDependencies`:
- `@dcloudio/uni-app >= 3.0.0-alpha-3000020210521001`
- `vue >= 3.0.0`

## License

MIT

## Related Links

- Repository & Issue Feedback: https://github.com/tuanzisama/uniapp-router-plugin