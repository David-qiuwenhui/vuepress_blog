---
title: ES6 核心特性
author: qiuwenhui
date: "2024-05"
---

# ES6 核心特性

> 鸣谢：https://juejin.cn/post/7324931319267868707

## 一、ES Module的导入和导出

`ES6`的导入和导出是指在`ES6`规范中引入的模块化系统，用于更好地组织、管理和重用`JavaScript`代码。这一模块化系统提供了两个关键字：`import` 用于导入模块中的成员，`export` 用于将模块中的成员导出，使其可供其他模块使用。

1. 每一个JS文件都是一个独立的模块
2. 导入其它模块成员使用 import 关键字
3. 向外共享模块成员使用 export 关键字

### 1.1 默认导入和默认导出

#### 默认导出语法
`export default` 默认导出的成员
注意：每个模块中只允许使用唯一的一次 `export default`，默认导入时的接收名称可以是**任意合法名称**。

```js
// ./out.js
let name = '张三';
let age = 21;
function show() {
    console.log(name, age);
}

// 默认导出name和show方法
export default {
    name,
    show
}
```

#### 默认导入语法
`import` 接收名称 `from` '模块标识符'
```js
// App.vue
// 默认导入
import test from './default';

test.show(); // 张三 21
```


### 1.2 按需导出与按需导入

#### 按需导出语法
`export` 导出的属性或方法

```js
// ./need.js
export let name = '张三';
let age = 21;
export let gender = '男';
export function show() {
    console.log(name, age, gender);
}
```

#### 按需导入语法
`import` {对应的属性名或方法} `from` '模块标识符'

1. 每个模块中可以使用多次按需导出
2. 按需导入的成员名称必须和按需导出的名称保持一致
3. 按需导入时，可以使用 `as` 关键字进行重命名。

```js
// App.vue
// 按需导入
import { name, show } from '.need';

show(); // 张三 21 男
```

### 1.3 直接导入并执行模块中的代码
用于执行模块中的全局代码，不需要显式导入任何成员，只需导入模块本身

> 直接导入并执行方式主要用于模块中包含一些全局执行的代码，而不是导出特定的成员

```js
// ./direct.js
let name = '张三';
let age = 21;
let gender = '男';
console.log(name, age,gender);
```

```js
// App.vue
// 直接导入并执行
import './direct'; // 张三 21 男
```

### 小结

【默认导出与默认导入】适用于导出模块的整个对象，导入时可以选择使用任意合法名称。

【按需导出与按需导入】适用于有选择性地导入模块中的特定成员，可以多次导出和导入，支持重命名。

【直接导入并执行】适用于执行模块中的全局代码，不需要显式导入成员，只需导入模块本身。

