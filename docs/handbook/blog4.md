---
title: JS 代码评审
author: qiuwenhui
date: "2024-05"
---

# JS 代码评审

✅ 温故而知新：[阮一峰 ES6 编程风格](https://wangdoc.com/es6/style)

✅ 【重要核心】[ES6 完全使用手册 冴羽](https://github.com/mqyqingfeng/Blog/issues/111)

## 一、滥用 async/await

如果异步逻辑之间无继发关系，可以优化为同步发起，优化请求性能

### 案例一

`getList()` 和 `getAnotherList()` 其实并没有依赖关系，但是现在的这种写法，虽然简洁，却导致了 `getAnotherList()` 只能在 `getList()` 返回后才会执行，从而导致了多一倍的请求时间。

```js
// bad code
(async () => {
    const getList = await getList();
    const getAnotherList = await getAnotherList();
})();
```

```js
// 优化方式一 改写await位置
(async () => {
    const listPromise = getList();
    const anotherListPromise = getAnotherList();
    await listPromise;
    await anotherListPromise;
})();

// 优化方式二  Promise.all
(async () => {
  Promise.all([getList(), getAnotherList()]).then(...);
})();
```

### 案例二

`submit(listData)` 需要在 `getList()` 之后，`submit(anotherListData)` 需要在 `anotherListPromise()` 之后。

将互相依赖的语句包裹在 async 函数中

```js
// 并发执行 async 函数
async function handleList() {
    const listPromise = await getList();
    // ...
    await submit(listData);
}

async function handleAnotherList() {
    const anotherListPromise = await getAnotherList();
    // ...
    await submit(anotherListData);
}

// 方法一
(async () => {
    const handleListPromise = handleList();
    const handleAnotherListPromise = handleAnotherList();
    await handleListPromise;
    await handleAnotherListPromise;
})()(
    // 方法二
    async () => {
        Promise.all([handleList(), handleAnotherList()]).then();
    }
)();
```

### 继发与并发的推荐写法

问题：给定一个 URL 数组，如何实现接口的继发和并发？

#### async 继发实现

```js
// 继发一
async function loadData() {
    var res1 = await fetch(url1);
    var res2 = await fetch(url2);
    var res3 = await fetch(url3);
    return "whew all done";
}

// 继发二
async function loadData(urls) {
    for (const url of urls) {
        const response = await fetch(url);
        console.log(await response.text());
    }
}
```

#### async 并发实现

```js
// 并发一
async function loadData() {
    var res = await Promise.all([fetch(url1), fetch(url2), fetch(url3)]);
    return "whew all done";
}

// 并发二
async function loadData(urls) {
    // 并发读取 url
    const textPromises = urls.map(async (url) => {
        const response = await fetch(url);
        return response.text();
    });

    // 按次序输出
    for (const textPromise of textPromises) {
        console.log(await textPromise);
    }
}
```
