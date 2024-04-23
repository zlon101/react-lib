# 介绍

[umijs](https://d.umijs.org/) 组件研发而生的静态站点框架


# 环境配置

pnpm@8.10.2、 npm@9.8.1、 nodejs@18.18.1

核心包：dumi + changeset + react + typescript + eslint + prettier + husky

## 配置私有源

1. 配置本机 npm registry

```bash
npm config set @zl:registry <私有源地址>
```

如：`npm config set @zl:registry http://12.12.12.12:8080`

该配置只会影响 `@zl` 前缀的 npm 包，如 `react` 之类的公共包不受影响，也不影响 `nrm` 使用

2. 登录到私有源

```bash
npm login --registry http://xxx:4873
```

这里需要输入账号密码，一般由管理员提供

登录后可以进行组件 publish、unpublish 操作

# 组件发布安装

发布组件需要先登录到私有源，修改组件源码后需要发布新版本时流程如下：

1. 生成 changeset

执行 `pnpm changeset` 并根据命令行提示选择需要发布的 package 及填写变更记录

2. 更新被发布包 package.json 的 version 字段

执行 `pnpm run version`，改命令会修改准备发布包的 package.json 中的 version 字段并更新 CHANGELOG.md

3. publish 到 npm 私有源

```bash
pnpm run publish
```

发布成功后可以在浏览器上输入<私有源地址>查看组件列表

4. 组件安装

安装 `@zl/*` 不需要登录私有源（可配置），直接使用 `npm install @zl/xx`，其他包管理同理。

5. 撤销已发布组件

```
npm unpublish @zl/hooks --force
```

# 组件开发


## 命令

**基础**

```bash
# install dependencies
$ pnpm install

# develop library by docs demo
$ pnpm start

# build library source code
$ pnpm run build

# build library source code in watch mode
$ pnpm run build:watch

# build docs
$ pnpm run docs:build

# check your project for potential problems
$ pnpm run doctor
```

**其他**

package 项目依赖，如 @zl/antd 需要引用 @zl/utils，在项目根目录下执行：

```bash
pnpm -F @zl/antd add @zl/utils
```

## 命名规范

1. 目录文件名大驼峰+index.ts

- className

  组件根类名唯一（目录名、文件名）

  组件样式

## 功能

- 组件内部国际化
  包含翻译字典

- 时间日期处理: dayjs
- 静态资源（图像、icon）iconfont
- 级联选择器：可搜索、服务端加载
- 项目全局状态
  项目初始化：
  当前账号信息：权限
  数据同步？

- api 管理工具 https://apifox.com/
- tz-antd：
- tz-pro-components：
- tz-utils
- tz-hooks
- 图表库
- 权限
  参考：https://umijs.org/docs/max/access#useaccess

- api/rxjs
- ahooks

# verdaccio 部署

> [verdaccio docs](https://verdaccio.org/docs/setup-npm)

1. 安装 verdaccio

```bash
npm install -g verdaccio@5.27.0
```

2. 运行 verdaccio

查看 `deploy` 中的 `README` 文档

# 参考资料

[umijs](https://d.umijs.org/)

[antd](https://4x-ant-design.antgroup.com/components/overview-cn/)

[ahooks](https://github.com/alibaba/hooks)

[verdaccio](https://verdaccio.org/)
