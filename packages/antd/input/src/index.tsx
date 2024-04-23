import React, { type FC } from 'react';

const Input: FC<IProps> = (props) => <input {...props} placeholder="请输入..." />;

export default Input;

export type IProps = {
  title?: string;
};
