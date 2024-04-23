# verdaccio 私有源部署

常用部署方式有两种：docker 、pm2，这里只介绍 docker 部署

部署需要的资源：docker、deploy 文件夹

## 部署

将 `deploy` 上传到服务器上，在 `deploy` 目录下执行 `./bash.sh`

## 维护

部署完成后，日常维护涉及到两个文件 `${CfgDir}/conf/config.yaml` 和 `${CfgDir}/conf/htpasswd`

`config.yaml` 文件是 verdaccio 的配置文件，`htpasswd` 里面包含了已经注册的账户

### 账号管理

1. 新增账号

将 `config.yaml` 中的 `max_users` 值加 1（可能需要重启服务），然后在任意设备上执行 `npm adduser --registry <verdaccio 部署的 IP 和端口>`，根据命令行提示输入账号名、密码、邮箱，把新的账号密码邮箱发给对方。

2. 删除账号

删除 `htpasswd` 文件中指定账户名所在行

3. 重置密码

删除账号后用相同的账号、新密码、邮箱创建账号
