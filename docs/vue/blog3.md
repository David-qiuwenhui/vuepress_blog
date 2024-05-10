---
title: Vue2 补充用法
author: qiuwenhui
date: "2024-05"
---

# Vue2 补充用法

## 一、Vue 过滤器

`Vue.js` 允许你自定义过滤器，可被用于一些常见的文本格式化。过滤器可以用在两个地方：双花括号插值和 `v-bind` 表达式。过滤器应该被添加在 `JavaScript` 表达式的尾部，由“管道”符号指示：

功能：对要显示的数据进行特定格式化后再显示。
注意：过滤器并没有改变原本的数据，需要对展现的数据进行包装。
使用场景：双花括号插值和 `v-bind` 表达式

### 过滤器用法

```vue
<!-- 1. 在双花括号中 -->
<div>{{ message | capitalize }}</div>
<!-- 过滤器可以串联 -->
<div>{{ message | filterA | filterB }}</div>
<!-- 过滤器可以串联和传参 此处arg1为过滤器函数的第二个入参 -->
<div>{{ message | filterA | filterB('arg1', 'arg2') }}</div>

<!-- 2. 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>
```

### 定义过滤器

#### 组件内定义

在一个组件的选项中定义本地的过滤器：

```js
export default {
    // ...
    filters: {
        capitalize: function (value) {
            if (!value) return "";
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
    },
};
```

#### 全局定义

或者在创建 `Vue` 实例之前全局定义过滤器：

```js
Vue.filter("capitalize", function (value) {
    if (!value) return "";
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1);
});

new Vue({
    // ...
});
```
