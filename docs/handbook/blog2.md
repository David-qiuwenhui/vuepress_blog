---
title: Git 版本控制
author: qiuwenhui
date: "2023-10"
---

# Git 版本控制 test

## 零、配置公私钥

`ssh-keygen -t rsa -C "1059713136@qq.com"`
三次回车确定默认选项
公钥`id_rsa.pub`和私钥`id_ras`存放地址`cd ~/.ssh`
查看公钥内容`cat id_rsa.pub`
**<u>建立 git 远程连接时 用户名的密码是 personal token</u>**

将公钥复制到 github setting 后，本地测试是否配置成功
`ssh -T git@github.com`

[菜鸟教程-Git Github](https://www.runoob.com/git/git-remote-repo.html)

## 一、git 工具初始配置

`git config --global --list` 查看全局的配置信息
`git config --global user.name "David-qiuwenhui"`
`git config --global user.email "1059713136@qq.com"`

## 二、从 github 创建新仓库，关联本地和远程仓库的引导

```bash
# create a new repository on the command line
echo "# git_repo" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/David-qiuwenhui/git_repo.git
git push -u origin main
```

```bash
# push an existing repository from the command line
git remote add origin https://github.com/David-qiuwenhui/git_repo.git
git branch -M main
git push -u origin main
```

> 注意 📢：clone 远程仓库指定分支到本地
> `git clone -b [branch_name] [repo_url]`

### 查看 git 远程连接信息

#### （1）查看 git 的远程仓库地址

`git remote`
`git remote -v`
`git remote show origin` 查看仓库更详细的信息

#### （2）添加删除远程连接

添加远程仓库地址`add`
`git remote add <remote_name> <remote_url>`
删除远程仓库地址`remove`
`git remote remove xxx`

## 三、git 本地仓库初始化配置

### （1）初始化

`git init` 初始化本地仓库 git
`git status` 查看 git 状态

### （2）配置远程仓库

`git remote add origin https://gitee.com/qiu-wenhui/javascript-algorithm` 添加远程仓库
`git remote` 查看远程的仓库名
`git remote -v` 查看远程仓库地址
`git remote rm origin` 删除远程仓库

`git add .` 添加到暂存区
`git commit -m "some comment"`添加到本地仓库
`git commit`

> 注意 📢：使用`git-cz`进行 commit 更加规范

### （3）变更推送

`git push -u origin main` 推送到远程仓库（并设置本地和远程仓库推送关联）
`git push --set-upstream origin dev` 设置 branch 的远程推送的分支为 dev 分支

> 简写形式：`git push -u origin dev`

`git push origin HEAD`推送至远程同名分支
`git push origin HEAD:master`推动到远程的上游分支

> 注意 📢：如果遇到`git push`超时，需要将`https`通道换成`ssh`通道

### （4）上次提交的`commit`信息查看

`git show`查看上次提交的 commit 信息

> 包含上次提交的 commit id、作者信息（邮箱和姓名）、提交日期、commit message、代码 diff 等

![image-20220423113140707](/Users/qiuwenhui/Library/Application Support/typora-user-images/image-20220423113140707.png)

## 四、查看和修改 git 的 branch

### （1）查看分支

`git branch -a` 查看所有分支
`git branch -r` 查看远程分支
`git branch -vv` 查看本地分支及追踪的分支

### （2）新建分支

`git branch [branch name]`

### （3）新建分支并切换至新建的分支

`git checkout -b [branch]`
`git checkout [branch] 切换分支`

### （4）合并指定分支到当前分支

`git merge [branch]`

### （5）重命名和删除分支

重命名本地分支
`git branch -m [old_name] [new_name]`
删除**本地**分支
`git branch --delete [branch]`
删除**远程**分支
`git push origin --delete [branch]`
将本地仓库 push 到 github 仓库 main 分支
`git push -u origin main`

> 检查未合并的分支：`git branch --no-merged`
> 检查已合并的分支：`git branch --merged`
> 根据历史记录恢复删除的分支：`git checkout -b [branch_name] [commit_hash]`

## 五、拉取远程仓库至本地（更新与合并）

### （1）方式一：`fetch, merge`

1. 从远程仓库下载新分支与数据
   `git fetch origin`
2. 从远端仓库提取数据并尝试合并到当前分支
   `git merge origin/main`

![img](https://www.runoob.com/wp-content/uploads/2015/03/main-qimg-00a6b5a8ec82400657444504c4d4d1a7.png)

### （2）方式二：`pull`

`git pull` 更新我们的本地仓库至最新改动

> 即等效 `git fetch + git merge`

> 注意 📢：完整语法 `git pull <远程主机名> <远程分支名>:<本地分支名>`
> 示例：`git pull origin master:main`
> 不输入本地名，则拉取合并远程分支至本地同名分支

`git merge [branch]` 合并其他分支到我们的当前分支
两种情况下，git 都会尝试去自动合并改动。但是，如果存在代码冲突，就需要我们手动合并这些 冲突（conflicts）。改完之后，我们需要执行如下命令以将它们标记为合并成功：
`git add <filename>`
在合并改动之前，也可以使用如下命令查看：
`git diff <source_branch> <targe_branch>`

## 六、Git 查询历史记录和版本回退

### 查询历史记录

（1）查看状态（`work dir`区和`stage`区）
`git status`
（2）查看日志（`history`区）
`git log`, `git log --oneline`

> 美化日志`git log --graph --oneline --decorate`
> （3）查看操作日志
> `git reflog`

### 版本回退

#### （1）需求一：

【描述】：如果修改的内容已经`add`到`stage`区，使用`checkout`将暂存区中记录的文件覆盖工作目录的文件
恢复单个文件
`git checkout [file_name]`
恢复暂存区中记录的所有文件
`git checkout .`

> 注意 📢：`checkout`仅能从暂存区中恢复已经记录的文件，若本地有新增文件的情况，则不会进行删除操作

#### （2）需求二

【描述】：将 `stage` 区的文件还原出来
还原单个文件
`git reset [file_name]`
还原暂存区中记录的所有文件
`git reset .`

> 实际上 reset 命令的完整写法如下：
> `git reset --mixed HEAD a.txt`
> 其中，mixed 是一个模式（mode）参数，如果 reset 省略这个选项的话默认是 mixed 模式；HEAD 指定了一个历史提交的 hash 值；a.txt 指定了一个或者多个文件。

> 该命令的自然语言描述是：不改变 `work dir` 中的任何数据，将 `stage` 区域中的 a.txt 文件还原成 HEAD 指向的 commit history 中的样子。就相当于把对 a.txt 的修改从 `stage` 区撤销，但依然保存在 `work dir` 中，变为 unstage 的状态。

#### （3）需求三

【描述】：将`history`中的文件还原至`work dir`区

1. 恢复至`HEAD`指针指向的 hash 记录
   `git checkout HEAD .`
   `work dir` 和 `stage` 中所有的「修改」都会被撤销，恢复成 HEAD 指向的那个 history commit。注意，`work dir`区中的新增的文件不会被撤销。

2. 定向恢复至 hash 记录
   找到目标 commit 的 HASH 值
   `git checkout 2bdf04a [file_name]`

## 七、`git stash`临时存储修改的内容

（1）临时存储记录-堆栈和出栈
`git stash`
`git stash pop`

> 为临时存储的记录添加注释：`git stash push -m "<stash_message>"`

（2）查看临时存储的记录
`git stash list`

（3）恢复存储的工作（不删除列表记录）
`git stash apply`

（4）删除存储的内容
定向删除单条存储记录
`git stash drop [stash_name]`
清空所有的存储记录
`git stash clear`

## 八、`.gitignore`文件规范

.gitignore 文件允许我们定义那些不应该被 Git 跟踪的文件或目录
（1）支持通配符：可以使用 \* 和 ? 等通配符

```bash
# 忽略所有 .log 文件
*.log
```

（2）忽略目录：可以忽略整个目录

```bash
# 忽略 node_modules 目录
node_modules/
```

（3）白名单：如果你想忽略某个目录，但想保留其中的某些文件，可以使用`!`

```bash
# 忽略所有 .config 文件，但保留 main.config
*.config
!main.config
```

## 九、发布新版本时创建新标签 🚩

### （1）创建标签 🚩

在本地创建新标签（轻量标签）
`git tag <tag_name>`
创建附注标签
`git tag -a <tag_name> -m "<message>"`

命名格式：
`v<major>.<minor>.<patch>`

+ major（主版本号）：重大变化
+ minor（次要版本号）：版本与先前版本兼容
+ patch（补丁号）：bug 修复

> 轻量标签：只是某个 commit 的引用，可以理解为是一个 commit 的别名；
> 附注标签：存储在 Git 仓库中的一个完整对象，包含打标签者的名字、电子邮件地址、日期时间以及其他的标签信息。它是可以被校验的，可以使用 GNU Privacy Guard (GPG) 签名并验证

### 推送标签

使用以下命令将标签推送到远程仓库：
推送本地所有的 tag：
`git push origin --tags`
推送指定的 tag：
`git push origin <tagname>`

### （2）查看标签 🚩

获取所有标签
`git tag`
查看某一个标签的详细信息
`git show <tagname>`
切换代码至标签分支
`git checkout <tagname>`

### （3）删除标签 🚩

删除本地仓库指定标签：
`git tag -d <tagname>`
删除远程仓库指定标签：
`git push origin --delete <tagname>`

### （4）将远程仓库的标签拉取到本地进行开发 🚩

`git checkout -b <branch> <tagname>`

## 十、git 进阶

（1）利用 `Git Hooks` 优化工作流程
Git Hooks 是 Git 仓库中的一些脚本，可以在各种 Git 操作（如提交、推送、接收更改等）的特定点自动触发。我们可以用它们来自动化或优化某些重复的任务。

（2）参考技术帖
https://juejin.cn/post/7111132724185792542#
