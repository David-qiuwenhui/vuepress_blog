module.exports = {
    base: "/vuepress_blog/",
    title: "Qiuwenhui的博客",
    description: "Front-End",
    theme: "reco",
    locales: {
        "/": {
            lang: "zh-CN",
        },
    },
    themeConfig: {
        subSidebar: "auto",
        lastUpdated: true,
        nav: [
            { text: "首页", link: "/" },
            {
                text: "qiuwenhui 的博客",
                items: [
                    {
                        text: "掘金",
                        link: "https://juejin.cn/user/1359458133621677",
                    },
                    {
                        text: "Github",
                        link: "https://github.com/David-qiuwenhui",
                    },
                ],
            },
        ],
        head: [["link", { rel: "icon", href: "/favicon.ico" }]],
        sidebar: [
            {
                title: "首页",
                path: "/",
                collapsable: false, // 是否折叠
                children: [{ title: "介绍", path: "/" }],
            },
            {
                title: "博客搭建",
                path: "/blog/blog1",
                collapsable: false, // 是否折叠
                children: [
                    { title: "搭建 VuePress 博客", path: "/blog/blog1" },
                ],
            },
            {
                title: "JS 基础篇",
                path: "/handbook/blog1",
                collapsable: false,
                children: [
                    { title: "Clean Code 案例", path: "/handbook/blog1" },
                    { title: "JS 工具函数集合", path: "/handbook/blog2" },
                    { title: "ES6 核心特性", path: "/handbook/blog3" },
                    { title: "JS 代码评审", path: "/handbook/blog4" },
                ],
            },
            {
                title: "Vue JS框架",
                path: "/vue/blog1",
                collapsable: false, // 是否折叠
                children: [
                    { title: "Vue2 进阶用法", path: "/vue/blog1" },
                    { title: "Vue2 调试方式", path: "/vue/blog2" },
                    { title: "Vue2 补充用法", path: "/vue/blog3" },
                ],
            },
            {
                title: "工程化",
                path: "/engineering/blog1",
                collapsable: false, // 是否折叠
                children: [
                    { title: "Git 版本控制", path: "/engineering/blog1" },
                ],
            },
            {
                title: "工程化",
                path: "/other/blog1",
                collapsable: false, // 是否折叠
                children: [
                    { title: "码字练习 - 键盘侠", path: "/other/blog1" },
                ],
            },
        ],
    },
    // 代码复制插件
    plugins: [["vuepress-plugin-code-copy", true]],
};
