import {useState} from 'react';
import Doctor from './doctor';
import {log} from '@/utils';
import './index.less';

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

export function Enter0() {
  return (
    <div>
      <input className='input' placeholder='请输入...' />
      <h1>test</h1>
      <Parent>
        <Child />
      </Parent>
    </div>
  );
}

export default Doctor;
// export default Enter0;