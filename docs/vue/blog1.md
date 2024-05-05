---
title: Vue2 进阶用法
author: qiuwenhui
date: "2024-05"
---

# Vue2 进阶用法

## 一、父子组件数据双向绑定语法糖

### 1.1 v-model

特点：只能绑定一个变量

#### 方式一： 使用 props/value 配合 emit/input 进行绑定（只能绑定 1 个）

用法：`props` 中的 `value` 属性默认为双向绑定的变量，`emit/input `对变量进行修改

缺点: `value/input` 的命名可读性不佳

宿主组件

```vue
<template>
    <div id="app">
        <HelloWorld v-model="title" />
    </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
export default {
    name: "App",
    components: {
        HelloWorld,
    },
    data() {
        return {
            title: "hello vuejs",
        };
    },
};
</script>
```

成员组件

```vue
<template>
    <div>
        <h1>{{ value }}</h1>
        <button @click="handleChangeProps">click</button>
    </div>
</template>

<script>
export default {
    props: ["value"],
    methods: {
        handleChangeProps() {
            this.$emit("input", "changeTitle");
        },
    },
};
</script>
```

#### 方式二：model 配合 props/emit 自定义变量和事件名（只能绑定 1 个）

用法：在 `model` 中定义双向绑定的变量和数据更新事件名，`props` 中传入变量，`this.$emit` 时调用自定义的事件名

宿主组件

```vue
<template>
    <div id="app">
        <HelloWorld v-model="title" />
    </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
export default {
    name: "App",
    components: {
        HelloWorld,
    },
    data() {
        return {
            title: "hello vuejs",
        };
    },
};
</script>
```

成员组件

```vue
<template>
    <div>
        <h1>{{ title }}</h1>
        <button @click="handleChangeProps">click</button>
    </div>
</template>

<script>
export default {
    props: ["title"],
    model: {
        prop: "title",
        event: "changeTitle",
    },
    methods: {
        handleChangeProps() {
            this.$emit("changeTitle", "changeTitle");
        },
    },
};
</script>
```

### 1.2 方式二：.sync 修饰符（不限制数量）

用法：在宿主组件中，对需要绑定的变量名加上`.sync`修饰符，成员组件的 emit 数据更新函数中，用`update:title`的形式修改双向绑定的变量（此处的`title`变量为举例）

宿主组件

```vue
<template>
    <div id="app">
        <HelloWorld :title.sync="appTitle" />
    </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
export default {
    name: "App",
    components: {
        HelloWorld,
    },
    data() {
        return {
            appTitle: "hello vuejs",
        };
    },
};
</script>
```

成员组件

```vue
<template>
    <div>
        <h1>{{ title }}</h1>
        <button @click="handleChangeProps">click</button>
    </div>
</template>

<script>
export default {
    props: ["title"],
    data() {
        return {};
    },
    methods: {
        handleChangeProps() {
            this.$emit("update:title", "changeTitle");
        },
    },
};
</script>
```

## 二、slot 插槽

### 插槽类型

1. 默认插槽（名称为`default`）
2. 具名插槽
3. 作用域插槽（父子组件进行数据通讯）

### 注意点

1. 通过`v-slot:name="data"`在宿主组件中对具名和作用域进行定义（`v-shot`缩写为`#`），其中`data`是对象类型，成员组件中可以对某个作用域插槽传入多个数据，实现多数据通讯和扩展，宿主组件可以通过解构的方式将数据提取出来

2. 子组件中通过`name="slotName"`对插槽进行命名，通过`:item="item"`将数据定向传入插槽中供消费

3. 如果消费方未给插槽传入内容，则按照默认的`<slot/>`内容进行渲染展示

宿主组件

```vue
<template>
    <div id="app">
        <HelloWorld :dataList="dataList">
            <template v-slot:content="{ item }">
                <div style="color: red">
                    {{ item.text }}
                </div>
            </template>
            <template v-slot:footer="{ item }">
                <p style="color: blue">
                    {{ item.id }}
                </p>
            </template>
        </HelloWorld>
    </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
export default {
    name: "App",
    components: {
        HelloWorld,
    },
    data() {
        return {
            dataList: [
                { id: 0, text: "a" },
                {
                    id: 1,
                    text: "b",
                },
                {
                    id: 2,
                    text: "c",
                },
            ],
        };
    },
};
</script>
```

成员组件

```vue
<template>
    <div>
        <p>HelloWorld</p>
        <ul>
            <li v-for="(item, index) in dataList" :key="index">
                <slot name="content" :item="item" :item2="itesm">
                    {{ item.text }}</slot
                >
            </li>
        </ul>

        <ol>
            <li v-for="item in dataList" :key="item.id">
                <slot name="footer" :item="item"> {{ item.id }}</slot>
            </li>
        </ol>
    </div>
</template>

<script>
export default {
    props: ["dataList"],
};
</script>
```

### 【核心】解读插槽设计

**插槽的设计类比于 JS 中对数据源进行遍历和处理，其中处理的模式类别插槽的内容，数据源类比传入成员组件的数据**

**JS 处理的是逻辑，插槽处理的是视图**

```js
// 类比成员组件对预留的插槽
function each(list, fn) {
    list.forEach((element) => {
        fn(element);
    });
}

// 类比宿主组件对插槽的消费
each([1, 2, 3], () => {...});
```

## 三、自定义指令 Vue.directive

官网介绍：https://v2.cn.vuejs.org/v2/guide/custom-directive.html#ad

以自定义 input 输入框自动聚焦为例，介绍自定义指令

### 生命周期钩子

一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

1. `bind`
2. `inserted`
3. `update`
4. `componentUpdated`
5. `unbind`

钩子的入参： `el`、`binding`、`vnode` 和 `oldVnode`

### 全局注册

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive("focus", {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el, binding) {
        // 聚焦元素
        el.focus();
    },
});
```

### 局部注册

组件内接受一个 `directives` 选项

```js
directives: {
  focus: {
    // 指令的定义
    inserted: function (el, binding) {
      el.focus()
    }
  }
}
```

### 消费

```vue
<template>
    <div>
        <input type="text" v-focus:foo.a.b="100 + 200" />
    </div>
</template>
```

## 四、动态组件（keep-alive 缓存）

### 核心：

1. `keep-alive` 元素包裹需要缓存的元素
2. `<component :is="activateId"></component>` 控制当前需要展示的组件，`activateId`为当前需要激活的、已注册的组件名

### 进阶

1. 生命周期钩子：组件切换时会激活生命周期钩子`activate, deactivate`
2. 控制参与：`include, exclude`控制指定的组件参与激活和缓存

### 示例

宿主组件

```vue
<template>
    <div>
        <button @click="handleChange('HelloWorld')">hello</button>
        <button @click="handleChange('NewWorld')">new</button>
        <button @click="handleChange('OldWorld')">old</button>

        <keep-alive include="HelloWorld,NewWorld" exclude="OldWorld">
            <component :is="activateName"></component>
        </keep-alive>
    </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";
import NewWorld from "@/components/NewWorld.vue";
import OldWorld from "@/components/OldWorld.vue";

export default {
    name: "App",
    components: {
        HelloWorld,
        NewWorld,
        OldWorld,
    },
    data() {
        return {
            activateName: "HelloWorld",
        };
    },

    methods: {
        handleChange(name) {
            this.activateName = name;
        },
    },
};
</script>
```

其中一个成员组件

```vue
<template>
    <div>
        <h1>hello world</h1>
        <button @click="count += 100">add</button>
        <h2>{{ count }}</h2>
    </div>
</template>

<script>
export default {
    data() {
        return {
            count: 0,
        };
    },
    activated() {
        console.log("hello world -- activated");
    },
    deactivated() {
        console.log("hello world -- deactivated");
    },
};
</script>

<style lang="less" scoped></style>
```

## 五、Vue Plugin 插件

### 作用

1. 添加全局函数
2. 添加全局资源 - 组件、指令
3. 混入一些组件选项
4. 添加 `Vue` 的实例方法

> `VueRouter` 和 `Vuex` 等前端 JS 生态库都是通过这种方式在 Vue 中注册和使用

### 使用

在 `main.js` 中进行定义和注册

```js
// main.js
import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

// vue plugin
/**
 * 1. 添加全局函数
 * 2. 添加全局资源 - 组件、指令
 * 3. 混入一些组件选项
 * 4. 添加 Vue 的实例方法
 */
const MyPlugin = {
    install(Vue, options) {
        console.log("Vue", Vue);
        console.log("Vue", options);

        // 1. 添加全局函数
        Vue.console = (...args) => {
            console.log(...args);
        };

        // 2. 添加全局资源 - 组件、指令
        Vue.component("el-button", {
            template: "<button>el - button</button>",
        });

        Vue.directive("focus", {
            inserted(el) {
                el.focus();
            },
        });

        // 3. 混入一些组件选项
        Vue.mixin({
            created() {
                console.log("from my plugin........");
            },
        });
        // 4. 添加 Vue 的实例方法
        // 组件中通过 this.$http() 调用
        Vue.prototype.$http = () => {
            console.log("http.......");
        };
    },
};

// 注册 plugin
Vue.use(MyPlugin, { a: 1, b: 2, c: 3 });

new Vue({
    render: (h) => h(App),
}).$mount("#app");
```

## 六、provide/inject

### `provide` 的形式

对象形式和函数形式

> 对象形式时，如果需要将父组件的`this`上下文传给子组件，此时会出问题，需要改成工厂函数的形式

#### 对象形式

```js
export default {
    provide: {
        key: value,
    },
};
```

#### 工厂函数形式

```js
export default {
    provide() {
        return {
            key: value,
        };
    },
};
```

### 6.1 provide/inject 将属性和方法注入给跨层级组件

✨✨✨ 父组件可以将属性和方法传给子组件

使用场景：

1. 传属性给跨层级组件
    > ✅ 进阶：传自身实例给跨层级组件
2. 传方法给跨层级组件
    > ✅ 进阶：传回调方法给跨层级组件

// 父组件

```vue
<template>
    <div>
        <new-world
            ref="world"
            title="new world title"
            @clickA="handleA"
            @clickB="handleB"
        ></new-world>
        <old-world></old-world>
        <h1>{{ message }}</h1>
    </div>
</template>

<script>
import NewWorld from "@/components/NewWorld.vue";
import OldWorld from "@/components/OldWorld.vue";

export default {
    name: "App",
    provide() {
        return {
            // 1. 属性
            title: "provide title from app.vue",
            // 2. 自身实例上下文
            getAppThis: this,
            // 3. 方法
            handleHttpClick: this.handleHttpClick,
            // 4. 回调方法
            changeMessage: this.changeMessage,
        };
    },

    components: {
        NewWorld,
        OldWorld,
    },

    data() {
        return {
            message: "app.vue",
        };
    },

    methods: {
        handleHttpClick() {
            this.$http();
            console.log(this.$refs.world.getHttp());
        },
        changeMessage(val) {
            this.message = val;
        },
    },
};
</script>
```

// 子组件

```vue
<template>
    <div>
        <div>--------------- hello world ---------------</div>
        <button @click="getInfo">getInfo</button>
        <h2>{{ title }}</h2>
        <div>--------------- hello world ---------------</div>
    </div>
</template>

<script>
export default {
    inject: ["title", "getAppThis", "handleHttpClick", "changeMessage"],

    methods: {
        getInfo() {
            // 3. 调用宿主组件实例上的方法
            this.getAppThis.handleHttpClick();
            // 4. 调用宿主组件注入的回调方法
            this.changeMessage("HelloWorld.vue");
        },
    },

    mounted() {
        console.log("getAppThis...", this.getAppThis);
        this.handleHttpClick();
    },
};
</script>
```

### 6.2 宿主组件通过向跨层级组件注入回调函数 收集跨层级组件实例

✨✨✨ 层级组件在挂载时将自身的实例传给宿主组件缓存，宿主组件可以调用子组件上的方法

// 宿主组件

```vue
<template>
    <div>
        <button @click="getChildrenList">getChildrenList</button>
        <new-world></new-world>
        <old-world></old-world>
        <h1>{{ childrenList.length }}</h1>
    </div>
</template>

<script>
import NewWorld from "@/components/NewWorld.vue";
import OldWorld from "@/components/OldWorld.vue";

export default {
    name: "App",
    provide() {
        return { appendChildren: this.appendChildren };
    },

    components: {
        NewWorld,
        OldWorld,
    },
    data() {
        return {
            childrenList: [],
        };
    },

    methods: {
        appendChildren(children) {
            this.childrenList.push(children);
        },

        getChildrenList() {
            console.log("this.childrenList: ", this.childrenList);
        },
    },
};
</script>
```

// 跨层级组件

```vue
<template>
    <div>
        new world
        <hello-world ref="hello"> </hello-world>
    </div>
</template>

<script>
import HelloWorld from "./HelloWorld.vue";
export default {
    inject: ["appendChildren"],
    components: {
        HelloWorld,
    },
    data() {
        return {
            count: 0,
        };
    },
    mounted() {
        this.appendChildren(this);
    },
};
</script>
```

## 七、$attrs 属性, $listeners 属性

### $attrs 属性

1. `$attrs` 属性将父组件定义给子组件的属性进行收集，正在子组件中可以访问`$attrs`获取数据

    > 包含了父作用域中不作为 `props` 被识别（且获取）的 `attribute` 绑定（`class` 和 `style` 除外）

2. 可以使用`v-bind="$attrs"`的方式将自身的属性透传给子组件，属性默认是挂载到子组件的根元素上

    > 当一个组件没有声明任何 `prop` 时，这里会包含所有父作用域的绑定（`class` 和 `style` 除外），并且可以通过` v-bind="$attrs"` 传入内部组件

3. 若子组件无需集成父组件的属性，可以在`export default`对象中设置 `inheritAttrs: false` 去除继承属性的行为

// 父组件

```vue
<template>
    <div>
        <new-world
            ref="world"
            title="new world title"
            @clickA="handleA"
            @clickB="handleB"
        ></new-world>
        <old-world></old-world>
    </div>
</template>
```

// 子组件

```vue
<script>
export default {
    inheritAttrs: false,
    mounted() {
        console.log(this.$attrs);
    },
};
</script>
```

### $listeners 事件监听属性

1. 与 `$attrs`属性类似，`$listeners`包 含了父作用域中的（不含`.native`修饰器的）`v-on` 事件监听器
2. 它可以通过 `v-on="$listeners"` 传入内部组件

// 父组件

```vue
<template>
    <div>
        <h1>new world</h1>
        <button @click="count += 100">add</button>
        <h2>{{ count }}</h2>
        <hello-world ref="hello" @size="getSize" v-on="$listeners">
        </hello-world>
        <h2>{{ title }}</h2>
    </div>
</template>
```

// 子组件

```vue
<script>
export default {
    inheritAttrs: false,
    mounted() {
        console.log(this.$listeners);
    },
};
</script>
```
