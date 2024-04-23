import React, {useState} from 'react';
import {log} from '@/utils';

function Parent(props: any) {
  const {children} = props;
  const [num, setNum] = useState(0);

  log('render Parent', {num});
  return (
    <div>
      <div>{children}</div>
      <p>num: {num}</p>
      <button onClick={() => {
        setNum(num + 1);
      }}>setNum</button>
    </div>
  );
}

function Child() {
  log('render Child');
  return <p>Child</p>;
}

export default function Enter() {
  return (
    <div>
      <h1>test</h1>
      <Parent>
        <Child />
      </Parent>
    </div>
  );
}