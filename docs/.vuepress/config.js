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
        sidebar: [
            {
                title: "欢迎学习",
                path: "/",
                collapsable: false, // 是否折叠
                children: [{ title: "博客简介", path: "/" }],
            },
            {
                title: "基础篇",
                path: "/handbook/blog1",
                collapsable: false,
                children: [
                    { title: "搭建 VuePress 博客", path: "/handbook/blog1" },
                    { title: "Git 版本控制", path: "/handbook/blog2" },
                    { title: "Clean Code 案例", path: "/handbook/blog3" },
                    { title: "JS 工具函数集合", path: "/handbook/blog4" },
                    { title: "ES6 核心特性", path: "/handbook/blog5" },
                    { title: "JS 代码评审", path: "/handbook/blog6" },
                ],
            },
        ],
    },
    // 代码复制插件
    plugins: [["vuepress-plugin-code-copy", true]],
};
