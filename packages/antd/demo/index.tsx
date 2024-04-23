import React, { useEffect, type FC } from 'react';
// 引用当前 package 中的其他模块
import Input from '../input';
// 引用其他 package 中的模块
import { Add } from '@zl/utils';

interface IProps {
  /**
   * @description 我是属性描述
   * @default 我是默认值
   */
  title?: string;
}

const Demo: FC<IProps> = (props) => {
  useEffect(() => {
    console.log('Add Test', Add(4, 8));
  }, []);

  return (
    <>
      <Input />
      <h4>{props.title}</h4>
    </>
  );
};

export default Demo;
