#!/bin/bash

# 部署目录
CfgDir=~/workspace/verdaccio
# 对外暴露的端口，供前端开发人员访问
ExportPort=9020

CurDir=$(cd $(dirname $0);pwd)

if [ -e ${CfgDir} ];then
  echo "🚀 ${CfgDir}目录已经存在"
else
  mkdir ${CfgDir}
  mkdir ${CfgDir}/storage
  mkdir ${CfgDir}/plugins
  mkdir ${CfgDir}/conf
  touch ${CfgDir}/conf/htpasswd
  cp ${CurDir}/verdaccio-config.yaml ${CfgDir}/conf/config.yaml

  # 修改所属用户:所属组
  # sudo chown -R 10001:65533 ${CfgDir}/conf/config.yaml

  # 修改权限
  sudo chmod -R 777 ${CfgDir}
  # sudo chmod 777 ${CfgDir}/conf/config.yaml

  echo "🚀 新建目录完成"
fi

# 运行docker
docker run -dit --name verdaccio \
  -p ${ExportPort}:4873 \
  -v ${CfgDir}/conf:/verdaccio/conf \
  -v ${CfgDir}/storage:/verdaccio/storage \
  -v ${CfgDir}/plugins:/verdaccio/plugins \
  verdaccio/verdaccio:5.27.0
