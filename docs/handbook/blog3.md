---
title: ES6 核心特性
author: qiuwenhui
date: "2024-05"
---

# ES6 核心特性

> 鸣谢：https://juejin.cn/post/7324931319267868707

## 一、ES Module 的导入和导出

`ES6`的导入和导出是指在`ES6`规范中引入的模块化系统，用于更好地组织、管理和重用`JavaScript`代码。这一模块化系统提供了两个关键字：`import` 用于导入模块中的成员，`export` 用于将模块中的成员导出，使其可供其他模块使用。

1. 每一个 JS 文件都是一个独立的模块
2. 导入其它模块成员使用 import 关键字
3. 向外共享模块成员使用 export 关键字

### 1.1 默认导入和默认导出

#### 默认导出语法

`export default` 默认导出的成员
注意：每个模块中只允许使用唯一的一次 `export default`，默认导入时的接收名称可以是**任意合法名称**。

```js
// ./out.js
let name = "张三";
let age = 21;
function show() {
    console.log(name, age);
}

// 默认导出name和show方法
export default {
    name,
    show,
};
```

#### 默认导入语法

`import` 接收名称 `from` '模块标识符'

```js
// App.vue
// 默认导入
import test from "./default";

test.show(); // 张三 21
```

### 1.2 按需导出与按需导入

#### 按需导出语法

`export` 导出的属性或方法

```js
// ./need.js
export let name = "张三";
let age = 21;
export let gender = "男";
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
import { name, show } from ".need";

show(); // 张三 21 男
```

### 1.3 直接导入并执行模块中的代码

用于执行模块中的全局代码，不需要显式导入任何成员，只需导入模块本身

> 直接导入并执行方式主要用于模块中包含一些全局执行的代码，而不是导出特定的成员

```js
// ./direct.js
let name = "张三";
let age = 21;
let gender = "男";
console.log(name, age, gender);
```

```js
// App.vue
// 直接导入并执行
import "./direct"; // 张三 21 男
```

### 小结

【默认导出与默认导入】适用于导出模块的整个对象，导入时可以选择使用任意合法名称。

【按需导出与按需导入】适用于有选择性地导入模块中的特定成员，可以多次导出和导入，支持重命名。

【直接导入并执行】适用于执行模块中的全局代码，不需要显式导入成员，只需导入模块本身。

## 二、Promise

### 2.1 Promise 的含义

所谓 Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。有两个特点：

（1）对象的状态不受外界影响。`Promise`对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。

（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。

缺点：

（1）无法取消 Promise，一旦新建它就会立即执行，无法中途取消。

（2）如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部。

（3）当处于 `pending` 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

### 2.2 基本用法

#### resolve 和 reject

resolve 函数的作用：将 Promise 对象的状态从 `pending` 变为 `resolved`，在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；

reject 函数的作用是，将 Promise 对象的状态从 `pending` 变为 `rejected`，在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

#### Promise 实例

```js
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

#### Promise.prototype.then()

Promise 实例生成以后，可以用 `then` 方法分别指定 `resolved` 状态和 `rejected` 状态的回调函数。

> then 方法可以接受两个回调函数作为参数。第一个回调函数是 `Promise` 对象的状态变为 `resolved` 时调用，第二个回调函数是 `Promise` 对象的状态变为 `rejected` 时调用。
> 这两个函数都是可选的，它们都接受 `Promise` 对象传出的值作为参数。

```js
promise.then(
    function (value) {
        // success
    },
    function (error) {
        // failure
    }
);
```

注意：如果 then 的第二个回调函数捕获了`reject`的处理，则`catch`不会进行处理

```js
new Promise((resolve, reject) => {
    // resolve(1);
    // resolve(new Error('123'));
    reject(new Error("123"));
})
    .then(
        (r) => {
            console.log("then1 r", r);
            resolve(r);
        },
        (e) => {
            console.log("then1 e", e);
            reject(e);
        }
    )
    .catch((err) => {
        console.log("err", err);
    });
```

链式调用 then 返回的是一个新 promise 实例，如果对 promise 实例做定义，后面调用的 then 继续根据处理结果进行回调

```js
new Promise((resolve, reject) => {
    reject(new Error("123"));
})
    .then(
        (r) => {
            console.log("then1 r", r);
            return r;
            // new Promise.resolve(r);
        },
        (e) => {
            console.log("then1 e", e);
            return new Promise((res, rej) => {
                rej("then1 reject");
            });
            // Promise.reject(e);
        }
    )
    .then(
        (res) => {
            console.log(res);
            console.log("then2 r", res);
        },
        (rej) => {
            console.log(rej);
            console.log("then2 e", rej);
        }
    )
    .catch((err) => {
        console.log("err.............", err);
    });
```

### 2.3 resolve 的参数是另外一个 promise

如果调用 `resolve` 函数和 `reject` 函数时带有参数，那么它们的参数会被传递给回调函数。 `reject` 函数的参数通常是 `Error` 对象的实例，表示抛出的错误；
`resolve` 函数的参数除了正常的值以外，还可能是另一个 `Promise` 实例，比如像下面这样。

#### 示例一

上面代码中，`p1` 和 `p2` 都是 `Promise` 的实例，但是 `p2` 的 `resolve` 方法将 `p1` 作为参数，即一个异步操作的结果是返回另一个异步操作。**p1 的状态决定了 p2 的状态**

```js
const p1 = new Promise(function (resolve, reject) {
    // ...
});

const p2 = new Promise(function (resolve, reject) {
    // ...
    resolve(p1);
});
```

#### 示例二

下面代码中，`p1`是一个 `Promise`，3 秒之后变为`rejected`。`p2`的状态在 1 秒之后改变，`resolve`方法返回的是`p1`。由于`p2`返回的是另一个 `Promise`，导致`p2`自己的状态无效了，由`p1`的状态决定`p2`的状态。所以，后面的`then`语句都变成针对后者（`p1`）。又过了 2 秒，`p1`变为`rejected`，导致触发`catch`方法指定的回调函数。

```js
const p1 = new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error("fail")), 3000);
});

const p2 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(p1), 1000);
});

p2.then(
    (result) => console.log("result", result),
    (err) => console.log("then err", err)
).catch((error) => console.log("error", error));
```

### 2.4 Promise.prototype.catch()

本质：`Promise.prototype.catch()`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数。

```js
p.then((val) => console.log("fulfilled:", val)).catch((err) =>
    console.log("rejected", err)
);

// 等同于
p.then((val) => console.log("fulfilled:", val)).then(null, (err) =>
    console.log("rejected:", err)
);
```

示例：catch 捕获错误的三种等效写法

```js
// 写法一
const promise = new Promise(function (resolve, reject) {
    throw new Error("test");
});
promise.catch(function (error) {
    console.log(error);
});
// Error: test

// 写法二
const promise = new Promise(function (resolve, reject) {
    try {
        throw new Error("test");
    } catch (e) {
        reject(e);
    }
});
promise.catch(function (error) {
    console.log(error);
});

// 写法三
const promise = new Promise(function (resolve, reject) {
    reject(new Error("test"));
});
promise.catch(function (error) {
    console.log(error);
});
```

#### 错误的捕获有冒泡性质

Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个 catch 语句捕获。

【建议】：一般来说，不要在 `then()` 方法里面定义 `Reject` 状态的回调函数（即 `then` 的第二个参数），总是使用 `catch` 方法。

> 理由是第二种写法可以捕获前面 then 方法执行中的错误，也更接近同步的写法（try/catch）

```js
// bad
promise.then(
    function (data) {
        // success
    },
    function (err) {
        // error
    }
);

// good
promise
    .then(function (data) {
        //cb
        // success
    })
    .catch(function (err) {
        // error
    });
```

示例：
下面代码中，一共有三个 `Promise` 对象：一个由 `getJSON()` 产生，两个由 `then()` 产生。它们之中任何一个抛出的错误，都会被最后一个 `catch()` 捕获。

```js
getJSON("/post/1.json")
    .then(function (post) {
        return getJSON(post.commentURL);
    })
    .then(function (comments) {
        // some code
    })
    .catch(function (error) {
        // 处理前面三个Promise产生的错误
    });
```

#### Promise 对象抛出的错误不会传递到外层的代码

> 跟传统的 `try/catch` 代码块不同的是，如果没有使用 `catch()` 方法指定错误处理的回调函数，`Promise` 对象抛出的错误不会传递到外层代码，即不会有任何反应。
> 一般总是建议，`Promise` 对象后面要跟 `catch()`方法，这样可以处理 `Promise` 内部发生的错误。`catch()`方法返回的还是一个 `Promise` 对象，因此后面还可以接着调用 `then()` 方法。

```js
const someAsyncThing = function () {
    return new Promise(function (resolve, reject) {
        // 下面一行会报错，因为x没有声明
        resolve(x + 2);
    });
};

someAsyncThing().then(function () {
    console.log("everything is great");
});

setTimeout(() => {
    console.log(123);
}, 2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123
```

### 2.5 Promise.prototype.finally()

`finally()` 方法用于指定不管 `Promise` 对象最后状态如何，在执行完 `then` 或 `catch` 指定的回调函数以后，都会执行 `finally` 方法指定的回调函数。

```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

`finally` 本质上是 `then` 方法的特例。

```js
promise.finally(() => {
    // 语句
});

// 等同于
promise.then(
    (result) => {
        // 语句
        return result;
    },
    (error) => {
        // 语句
        throw error;
    }
);
```

### 2.6 Promise.all()

`Promise.all()` 方法用于将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。

> `Promise.all()`方法接受一个数组作为参数，`p1、p2、p3` 都是 `Promise` 实例，如果不是，就会先调用下面讲到的 `Promise.resolve` 方法，将参数转为 `Promise` 实例，再进一步处理。

```js
const p = Promise.all([p1, p2, p3]);
```

`Promise.all()`的触发逻辑：

1. 只有 `p1、p2、p3` 的状态都变成 `fulfilled`，`p` 的状态才会变成 `fulfilled`，此时 `p1、p2、p3` 的返回值组成一个数组，传递给 `p` 的回调函数。
2. 只要 `p1、p2、p3` 之中有一个被 `rejected`，`p` 的状态就变成 `rejected`，此时第一个被 `reject` 的实例的返回值，会传递给 `p` 的回调函数。

#### reject 提前被实例成员自身 catch 捕获

注意，如果作为参数的 `Promise` 实例，自己定义了 `catch` 方法，那么它一旦被 `rejected`，并不会触发 `Promise.all()` 的 `catch` 方法。

示例：

```js
const p1 = new Promise((resolve, reject) => {
    resolve("hello");
})
    .then((result) => result)
    .catch((e) => e);

const p2 = new Promise((resolve, reject) => {
    throw new Error("报错了");
})
    .then((result) => result)
    .catch((e) => e);

Promise.all([p1, p2])
    .then((result) => console.log("result: ", result))
    .catch((e) => console.log("e: ", e));
// result: ["hello", Error: 报错了]
```

### 2.7 Promise.race()

`Promise.race()` 方法同样是将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。

> `Promise.race()` 方法的参数如果不是 `Promise` 实例，就会先调用下面讲到的 `Promise.resolve()` 方法，将参数转为 `Promise` 实例，再进一步处理。

```js
const p = Promise.race([p1, p2, p3]);
```

只要 `p1、p2、p3` 之中有一个实例率先改变状态，`p` 的状态就跟着改变。那个率先改变的 `Promise` 实例的返回值，就传递给 `p` 的回调函数。

示例：如果指定时间内没有获得结果，就将 `Promise` 的状态变为 `reject`，否则变为 `resolve`。

```js
const p = Promise.race([
    fetch("/resource-that-may-take-a-while"),
    new Promise(function (resolve, reject) {
        setTimeout(() => reject(new Error("request timeout")), 5000);
    }),
]);

p.then(console.log).catch(console.error);
```

上面代码中，如果 5 秒之内 `fetch` 方法无法返回结果，变量 p 的状态就会变为 `rejected`，从而触发 `catch` 方法指定的回调函数。

### 2.8 Promise.allSettled()

`ES2020` 引入了 `Promise.allSettled()` 方法，用来确定一组异步操作是否都结束了（不管成功或失败）。

`Promise.allSettled()` 方法接受一个数组作为参数，数组的每个成员都是一个 `Promise` 对象，并返回一个新的 `Promise` 对象。只有等到参数数组的所有 `Promise` 对象都发生状态变更（不管是 `fulfilled` 还是 `rejected`），返回的 `Promise` 对象才会发生状态变更。

**`Promise.allSettled()`方法只会有 `fulfilled` 的最终状态**

示例：数组 `promises` 包含了三个请求，只有等到这三个请求都结束了（不管请求成功还是失败），`removeLoadingIndicator()` 才会执行。

```js
// 场景 后面的逻辑依赖promise全部更新状态
const promises = [fetch("/api-1"), fetch("/api-2"), fetch("/api-3")];

await Promise.allSettled(promises);
removeLoadingIndicator();
```

`Promise.allSettled()`的回调入参`results` 的每个成员是一个对象，对象的格式是固定的，对应异步操作的结果。

```js
// 异步操作成功时
{status: 'fulfilled', value: value}

// 异步操作失败时
{status: 'rejected', reason: reason}
```

示例二：过滤出成功和失败的请求

```js
// 场景一 获取全部promise的结果
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function (results) {
    console.log(results);
});
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]

// 场景二 过滤出成功和失败的请求
const promises = [fetch("index.html"), fetch("https://does-not-exist/")];
const results = await Promise.allSettled(promises);

// 过滤出成功的请求
const successfulPromises = results.filter((p) => p.status === "fulfilled");

// 过滤出失败的请求，并输出原因
const errors = results
    .filter((p) => p.status === "rejected")
    .map((p) => p.reason);
```

### 2.9 Promise.any()

`ES2021` 引入了 `Promise.any()`方法。该方法接受一组 `Promise` 实例作为参数，包装成一个新的 `Promise` 实例返回。

只要参数实例有一个变成 `fulfilled` 状态，包装实例就会变成 `fulfilled` 状态；如果所有参数实例都变成 `rejected` 状态，包装实例就会变成 `rejected` 状态。

```js
Promise.any([
    fetch("https://v8.dev/").then(() => "home"),
    fetch("https://v8.dev/blog").then(() => "blog"),
    fetch("https://v8.dev/docs").then(() => "docs"),
])
    .then((first) => {
        // 只要有一个 fetch() 请求成功
        console.log(first);
    })
    .catch((error) => {
        // 所有三个 fetch() 全部请求失败
        console.log(error);
    });
```

示例：Promise()与 await 命令结合使用

```js
const promises = [
    fetch("/endpoint-a").then(() => "a"),
    fetch("/endpoint-b").then(() => "b"),
    fetch("/endpoint-c").then(() => "c"),
];

try {
    const first = await Promise.any(promises);
    console.log(first);
} catch (error) {
    console.log(error);
}
```

示例：收集到的成功或者错误信息
`Promise.any()` 抛出的错误是一个 `AggregateError` 实例对象，对象的 `errors` 属性是一个数组，包含了所有成员的错误。

```js
var resolved = Promise.resolve(42);
var rejected = Promise.reject(-1);
var alsoRejected = Promise.reject(Infinity);

Promise.any([resolved, rejected, alsoRejected]).then(function (result) {
    console.log(result); // 42
});

Promise.any([rejected, alsoRejected]).catch(function (results) {
    console.log(results instanceof AggregateError); // true
    console.log(results.errors); // [-1, Infinity]
});
```

### 2.10 Promise.resolve()

有时需要将现有对象转为 `Promise` 对象，`Promise.resolve()` 方法就起到这个作用。

`Promise.resolve()` 等价于下面的写法。

```js
Promise.resolve("foo");
// 等价于
new Promise((resolve) => resolve("foo"));
```

Promise.resolve()方法的参数分成四种情况:

#### （1）参数是一个 Promise 实例

Promise.resolve 将不做任何修改、原封不动地返回这个实例。

#### （2）参数是一个 thenable 对象

thenable 对象指的是具有 then 方法的对象，比如下面这个对象。

```js
let thenable = {
    then: function (resolve, reject) {
        resolve(42);
    },
};
```

`Promise.resolve()` 方法会将这个对象转为 `Promise` 对象，然后就立即执行 `thenable` 对象的 `then()` 方法。

```js
let thenable = {
    then: function (resolve, reject) {
        resolve(42);
    },
};

let p1 = Promise.resolve(thenable);
p1.then(function (value) {
    console.log(value); // 42
});
```

#### （3）参数不是具有 then()方法的对象，或根本就不是对象

如果参数是一个原始值，或者是一个不具有 `then()`方法的对象，则 `Promise.resolve()` 方法返回一个新的 `Promise` 对象，状态为 `resolved`。

```js
const p = Promise.resolve("Hello");

p.then(function (s) {
    console.log(s);
});
// Hello
```

#### （4）不带有任何参数

`Promise.resolve()`方法允许调用时不带参数，直接返回一个 `resolved` 状态的 `Promise` 对象。

所以，如果希望得到一个 `Promise` 对象，比较方便的方法就是直接调用 `Promise.resolve()` 方法。

```js
const p = Promise.resolve();

p.then(function () {
    // ...
});
```

#### Promise.resolve() 执行时机

需要注意的是，立即 `resolve()` 的 `Promise` 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时。

```js
setTimeout(function () {
    console.log("three");
}, 0);

Promise.resolve().then(function () {
    console.log("two");
});

console.log("one");

// one
// two
// three
```

### 2.11 Promise.reject()

`Promise.reject(reason)` 方法也会返回一个新的 `Promise` 实例，该实例的状态为 `rejected`。

```js
const p = Promise.reject("出错了");
// 等同于
const p = new Promise((resolve, reject) => reject("出错了"));

p.then(null, function (s) {
    console.log(s);
});
// 出错了
```

`Promise.reject()` 方法的参数，会原封不动地作为 `reject` 的理由，变成后续方法的参数。

```js
Promise.reject("出错了").catch((e) => {
    console.log(e === "出错了");
});
// true
```

### 2.12 应用 加载图片

我们可以将图片的加载写成一个 `Promise`，一旦加载完成，`Promise` 的状态就发生变化。

```js
const preloadImage = function (path) {
    return new Promise(function (resolve, reject) {
        const image = new Image();
        image.onload = resolve;
        image.onerror = reject;
        image.src = path;
    });
};
```

### 2.13 Promise.try()

实际开发中，经常遇到一种情况：不知道或者不想区分，函数 `f` 是同步函数还是异步操作，但是想用 `Promise` 来处理它。因为这样就可以不管 `f` 是否包含异步操作，都用 `then` 方法指定下一步流程，用 `catch` 方法处理 `f` 抛出的错误。一般就会采用下面的写法。

```js
Promise.resolve().then(f);
```

上面的写法有一个缺点，就是如果`f`是同步函数，那么它会在本轮事件循环的末尾执行。

> 函数 `f` 是同步的，但是用 `Promise` 包装了以后，就变成异步执行了。

```js
const f = () => console.log("now");
Promise.resolve().then(f);
console.log("next");
// next
// now
```

#### 让同步函数同步执行，异步函数异步执行，并且让它们具有统一的 API

（1）写法一：用 `async` 函数来写

```js
const f = () => console.log("now");
(async () => f())().then().catch();
console.log("next");
// now
// next
```

需要注意的是，`async () => f()` 会吃掉 `f()` 抛出的错误。所以，如果想捕获错误，要使用 `promise.catch` 方法。

（2）写法二：使用 `new Promise()`

```js
const f = () => console.log("now");
(() => new Promise((resolve) => resolve(f())))();
console.log("next");
// now
// next
```

（3）【推荐】写法三：`Promise.try()`

```js
const f = () => console.log("now");
Promise.try(f);
console.log("next");
// now
// next
```

由于 `Promise.try` 为所有操作提供了统一的处理机制，所以如果想用 `then` 方法管理流程，最好都用 `Promise.try` 包装一下。这样有许多好处，其中一点就是可以更好地管理异常。

示例：需要捕获数据库请求中的同步错误（可能出现数据库连接错误的情况）

事实上，`Promise.try` 就是模拟 `try` 代码块，就像 `promise.catch` 模拟的是 `catch` 代码块。

```js
// 原写法
try {
    database.users.get({ id: userId }).then().catch();
} catch (e) {
    // ...
}

// 优化写法
Promise.try(() => database.users.get({id: userId}))
  .then(...)
  .catch(...)
```

## 三、Async 函数

任何一个 `await` 语句后面的 `Promise` 对象变为 `reject` 状态，那么整个 `async` 函数都会中断执行。
下面代码中，第二个 `await` 语句是不会执行的，因为第一个 `await` 语句状态变成了 `reject` 。

```js
async function f() {
    await Promise.reject("出错了");
    await Promise.resolve("hello world"); // 不会执行
}
```

解决方法一：
有时，我们希望即使前一个异步操作失败，也不要中断后面的异步操作。这时可以将第一个 `await` 放在 `try...catch` 结构里面，这样不管这个异步操作是否成功，第二个 `await` 都会执行。

```js
async function f() {
    try {
        await Promise.reject("出错了");
    } catch (e) {}
    return await Promise.resolve("hello world");
}

f().then((v) => console.log(v));
// hello world
```

解决方法二：
另一种方法是 `await` 后面的 `Promise` 对象再跟一个 `catch` 方法，处理前面可能出现的错误。

```js
async function f() {
    await Promise.reject("出错了").catch((e) => console.log(e));
    return await Promise.resolve("hello world");
}

f().then((v) => console.log(v));
// 出错了
// hello world
```

### 3.1 使用注意点

#### （1）async 函数内利用 try/catch 捕获错误

`await` 命令后面的 `Promise` 对象，运行结果可能是 `rejected` ，所以最好把 `await` 命令放在 `try...catch` 代码块中。

```js
async function myFunction() {
    try {
        await somethingThatReturnsAPromise();
    } catch (err) {
        console.log(err);
    }
}

// 另一种写法

async function myFunction() {
    await somethingThatReturnsAPromise().catch(function (err) {
        console.log(err);
    });
}
```

#### （2）不存在继发关系的逻辑，写为同步触发（不滥用 await）

下面代码中，`getFoo` 和 `getBar` 是两个独立的异步操作（即互不依赖），被写成继发关系。这样比较耗时，因为只有 `getFoo` 完成以后，才会执行 `getBar`，完全可以让它们同时触发。

```js
let foo = await getFoo();
let bar = await getBar();
```

##### 同步触发的优化写法

`getFoo` 和 `getBar` 都是同时触发，这样就会缩短程序的执行时间。

```js
// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```

#### （3）await 命令只能用在 async 函数之中，如果用在普通函数，就会报错

`arr.forEach()` 函数里写成 `async/await` 可能会得到错误的结果

```js
function dbFuc(db) {
    //这里不需要 async
    let docs = [{}, {}, {}];

    // 可能得到错误结果 三个 db.post(doc) 是并发执行
    docs.forEach(async function (doc) {
        await db.post(doc);
    });
}

// 正确的写法 for 循环
async function dbFuc(db) {
    let docs = [{}, {}, {}];

    for (let doc of docs) {
        await db.post(doc);
    }
}

// 正确的写法二 改成数组的reduce方法
async function dbFuc(db) {
    let docs = [{}, {}, {}];

    await docs.reduce(async (_, doc) => {
        await _;
        await db.post(doc);
    }, undefined);
}
```

推荐使用`promise.all`实现并发执行

```js
async function dbFuc(db) {
    let docs = [{}, {}, {}];
    let promises = docs.map((doc) => db.post(doc));

    let results = await Promise.all(promises);
    console.log(results);
}

// 或者使用下面的写法

async function dbFuc(db) {
    let docs = [{}, {}, {}];
    let promises = docs.map((doc) => db.post(doc));

    let results = [];
    for (let promise of promises) {
        results.push(await promise);
    }
    console.log(results);
}
```

#### （4）async 函数可以保留运行堆栈

上面代码中，函数 `a` 内部运行了一个异步任务 `b()`。当 `b()` 运行的时候，函数 `a()` 不会中断，而是继续执行。等到 `b()` 运行结束，可能 `a()` 早就运行结束了，`b()` 所在的上下文环境已经消失了。如果 `b()` 或 `c()` 报错，错误堆栈将不包括 `a()`。

```js
const a = () => {
    b().then(() => c());
};
```

现在将这个例子改成 async 函数
`b()` 运行的时候，`a()` 是暂停执行，上下文环境都保存着。一旦 `b()` 或 `c()` 报错，错误堆栈将包括 `a()`。

```js
const a = async () => {
    await b();
    c();
};
```

### 3.2 实例：按顺序完成异步操作

实际开发中，经常遇到一组异步操作，需要按照顺序完成。比如，依次远程读取一组 `URL`，然后按照读取的顺序输出结果。

#### Promise 的写法

代码使用 `fetch` 方法，同时远程读取一组 `URL`。每个 `fetch` 操作都返回一个 `Promise` 对象，放入 `textPromises` 数组。然后，`reduce` 方法依次处理每个 `Promise` 对象，然后使用 `then`，将所有 `Promise` 对象连起来，因此就可以依次输出结果。

【缺点】这种写法不太直观，可读性比较差。

```js
function logInOrder(urls) {
    // 远程读取所有 URL
    const textPromises = urls.map((url) => {
        return fetch(url).then((response) => response.text());
    });

    // 按次序输出
    textPromises.reduce((chain, textPromise) => {
        return chain.then(() => textPromise).then((text) => console.log(text));
    }, Promise.resolve());
}
```

#### async 函数实现

下面代码中，虽然 `map` 方法的参数是 `async` 函数，但它是**并发执行**的，因为只有 `async` 函数内部是继发执行，外部不受影响。后面的 `for..of` 循环内部使用了 `await`，因此实现了**按顺序输出**。

```js
async function logInOrder(urls) {
    // 并发读取远程URL
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

#### reduce 实现按顺序调用异步逻辑

上一个处理完成后才执行下一个

```js
// 以队列的形式执行定时器 上一个定时器结束再执行下一个
// const arr = [1, 2, 3];
const arr = [3, 2, 1];

const promise = arr.reduce((total, cur) => {
    return total.then(() => {
        console.log("cur....", cur);

        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("cur: ", cur);
                resolve();
            }, cur * 1000);
        });
    });
}, Promise.resolve());

// cur.... 3
// cur:  3
// cur.... 2
// cur:  2
// cur.... 1
// cur:  1
```

##### 红绿灯问题

题目：红灯 3 秒亮一次，绿灯 2 秒亮一次，黄灯 1 秒亮一次；如何让三个灯不断交替重复亮灯？（用 `Promise` 实现）

```js
// 三个亮灯函数
function red() {
    console.log("red");
}
function green() {
    console.log("green");
}
function yellow() {
    console.log("yellow");
}

var light = function (timmer, cb) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            cb();
            resolve();
        }, timmer);
    });
};

var step = function () {
    Promise.resolve()
        .then(function () {
            return light(3000, red);
        })
        .then(function () {
            return light(2000, green);
        })
        .then(function () {
            return light(1000, yellow);
        })
        .then(function () {
            step();
        });
};

step();
```

### 3.3 顶层 await

顶层的 await 命令，它的主要目的是使用 await 解决模块异步加载的问题。它保证只有异步操作完成，模块才会输出值。

```js
// awaiting.js
const dynamic = import(someMission);
const data = fetch(url);
export const output = someProcess((await dynamic).default, await data);
```

上面代码中，两个异步操作在输出的时候，都加上了 await 命令。只有等到异步操作完成，这个模块才会输出值。
加载这个模块的写法如下。

```js
// usage.js
import { output } from "./awaiting.js";
function outputPlusValue(value) {
    return output + value;
}

console.log(outputPlusValue(100));
setTimeout(() => console.log(outputPlusValue(100)), 1000);
```

上面代码的写法，与普通的模块加载完全一样。也就是说，模块的使用者完全不用关心，依赖模块的内部有没有异步操作，正常加载即可。
这时，模块的加载会等待依赖模块（上例是 `awaiting.js`）的异步操作完成，才执行后面的代码，有点像暂停在那里。所以，它总是会得到正确的 `output`，不会因为加载时机的不同，而得到不一样的值。

> 注意，顶层 `await` 只能用在 `ES6` 模块，不能用在 `CommonJS` 模块。这是因为 `CommonJS` 模块的 `require()` 是同步加载，如果有顶层 `await`，就没法处理加载了。

#### 使用场景

```js
// import() 方法加载
const strings = await import(`/i18n/${navigator.language}`);

// 数据库操作
const connection = await dbConnector();

// 依赖回滚
let jQuery;
try {
    jQuery = await import("https://cdn-a.com/jQuery");
} catch {
    jQuery = await import("https://cdn-b.com/jQuery");
}
```

注意，如果加载多个包含顶层 await 命令的模块，加载命令是同步执行的。

```js
// x.js
console.log("X1");
await new Promise((r) => setTimeout(r, 1000));
console.log("X2");

// y.js
console.log("Y");

// z.js
import "./x.js";
import "./y.js";
console.log("Z");
```

上面代码有三个模块，最后的 `z.js` 加载 `x.js` 和 `y.js`，打印结果是 `X1、Y、X2、Z`。这说明，`z.js` 并没有等待 `x.js` 加载完成，再去加载 `y.js`。

顶层的 `await` 命令有点像，交出代码的执行权给其他的模块加载，等异步操作完成后，再拿回执行权，继续向下执行。

### 3.4 async 会取代 Promise 吗？

1. `async` 函数返回一个 `Promise` 对象

2. 面对复杂的异步流程，`Promise` 提供的 `all` 和 `race` 会更加好用

3. `Promise` 本身是一个对象，所以可以在代码中任意传递

4. `async` 的支持率还很低，即使有 `Babel`，编译后也要增加 1000 行左右。
